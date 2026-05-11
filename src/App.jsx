import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Diagnostico from './components/Diagnostico';
import SalesScript from './components/SalesScript';
import ROI from './components/ROI';
import Demonstracao from './components/Demonstracao';
import Equipamentos from './components/Equipamentos';
import ProvaSocial from './components/ProvaSocial';
import Planos from './components/Planos';
import CommandCenter from './components/CommandCenter';
import ProposalPDFDocument from './components/ProposalPDFDocument';
import Login from './components/Login';
import SavedReports from './components/SavedReports';
import { pdf } from '@react-pdf/renderer';
import { Settings, Printer } from 'lucide-react';
import { DEFAULT_PLANOS, DEFAULT_TAXA, DEFAULT_DESCONTO_MAX, calculateROI } from './logic/roiEngine';
import { syncDataToSheet, processOfflineLeads, fetchValitagPlans } from './logic/syncEngine';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const DEFAULT_QUESTIONS = [
  { id: 'tipo_etiqueta', text: 'Como sua operação faz as etiquetas de validade?', inputType: 'options', options: [{label: 'Manual', value: 'manual'}, {label: 'Já uso etiquetas automatizadas', value: 'automatizada'}, {label: 'Não fazem', value: 'nao_fazem'}] },
  { id: 'dific_etiqueta', text: 'Sua equipe sente dificuldades em fazer etiquetas manuais e saber o periodo que cada produto/insumo vence?', inputType: 'options', options: [{label: 'Sim', value: 'sim'}, {label: 'Não', value: 'nao'}] },
  { id: 'qtd_insumos', text: 'Em torno de quantos insumos e produção é sua estimativa de ter na sua operação?', inputType: 'scale', unit: 'Itens', labels: '0,100,500,1000+', max: 1000 },
  { id: 'colaboradores', text: 'Quantos colaboradores sua empresa possui?', inputType: 'scale', unit: 'Pessoas', labels: '1,5,10,20,50+', max: 50 },
  { id: 'guia_checklist', text: 'Você vê necessidade de ter um guia de operações tipo um checklist para sua equipe?', inputType: 'options', options: [{label: 'Sim', value: 'sim'}, {label: 'Não', value: 'nao'}] },
  { id: 'controle_estoque', text: 'Você possui algum controle de estoque, se sim como voce julgaria a eficiencia?', inputType: 'options', options: [{label: 'Não possuo', value: 'nenhum'}, {label: 'Manual (Baixa)', value: 'baixa'}, {label: 'Sistema (Alta)', value: 'alta'}] },
  { id: 'cmv', text: 'Qual o seu CMV atual?', inputType: 'scale', unit: '%', labels: '0,20,30,40,50+', max: 50 },
  { id: 'perda_insumos', text: 'Qual a sua estimativa de perda de insumos caros (Proteína, laticínios) na validade e má manipulação por semana?', inputType: 'scale', unit: 'Kg', labels: '0,5,10,20,50+', max: 50 },
  { id: 'fiscalizacao', text: 'Você já teve problemas com a fiscalização?', inputType: 'options', options: [{label: 'Sim', value: 'sim'}, {label: 'Não', value: 'nao'}] },
  { id: 'erros_equipe', text: 'Quantos erros e retrabalho sua equipe comete por não escutar você?', inputType: 'options', options: [{label: 'Muitos (Perda alta)', value: 'alta'}, {label: 'Alguns', value: 'media'}, {label: 'Quase nenhum', value: 'baixa'}] },
];

import etiq1 from './assets/etiqueta 50x30 bopp.png';
import etiq2 from './assets/Etiqueta 60x40 Bopp.png';
import etiq3 from './assets/Etiqueta 60x60 bopp.png';

const DEFAULT_DEMOS = [
  { id: Date.now().toString(), name: 'Visão Geral Valitag', url: 'https://app.supademo.com/demo/cmoh83h4028ucza2i09xgfzaz' }
];

