import React from 'react';
import { calculateROI } from '../logic/roiEngine';
import { ShieldAlert, TrendingDown, Clock, CheckCircle, PlayCircle, Printer, Package, ExternalLink } from 'lucide-react';
import logoUrl from '../assets/logo-valitag.png.jpeg';
import imgElgin from '../assets/elginl42profull.png';
import imgZebra from '../assets/zebrazd230.jpg';
import imgArgox from '../assets/argoxos214ex.jfif';

const LOCAL_PRINTER_IMAGES = [imgElgin, imgZebra, imgArgox];

const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export default function ProposalPDF({ estabelecimento, proprietario, responsavel, fat, planoId, descontoTaxa, descontoRs, descontoPlanoRs, questions, responses, pricingConfig, demoModules, linksConfig, hardwareConfig }) {
  const roi = calculateROI(fat, planoId, descontoTaxa, descontoRs, descontoPlanoRs, questions, responses, pricingConfig);
  const plano = pricingConfig?.planos[planoId] || pricingConfig?.planos.starter;

  const modules = [
    { title: 'Perda por Validade', value: roi.perdaValidadeMensal, details: roi.detalhes?.validade || [] },
    { title: 'Quebra de Estoque', value: roi.perdaEstoqueMensal, details: roi.detalhes?.estoque || [] },
    { title: 'Eficiência Operacional', value: roi.prejuizoEficiencia, details: roi.detalhes?.eficiencia || [] }
  ].filter(m => m.value > 0).sort((a, b) => b.value - a.value);

  return (
    <div className="w-full text-slate-900 bg-white" style={{ fontFamily: 'sans-serif' }}>
      
      {/* PÁGINA 1: CAPA */}
      <div className="h-[296mm] w-[210mm] mx-auto p-[20mm] flex flex-col justify-center items-center overflow-hidden box-border print:break-after-page">
        <div className="text-center w-full max-w-lg space-y-8">
          <img src={logoUrl} alt="Valitag Logo" className="w-48 mx-auto mb-8 opacity-90 object-contain" />
          <div className="w-24 h-2 bg-[#0084d1] mx-auto rounded-full"></div>
          <h2 className="text-4xl font-bold text-slate-800 uppercase tracking-widest mt-8">Proposta Comercial</h2>
          <p className="text-2xl text-slate-500 font-light mt-4">E ANÁLISE DE ROI</p>
          
          <div className="mt-20 p-8 border-4 border-slate-100 rounded-3xl bg-slate-50/50">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Preparado para:</p>
            <p className="text-4xl font-black text-[#0084d1]">{estabelecimento || 'Cliente'}</p>
            {(proprietario || responsavel) && (
              <p className="text-lg text-slate-600 mt-4 font-medium">A/C: {[proprietario, responsavel].filter(Boolean).join(' e ')}</p>
            )}
          </div>
          
          <div className="mt-20">
            <p className="text-slate-400 font-medium">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
            <p className="text-slate-400 font-medium mt-1">Validade: 48 horas</p>
          </div>
        </div>
      </div>

      {/* PÁGINA 2: DIAGNÓSTICO (CUSTO DA INAÇÃO) */}
      <div className="h-[296mm] w-[210mm] mx-auto p-[15mm] flex flex-col overflow-hidden box-border print:break-after-page">
        <header className="border-b-2 border-slate-200 pb-4 mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">O Dossiê da Sangria</h2>
            <p className="text-slate-500">Mapeamento de perdas e gargalos identificados na sua operação.</p>
          </div>
          <img src={logoUrl} alt="Valitag" className="h-10 opacity-50" />
        </header>

        <div className="flex-1">
          {planoId === 'starter' ? (
            <div className="bg-blue-50 border border-blue-200 p-8 rounded-xl mb-8">
              <h3 className="font-bold text-blue-800 text-xl mb-2">Eficiência Operacional Projetada</h3>
              <p className="text-blue-900 text-lg">Esta economia reflete as horas de equipe poupadas na organização de validades, padronização de etiquetas e redução de tempo em processos manuais.</p>
            </div>
          ) : (
            responses['cmv'] >= 35 && (
               <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-5 rounded-r-xl">
                 <h3 className="font-bold text-red-800 text-lg">Alerta Crítico: CMV em Nível de Sangria</h3>
                 <p className="text-red-900 text-sm mt-1">O CMV selecionado de {responses['cmv']}% indica falta de controle rigoroso de validades e estoque, corroendo severamente a margem de lucro.</p>
               </div>
            )
          )}

          <div className="space-y-6">
            {modules.map((mod, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">{mod.title}</h4>
                  <span className="font-black text-red-600 text-lg">-{formatMoney(mod.value)}/mês</span>
                </div>
                <div className="p-4 bg-white">
                  <ul className="space-y-2">
                    {mod.details.map((det, i) => (
                      <li key={i} className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                        <span>{det.val} {det.unit} x {formatMoney(det.multiplier)}</span>
                        <span className="font-bold text-slate-800">{formatMoney(det.loss)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-slate-100 rounded-2xl p-8 border border-slate-200 text-center">
            <h3 className="text-xl font-bold text-slate-700 uppercase tracking-widest">O Custo da Inação Anual</h3>
            <p className="text-slate-500 mt-2 text-sm">Se nada for feito, este será o valor perdido no próximo ano.</p>
            <p className="text-6xl font-black text-red-600 mt-6 tracking-tighter">-{formatMoney(roi.totalPerdaAnual)}</p>
            <div className="mt-6 text-lg">
               <div className="text-slate-700 font-medium">Cada dia sem Valitag custa <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded">{formatMoney(roi.totalPerdaDiaria)}</span> para o seu caixa.</div>
            </div>
          </div>
        </div>
      </div>

      {/* PÁGINA 3: PLANOS E INVESTIMENTO */}
      <div className="h-[296mm] w-[210mm] mx-auto p-[15mm] flex flex-col overflow-hidden box-border print:break-after-page">
        <header className="border-b-2 border-slate-200 pb-4 mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Proposta de Investimento</h2>
            <p className="text-slate-500">A solução exata para blindar o seu lucro.</p>
          </div>
          <img src={logoUrl} alt="Valitag" className="h-10 opacity-50" />
        </header>

        <div className="flex-1 space-y-10">
          <div className="border-2 border-blue-600 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-blue-600 text-white p-6 text-center">
              <span className="uppercase font-bold tracking-widest text-blue-200 text-sm">Plano Selecionado</span>
              <h3 className="text-4xl font-black mt-2">{plano.nome}</h3>
            </div>
            <div className="p-10 bg-white text-center">
               <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">Investimento Mensal</div>
               {descontoPlanoRs > 0 ? (
                 <div className="flex flex-col items-center">
                   <span className="line-through text-slate-400 text-xl">{formatMoney(plano.preco)}</span>
                   <span className="text-6xl font-black text-blue-800 mt-2">{formatMoney(roi.custoPlano)}</span>
                 </div>
               ) : (
                 <span className="text-6xl font-black text-blue-800">{formatMoney(roi.custoPlano)}</span>
               )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <h4 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider">Resumo de Implantação</h4>
            <div className="flex justify-between items-center text-lg">
              <span className="text-slate-600 font-medium">Taxa Única de Implantação</span>
              {roi.custoImplantacao < pricingConfig?.taxa ? (
                 <div className="text-right">
                   <div className="line-through text-slate-400 text-sm">{formatMoney(pricingConfig?.taxa)}</div>
                   <div className="font-black text-2xl text-slate-800 mt-1">{formatMoney(roi.custoImplantacao)}</div>
                 </div>
              ) : (
                 <div className="font-black text-2xl text-slate-800">{formatMoney(roi.custoImplantacao)}</div>
              )}
            </div>
          </div>
          
           <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mt-12">
             <h4 className="text-green-800 font-bold uppercase tracking-widest mb-2">Previsão de Payback</h4>
             <p className="text-4xl font-black text-green-600">{roi.paybackDias > 0 ? `${Math.ceil(roi.paybackDias)} Dias` : 'Imediato'}</p>
             <p className="text-green-700 text-sm mt-3 font-medium">O sistema se paga rapidamente eliminando o desperdício diário mapeado.</p>
          </div>

          {demoModules && demoModules.length > 0 && (
            <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-8">
              <h4 className="text-blue-800 font-bold uppercase tracking-widest mb-6 text-center">Explore os Módulos do seu Plano</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoModules.map(mod => (
                  <a 
                    key={mod.id} href={mod.url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-xl text-[#0084d1] hover:bg-blue-50 transition-colors shadow-sm underline"
                  >
                    <PlayCircle className="w-6 h-6 shrink-0 text-[#0084d1]" />
                    <span className="font-bold text-sm">{mod.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PÁGINA DE EQUIPAMENTOS SUGERIDOS */}
      <div className="h-[296mm] w-[210mm] mx-auto p-[15mm] flex flex-col overflow-hidden box-border print:break-after-page">
        <header className="border-b-2 border-slate-200 pb-4 mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Equipamentos e Insumos Homologados</h2>
            <p className="text-slate-500">Hardware certificado para máxima performance da sua operação.</p>
          </div>
          <img src={logoUrl} alt="Valitag" className="h-10 opacity-50" />
        </header>

        <div className="flex-1 space-y-8">
          <div className="mb-6">
             <h3 className="text-xl font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Impressoras Compatíveis</h3>
             <div className="grid grid-cols-2 gap-6">
               {(hardwareConfig?.impressoras || []).map((imp, idx) => {
                 const benList = (imp.beneficios || '').split('\n').filter(b => b.trim() !== '');
                 return (
                   <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                     <div className="h-40 bg-white flex items-center justify-center p-4 border-b border-slate-100">
                       {(imp.imageUrl || LOCAL_PRINTER_IMAGES[idx]) ? (
                         <img src={imp.imageUrl || LOCAL_PRINTER_IMAGES[idx]} alt={imp.nome || 'Impressora'} className="max-h-full object-contain" />
                       ) : (
                         <Printer className="w-16 h-16 text-slate-300" />
                       )}
                     </div>
                     <div className="p-5 flex-1 flex flex-col">
                       <h4 className="text-lg font-bold text-slate-800 mb-3">{imp.nome || `Impressora ${idx + 1}`}</h4>
                       <ul className="space-y-2 mb-4 flex-1">
                         {benList.map((b, i) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                             <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                             <span>{b}</span>
                           </li>
                         ))}
                       </ul>
                       {imp.linkCompra && (
                         <a href={imp.linkCompra} target="_blank" rel="noreferrer" className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm" style={{ backgroundColor: '#0084d1', color: '#ffffff', textDecoration: 'none', cursor: 'pointer' }}>
                           Ver Equipamento no Mercado Livre <ExternalLink className="w-4 h-4" />
                         </a>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>

          <div>
             <h3 className="text-xl font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Etiquetas Homologadas</h3>
             <div className="grid grid-cols-3 gap-4">
               {(hardwareConfig?.etiquetas || []).map((etiq, idx) => (
                 <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                   <div className="h-24 bg-white rounded-lg flex items-center justify-center mb-3 border border-slate-100">
                     {etiq.imageUrl ? (
                       <img src={etiq.imageUrl} alt={etiq.tamanho} className="max-h-full object-contain" />
                     ) : (
                       <Package className="w-8 h-8 text-slate-300" />
                     )}
                   </div>
                   <p className="font-bold text-slate-700 text-sm mb-2">{etiq.tamanho}</p>
                   {etiq.linkCompra && (
                     <a href={etiq.linkCompra} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs w-full" style={{ backgroundColor: '#1e293b', color: '#ffffff', textDecoration: 'none', cursor: 'pointer' }}>
                       Comprar Agora
                     </a>
                   )}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* PÁGINA 4: PLANO DE IMPLEMENTAÇÃO */}
      <div className="h-[296mm] w-[210mm] mx-auto p-[15mm] flex flex-col justify-between overflow-hidden box-border print:break-after-page">
        <div>
          <header className="border-b-2 border-slate-200 pb-4 mb-8 flex justify-between items-end">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Próximos Passos</p>
              <h2 className="text-3xl font-bold text-slate-800">Plano de Implementação (7 Dias)</h2>
            </div>
            <img src={logoUrl} alt="Valitag" className="h-10 opacity-50" />
          </header>

          <div className="space-y-6">
            <p className="text-lg text-slate-600 mb-8 font-medium">A transição para a Valitag é projetada para ser rápida e sem impacto na sua operação atual. Em 7 dias, estancamos a sangria.</p>
            
            <div className="flex gap-6 items-start">
               <div className="bg-blue-100 text-blue-700 font-black text-xl w-14 h-14 rounded-xl flex items-center justify-center shrink-0">D1</div>
               <div className="pt-2">
                 <h4 className="font-bold text-xl text-slate-800">Setup e Integração</h4>
                 <p className="text-slate-600 mt-2 text-lg">Configuração da base de dados na nuvem e cadastro dos usuários. Seu ambiente Valitag criado e validado pela nossa engenharia.</p>
               </div>
            </div>

            <div className="flex gap-6 items-start">
               <div className="bg-blue-100 text-blue-700 font-black text-xl w-14 h-14 rounded-xl flex items-center justify-center shrink-0">D2</div>
               <div className="pt-2">
                 <h4 className="font-bold text-xl text-slate-800">Entrega Tecnológica</h4>
                 <p className="text-slate-600 mt-2 text-lg">Envio e configuração dos coletores inteligentes e impressoras de alta precisão diretamente na sua loja.</p>
               </div>
            </div>

            <div className="flex gap-6 items-start">
               <div className="bg-blue-100 text-blue-700 font-black text-xl w-14 h-14 rounded-xl flex items-center justify-center shrink-0">D3-D5</div>
               <div className="pt-2">
                 <h4 className="font-bold text-xl text-slate-800">Treinamento Prático</h4>
                 <p className="text-slate-600 mt-2 text-lg">Acompanhamento in-loco ou remoto com sua equipe. Focamos na mudança de cultura e no engajamento dos operadores.</p>
               </div>
            </div>

            <div className="flex gap-6 items-start">
               <div className="bg-blue-600 text-white font-black text-xl w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg">D7</div>
               <div className="pt-2">
                 <h4 className="font-bold text-xl text-slate-800">Go-Live Operacional</h4>
                 <p className="text-slate-600 mt-2 text-lg">Sistema operando 100%. Primeira rodada de auditoria concluída com painéis de resultados já gerando os primeiros relatórios de ROI.</p>
               </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-slate-200 pt-6 text-center text-slate-500 text-sm">
           <p className="font-bold">Acelere seus resultados. A inação custa {formatMoney(roi.totalPerdaDiaria)} por dia.</p>
        </div>
      </div>

      {/* PÁGINA 5: AUTORIDADE */}
      <div className="h-[296mm] w-[210mm] mx-auto p-[15mm] flex flex-col justify-between overflow-hidden box-border">
        <div>
          <header className="border-b-2 border-slate-200 pb-4 mb-8 flex justify-between items-end">
            <h2 className="text-3xl font-bold text-slate-800">Garantia Valitag</h2>
            <img src={logoUrl} alt="Valitag" className="h-10 opacity-50" />
          </header>

          <div className="space-y-8">
            <div className="flex gap-4">
               <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
               <div>
                 <h4 className="font-bold text-lg text-slate-800">Implantação Conduzida</h4>
                 <p className="text-slate-600 mt-1">Nossa equipe acompanhará a implantação lado a lado com sua operação até o funcionamento pleno.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
               <div>
                 <h4 className="font-bold text-lg text-slate-800">Suporte Humanizado</h4>
                 <p className="text-slate-600 mt-1">Dúvidas resolvidas rapidamente. Você fala com especialistas, não com robôs.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
               <div>
                 <h4 className="font-bold text-lg text-slate-800">Atualizações Frequentes</h4>
                 <p className="text-slate-600 mt-1">Seu sistema nunca fica obsoleto. Melhorias baseadas no mercado implementadas sem custo extra.</p>
               </div>
            </div>
          </div>
          
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider">Links Importantes</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {linksConfig?.site && (
                <a href={linksConfig.site} target="_blank" rel="noreferrer" className="font-bold px-4 py-2" style={{ color: '#0084d1', textDecoration: 'underline', cursor: 'pointer' }}>Site Oficial</a>
              )}
              {linksConfig?.impressoras && (
                <a href={linksConfig.impressoras} target="_blank" rel="noreferrer" className="font-bold px-4 py-2" style={{ color: '#0084d1', textDecoration: 'underline', cursor: 'pointer' }}>Impressoras Recomendadas</a>
              )}
              {linksConfig?.etiquetas && (
                <a href={linksConfig.etiquetas} target="_blank" rel="noreferrer" className="font-bold px-4 py-2" style={{ color: '#0084d1', textDecoration: 'underline', cursor: 'pointer' }}>Compra de Etiquetas</a>
              )}
              {linksConfig?.customLinks?.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="font-bold px-4 py-2" style={{ color: '#0084d1', textDecoration: 'underline', cursor: 'pointer' }}>{link.name}</a>
              ))}
            </div>
          </div>

          {linksConfig?.onboarding && (
            <div className="mt-8 text-center">
              <a 
                href={linksConfig.onboarding} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-8 py-4 font-black rounded-2xl border-2 shadow-lg"
                style={{ color: '#ffffff', backgroundColor: '#059669', borderColor: '#10b981', textDecoration: 'none', cursor: 'pointer' }}
              >
                Efetuar Pagamento da Implantação
              </a>
            </div>
          )}

          {(planoId === 'starter' || planoId === 'pro') && (
            <div className="mt-10 bg-slate-900 border-2 border-slate-800 rounded-2xl p-8 text-white text-center shadow-lg">
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4 text-[#0084d1]">Potencial de Evolução da sua Operação</h3>
              <p className="text-slate-300 mb-6 font-medium text-lg">Nosso diagnóstico completo identificou uma oportunidade real de estancar perdas severas em validades e quebras de estoque.</p>
              <div className="flex justify-center items-end gap-2 mb-6">
                <span className="text-xl text-slate-400 font-bold">Perda Mapeada:</span>
                <span className="text-4xl font-black text-red-500">-{formatMoney(roi.diagnosticoCompleto?.totalPerdaAnual || 0)}</span>
                <span className="text-slate-400 font-bold mb-1">/ano</span>
              </div>
              <p className="text-lg font-bold bg-slate-800 inline-block px-6 py-3 rounded-xl border border-slate-700 text-slate-200">
                Conheça nossos planos avançados para atingir este nível de economia.
              </p>
            </div>
          )}
        </div>

        <div className="border-t-2 border-slate-200 pt-6 text-center text-slate-500 text-sm">
           <p className="font-black text-[#0084d1] text-xl mb-2 uppercase tracking-widest">Valitag - Transformando perdas em lucro líquido</p>
           <p>Este documento é confidencial e exclusivo.</p>
           <p className="mt-4">Assinatura: _________________________________________</p>
        </div>
      </div>

    </div>
  );
}