function App() {
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfig, setShowConfig] = useState(false);
  const [showSavedReports, setShowSavedReports] = useState(false);
  
  const [fat, setFat] = useState('');
  const [planoId, setPlanoId] = useState('starter');
  const [licencasAdicionais, setLicencasAdicionais] = useState(0);
  
  const [estabelecimento, setEstabelecimento] = useState('');
  const [proprietario, setProprietario] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [descontoTaxa, setDescontoTaxa] = useState(false);
  const [descontoRs, setDescontoRs] = useState('');
  const [descontoPlanoRs, setDescontoPlanoRs] = useState(0);
  const [descontoLicencasRs, setDescontoLicencasRs] = useState(0);
  const [descontoSetupLicencasRs, setDescontoSetupLicencasRs] = useState(0);
  const [validadeProposta, setValidadeProposta] = useState('3 dias');
  const [validadeSetup, setValidadeSetup] = useState('48 horas');
  const [skipDiagnostic, setSkipDiagnostic] = useState(false);
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [responses, setResponses] = useState({});
  const [team, setTeam] = useState({});
  const [demoModules, setDemoModules] = useState(DEFAULT_DEMOS);
  const [linksConfig, setLinksConfig] = useState({
    site: 'https://valitag.com.br',
    onboarding: '',
    impressoras: '',
    etiquetas: '',
    customLinks: []
  });
  const [hardwareConfig, setHardwareConfig] = useState({
    impressoras: [
      { id: '1', nome: 'Marca 1', imageUrl: '', linkCompra: '', beneficios: '' },
      { id: '2', nome: 'Marca 2', imageUrl: '', linkCompra: '', beneficios: '' },
      { id: '3', nome: 'Marca 3', imageUrl: '', linkCompra: '', beneficios: '' }
    ],
    impressoraUrl: '',
    beneficios: '',
    etiquetas: [
      { id: '1', tamanho: '50x30mm Bopp', imageUrl: etiq1, linkCompra: '' },
      { id: '2', tamanho: '60x40mm Bopp', imageUrl: etiq2, linkCompra: '' },
      { id: '3', tamanho: '60x60mm Bopp', imageUrl: etiq3, linkCompra: '' }
    ]
  });
  const [pricingConfig, setPricingConfig] = useState({
    planos: DEFAULT_PLANOS,
    taxa: DEFAULT_TAXA,
    descontoMax: DEFAULT_DESCONTO_MAX,
    precoLicencaExtra: 147,
    taxaLicencaExtra: 700
  });

  useEffect(() => {
    const savedClient = localStorage.getItem('valitag_client_data');
    if (savedClient) {
      const data = JSON.parse(savedClient);
      if (data.estabelecimento) setEstabelecimento(data.estabelecimento);
      if (data.proprietario) setProprietario(data.proprietario);
      if (data.responsavel) setResponsavel(data.responsavel);
    }
    
    const savedQuestions = localStorage.getItem('valitag_sales_script');
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    
    const savedResponses = localStorage.getItem('valitag_responses');
    if (savedResponses) setResponses(JSON.parse(savedResponses));
    const savedStep = localStorage.getItem('valitag_current_step');
    if (savedStep) setCurrentStep(parseInt(savedStep));
    
    const savedSkip = localStorage.getItem('valitag_skip_diagnostic');
    if (savedSkip) setSkipDiagnostic(savedSkip === 'true');
    
    const savedTeam = localStorage.getItem('valitag_team');
    if (savedTeam) setTeam(JSON.parse(savedTeam));

    const savedDemos = localStorage.getItem('valitag_modules');
    if (savedDemos) setDemoModules(JSON.parse(savedDemos));

    const savedLinks = localStorage.getItem('valitag_links_config');
    if (savedLinks) setLinksConfig(JSON.parse(savedLinks));

    const savedHardware = localStorage.getItem('valitag_hardware');
    if (savedHardware) {
      const parsed = JSON.parse(savedHardware);
      if (parsed.etiquetas) {
        parsed.etiquetas = parsed.etiquetas.map((e, idx) => ({
          ...e,
          imageUrl: e.imageUrl || [etiq1, etiq2, etiq3][idx] || ''
        }));
      }
      setHardwareConfig(parsed);
    }

    const savedPricing = localStorage.getItem('valitag_pricing_config');
    if (savedPricing) {
      setPricingConfig(JSON.parse(savedPricing));
    }

    // Tentar atualizar silenciosamente os planos via API
    (async () => {
      const apiPlanos = await fetchValitagPlans();
      if (apiPlanos) {
        setPricingConfig(prev => {
          const mergedPlanos = { ...prev.planos };
          Object.keys(apiPlanos).forEach(key => {
            const isVisible = mergedPlanos[key]?.visible !== undefined ? mergedPlanos[key].visible : true;
            mergedPlanos[key] = {
              ...apiPlanos[key],
              visible: isVisible
            };
          });

          const newConfig = {
            ...prev,
            planos: mergedPlanos
          };
          localStorage.setItem('valitag_pricing_config', JSON.stringify(newConfig));
          return newConfig;
        });
      }
    })();

    if (!localStorage.getItem('valitag_dispositivo_id')) {
      localStorage.setItem('valitag_dispositivo_id', 'device_' + Math.random().toString(36).substring(2, 15));
    }

    const savedUser = localStorage.getItem('valitag_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('valitag_user', JSON.stringify(user));
      setTeam({
        nome: user.nome,
        cargo: user.cargo || 'Consultor Valitag',
        foto: user.foto_url || ''
      });
    } else {
      localStorage.removeItem('valitag_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('valitag_current_step', currentStep.toString());
    
    // Rola para o topo tanto o window quanto o main container
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  useEffect(() => {
    if (pricingConfig?.webhookUrl) {
      processOfflineLeads(pricingConfig.webhookUrl);
    }
  }, [pricingConfig?.webhookUrl]);

  useEffect(() => {
    localStorage.setItem('valitag_pricing_config', JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  useEffect(() => {
    localStorage.setItem('valitag_client_data', JSON.stringify({
      estabelecimento, proprietario, responsavel
    }));
  }, [estabelecimento, proprietario, responsavel]);

  useEffect(() => {
    localStorage.setItem('valitag_sales_script', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('valitag_responses', JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    localStorage.setItem('valitag_modules', JSON.stringify(demoModules));
  }, [demoModules]);

  useEffect(() => {
    localStorage.setItem('valitag_links_config', JSON.stringify(linksConfig));
  }, [linksConfig]);

  useEffect(() => {
    localStorage.setItem('valitag_hardware', JSON.stringify(hardwareConfig));
  }, [hardwareConfig]);

  useEffect(() => {
    localStorage.setItem('valitag_skip_diagnostic', skipDiagnostic.toString());
  }, [skipDiagnostic]);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleSendProposal = async () => {
    const roiData = calculateROI(fat, planoId, descontoTaxa, parseFloat(descontoRs) || 0, descontoPlanoRs, descontoLicencasRs, descontoSetupLicencasRs, questions, responses, pricingConfig, licencasAdicionais);
    const leadData = {
      data: new Date().toLocaleDateString('pt-BR'),
      estabelecimento: estabelecimento || 'N/A',
      responsavel: responsavel || 'N/A',
      faturamento: fat || 0,
      cmv: responses['cmv'] || 'N/A',
      total_sangria: roiData.totalPerdaAnual || 0,
      plano_escolhido: pricingConfig?.planos[planoId]?.nome || 'N/A',
      vendedor_id: localStorage.getItem('valitag_dispositivo_id') || 'desconhecido'
    };
    syncDataToSheet(pricingConfig?.webhookUrl, leadData, 'lead');

    try {
      const { data, error } = await supabase
        .from('leads_roi')
        .insert([{ 
          nome_cliente: estabelecimento || 'Não informado', 
          roi_estimado: roiData.totalPerdaAnual || 0,
          vendedor_id: user?.id || null,
          dados_proposta: {
            estabelecimento, proprietario, responsavel, fat, responses, planoId,
            descontoRs, descontoTaxa, descontoPlanoRs, descontoLicencasRs,
            descontoSetupLicencasRs, licencasAdicionais, skipDiagnostic
          }
        }]);
        
      if (error) console.error('Erro ao salvar lead no Supabase:', error);
    } catch (err) {
      console.error('Falha de conexão com o Supabase:', err);
    }

    setIsGeneratingPdf(true);
    try {
      const doc = (
        <ProposalPDFDocument 
          estabelecimento={estabelecimento}
          proprietario={proprietario}
          responsavel={responsavel}
          fat={fat}
          planoId={planoId}
          descontoTaxa={descontoTaxa}
          descontoRs={parseFloat(descontoRs) || 0}
          descontoPlanoRs={descontoPlanoRs}
          descontoLicencasRs={descontoLicencasRs}
          descontoSetupLicencasRs={descontoSetupLicencasRs}
          questions={questions}
          responses={responses}
          pricingConfig={pricingConfig}
          hardwareConfig={hardwareConfig}
          linksConfig={linksConfig}
          licencasAdicionais={licencasAdicionais}
          validadeProposta={validadeProposta}
          validadeSetup={validadeSetup}
          skipDiagnostic={skipDiagnostic}
        />
      );
      
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      const nomeCliente = estabelecimento ? estabelecimento.trim().replace(/[^a-zA-Z0-9 -]/g, '') : 'Cliente';
      const planoSelecionado = (pricingConfig?.planos[planoId]?.nome || 'Starter').replace(/[^a-zA-Z0-9 -]/g, '');
      const fileName = `Proposta_Valitag_${nomeCliente}_${planoSelecionado}.pdf`;
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 3000);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o arquivo PDF. Tente novamente.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleReset = () => {
    setEstabelecimento('');
    setProprietario('');
    setResponsavel('');
    setFat('');
    setResponses({});
    setCurrentStep(1);
  };

  if (!user) {
    return <Login supabase={supabase} onLogin={setUser} />;
  }

  return (
    <>
      {showConfig && (
        <CommandCenter 
          supabase={supabase}
          onClose={() => setShowConfig(false)}
          questions={questions} setQuestions={setQuestions}
          pricingConfig={pricingConfig} setPricingConfig={setPricingConfig}
          descontoRs={descontoRs} setDescontoRs={setDescontoRs}
          team={team} setTeam={setTeam}
          demoModules={demoModules} setDemoModules={setDemoModules}
          linksConfig={linksConfig} setLinksConfig={setLinksConfig}
          hardwareConfig={hardwareConfig} setHardwareConfig={setHardwareConfig}
        />
      )}

      {showSavedReports && (
        <SavedReports 
          user={user}
          supabase={supabase}
          onClose={() => setShowSavedReports(false)}
          onLoadProposal={(data) => {
            setEstabelecimento(data.estabelecimento || '');
            setProprietario(data.proprietario || '');
            setResponsavel(data.responsavel || '');
            setFat(data.fat || '');
          onLoadProposal={(d) => {
            setEstabelecimento(d.estabelecimento || '');
            setProprietario(d.proprietario || '');
            setResponsavel(d.responsavel || '');
            setFat(d.fat || '');
            setResponses(d.responses || {});
            setPlanoId(d.planoId || 'starter');
            setDescontoRs(d.descontoRs || '');
            setDescontoTaxa(d.descontoTaxa || false);
            setDescontoPlanoRs(d.descontoPlanoRs || 0);
            setDescontoLicencasRs(Number(d.descontoLicencasRs) || 0);
            setDescontoSetupLicencasRs(Number(d.descontoSetupLicencasRs) || 0);
            setLicencasAdicionais(Number(d.licencasAdicionais) || 0);
            setSkipDiagnostic(!!d.skipDiagnostic);
            setCurrentStep(6);
            setShowSavedReports(false);
          }}
        />
      )}

      <div className="print:hidden h-screen bg-[#0f172a] flex font-sans text-slate-100 overflow-hidden relative">
        
        <Sidebar currentStep={currentStep} setCurrentStep={setCurrentStep} />
        
        <main className="flex-1 overflow-y-auto h-full relative">
          <div className="p-8 pb-32 max-w-5xl mx-auto">
            {currentStep === 1 && (
              <Diagnostico 
                estabelecimento={estabelecimento} setEstabelecimento={setEstabelecimento}
                proprietario={proprietario} setProprietario={setProprietario}
                responsavel={responsavel} setResponsavel={setResponsavel}
                fat={fat} setFat={setFat}
                questions={questions}
                responses={responses} setResponses={setResponses}
                skipDiagnostic={skipDiagnostic} setSkipDiagnostic={setSkipDiagnostic}
              />
            )}

            {currentStep === 2 && (
              <ROI 
                estabelecimento={estabelecimento}
                proprietario={proprietario}
                responsavel={responsavel}
                fat={fat} 
                planoId={planoId} 
                descontoTaxa={descontoTaxa}
                descontoRs={parseFloat(descontoRs) || 0}
                descontoPlanoRs={descontoPlanoRs}
                descontoLicencasRs={descontoLicencasRs}
                descontoSetupLicencasRs={descontoSetupLicencasRs}
                questions={questions}
                responses={responses}
                pricingConfig={pricingConfig}
                licencasAdicionais={licencasAdicionais}
              />
            )}

            {currentStep === 3 && <Demonstracao demoModules={demoModules} />}
            {currentStep === 4 && <Equipamentos hardwareConfig={hardwareConfig} responses={responses} setResponses={setResponses} />}
            {currentStep === 5 && <ProvaSocial />}
            {currentStep === 6 && (
              <Planos 
                user={user}
                planoId={planoId} setPlanoId={setPlanoId}
                licencasAdicionais={licencasAdicionais} setLicencasAdicionais={setLicencasAdicionais}
                descontoTaxa={descontoTaxa} setDescontoTaxa={setDescontoTaxa}
                descontoRs={descontoRs} setDescontoRs={setDescontoRs}
                descontoPlanoRs={descontoPlanoRs} setDescontoPlanoRs={setDescontoPlanoRs}
                descontoLicencasRs={descontoLicencasRs} setDescontoLicencasRs={setDescontoLicencasRs}
                descontoSetupLicencasRs={descontoSetupLicencasRs} setDescontoSetupLicencasRs={setDescontoSetupLicencasRs}
                pricingConfig={pricingConfig}
                validadeProposta={validadeProposta} setValidadeProposta={setValidadeProposta}
                validadeSetup={validadeSetup} setValidadeSetup={setValidadeSetup}
              />
            )}
          </div>

          <div className="sticky bottom-0 left-0 w-full bg-[#0f172a]/90 backdrop-blur-sm border-t border-white/5 p-4 z-10 flex justify-between px-8 mt-8">
            {currentStep > 1 ? (
              <button 
                onClick={() => {
                  if (currentStep === 3 && skipDiagnostic) {
                    setCurrentStep(1);
                  } else {
                    setCurrentStep(currentStep - 1);
                  }
                }} 
                className="px-6 py-2.5 rounded-lg font-bold text-slate-300 hover:bg-[#1e293b] transition-colors"
              >
                Anterior
              </button>
            ) : <div/>}

            <div className="flex gap-4">
              {currentStep < 6 && (() => {
                const roiData = calculateROI(
                  fat, planoId, descontoTaxa, 
                  parseFloat(descontoRs) || 0, descontoPlanoRs, 
                  descontoLicencasRs, descontoSetupLicencasRs,
                  questions, responses, pricingConfig, licencasAdicionais
                );
                const isBlocked = currentStep === 1 && !skipDiagnostic && roiData.totalPerdaMensal === 0;

                return (
                  <div className="relative group">
                    <button 
                      onClick={() => {
                        if (!isBlocked) {
                          if (currentStep === 1 && skipDiagnostic) {
                            setCurrentStep(3);
                          } else {
                            setCurrentStep(currentStep + 1);
                          }
                        }
                      }}
                      disabled={isBlocked}
                      className={`px-8 py-2.5 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 ${
                        currentStep === 2 
                          ? 'bg-[#0084d1] hover:bg-blue-500 animate-[pulse_2s_ease-in-out_infinite]' 
                          : isBlocked 
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                            : 'bg-[#0084d1] hover:bg-blue-500'
                      }`}
                    >
                      {currentStep === 1 ? 'Gerar Relatório de ROI' : 'Próximo Passo'}
                    </button>
                    {isBlocked && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-[#1e293b] text-slate-200 text-xs rounded p-2 text-center shadow-xl border border-white/10 z-50">
                        Preencha os dados de diagnóstico para visualizar o impacto financeiro
                      </div>
                    )}
                  </div>
                );
              })()}

              {currentStep === 6 && (
                <button 
                  onClick={handleSendProposal}
                  disabled={isGeneratingPdf}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white shadow-[0_0_15px_rgba(0,132,209,0.4)] transition-all active:scale-95 ${isGeneratingPdf ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#0084d1] hover:bg-blue-500'}`}
                >
                  {isGeneratingPdf ? 'GERANDO PDF...' : <><Printer className="w-5 h-5" /> BAIXAR PROPOSTA PROFISSIONAL</>}
                </button>
              )}
            </div>
          </div>
        </main>

        <RightSidebar 
          supabase={supabase}
          user={user}
          team={team}
          estabelecimento={estabelecimento}
          responsavel={responsavel}
          onOpenConfig={() => setShowConfig(true)}
          onOpenSavedReports={() => setShowSavedReports(true)}
          onReset={handleReset}
          onSendProposal={handleSendProposal}
          onLogout={() => setUser(null)}
        />

      </div>
    </>
  );
}

export default App;
