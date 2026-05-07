import React from 'react';
import { calculateROI } from '../logic/roiEngine';
import { Printer, TrendingDown, Clock, ShieldAlert, BarChart3, AlertTriangle } from 'lucide-react';

const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export default function ROI({ estabelecimento, proprietario, responsavel, fat, planoId, descontoTaxa, descontoRs, descontoPlanoRs, descontoLicencasRs, descontoSetupLicencasRs, questions, responses, pricingConfig, licencasAdicionais }) {
  const roi = calculateROI(fat, planoId, descontoTaxa, descontoRs, descontoPlanoRs, descontoLicencasRs, descontoSetupLicencasRs, questions, responses, pricingConfig, licencasAdicionais);

  const riskKeywords = ['lixo', 'vencido', 'fiscaliza'];
  const criticalRisks = questions?.filter(q => {
    const textLower = q.text.toLowerCase();
    const hasKeyword = riskKeywords.some(kw => textLower.includes(kw));
    const hasResponse = responses && responses[q.id] && responses[q.id].toString().trim().length > 0;
    return hasKeyword && hasResponse;
  }) || [];

  const modules = [
    {
      id: 'validade',
      title: 'Perda por Validade',
      value: roi.perdaValidadeMensal,
      details: roi.detalhes?.validade || [],
      color: 'red',
      icon: <ShieldAlert className="w-6 h-6" />
    },
    {
      id: 'estoque',
      title: 'Quebra de Estoque',
      value: roi.perdaEstoqueMensal,
      details: roi.detalhes?.estoque || [],
      color: 'orange',
      icon: <TrendingDown className="w-6 h-6" />
    },
    {
      id: 'eficiencia',
      title: 'Eficiência Operacional',
      value: roi.prejuizoEficiencia,
      details: roi.detalhes?.eficiencia || [],
      color: 'yellow',
      icon: <Clock className="w-6 h-6" />
    }
  ];

  modules.sort((a, b) => b.value - a.value);

  const getColorClasses = (color) => {
    switch(color) {
      case 'red': return { bg: 'bg-red-50', border: 'border-red-100', icon: 'text-red-500', text: 'text-red-700' };
      case 'orange': return { bg: 'bg-orange-50', border: 'border-orange-100', icon: 'text-orange-500', text: 'text-orange-700' };
      case 'yellow': return { bg: 'bg-yellow-50', border: 'border-yellow-100', icon: 'text-yellow-500', text: 'text-yellow-700' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-100', icon: 'text-gray-500', text: 'text-gray-700' };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Dashboard de Perdas</h2>
        <p className="text-slate-400 mt-2">Detalhamento do Custo da Inação mapeado na operação do cliente.</p>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-8 space-y-8">

        {/* Alertas Críticos */}
        {criticalRisks.length > 0 && (
          <section className="bg-red-900/10 border-l-4 border-red-500 p-6 rounded-r-xl">
            <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Ponto de Risco Crítico Encontrado
            </h2>
            <div className="space-y-4">
              {criticalRisks.map(q => (
                <div key={q.id}>
                  <p className="font-semibold text-slate-300 text-sm">{q.text}</p>
                  <p className="text-red-400 italic mt-1 bg-red-900/20 p-3 rounded border border-red-900/30">"{responses[q.id]}"</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Alerta de CMV Crítico */}
        {responses && ((typeof responses['cmv'] === 'number' && responses['cmv'] > 30) || responses['cmv'] === 'Não sei') && (
          <section className="bg-red-900/10 border-l-4 border-red-500 p-6 rounded-r-xl">
            <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Sua operação está em risco crítico de rentabilidade
            </h2>
            <p className="text-red-400 text-sm font-medium">
              {responses['cmv'] === 'Não sei' 
                ? 'Você selecionou que não sabe o seu CMV. O desconhecimento deste indicador-chave indica perda de visibilidade financeira grave. A falta de controle sobre validades e estoques está mascarando sangrias no seu lucro líquido. A Valitag é essencial para resgatar este controle imediatamente.'
                : `Seu CMV de ${responses['cmv']}% é alarmante. Este nível indica severa ineficiência: a falta de controle rigoroso sobre validades e quebras de estoque está inflando seu custo e corroendo seu lucro. A Valitag é essencial para estancar esta sangria imediatamente.`}
            </p>
          </section>
        )}

        {/* Dashboard de Total no Topo */}
        <div className="bg-slate-950 rounded-xl p-8 border border-slate-800">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-6">
            <span className="text-lg font-bold text-slate-300">Total de Sangria Financeira:</span>
            <div className="text-right">
              <span className="text-3xl font-black text-red-500">{formatMoney(roi.totalPerdaMensal)}<span className="text-lg text-red-400/50 font-normal">/mês</span></span>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 shadow-inner">
            <h3 className="text-xl font-black text-slate-100 uppercase tracking-widest text-center mb-8">Dashboard de Sangria vs Solução</h3>
            
            <div className="space-y-8">
              {/* Barra de Perda */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-red-400 uppercase">Perda Atual (Custo da Inação em 12 meses)</span>
                  <span className="font-black text-red-500 text-lg">-{formatMoney(roi.totalPerdaAnual)}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-8 overflow-hidden relative">
                  <div className="bg-gradient-to-r from-red-600 to-red-500 h-full absolute left-0 top-0 transition-all duration-1000 w-full"></div>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIGZpbGw9Im5vbmUiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDIwLDAgMjAsMjAiLz48L2c+PC9zdmc+')] opacity-20"></div>
                </div>
              </div>

              {/* Barra de Investimento Valitag */}
              {(() => {
                const investimentoAnual = (roi.custoPlano * 12) + roi.custoImplantacao;
                const percentValitag = roi.totalPerdaAnual > 0 ? Math.max(3, (investimentoAnual / roi.totalPerdaAnual) * 100) : 0;
                
                return (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-[#0084d1] uppercase flex items-center gap-2">Investimento Valitag (Anualizado)</span>
                      <span className="font-black text-[#0084d1] text-lg">{formatMoney(investimentoAnual)}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-8 overflow-hidden relative">
                      <div 
                        className="bg-gradient-to-r from-[#005c99] to-[#0084d1] h-full absolute left-0 top-0 transition-all duration-1000 shadow-[0_0_10px_rgba(0,132,209,0.5)]" 
                        style={{ width: `${Math.min(100, percentValitag)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-slate-400 text-sm">A Valitag se paga com apenas uma pequena fração do que você já está perdendo. O risco real é não fazer nada.</p>
            </div>
          </div>
        </div>

        {/* Tabelas de Perdas (Substituindo os Cards) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-2">
            <TrendingDown className="w-6 h-6" />
            Origem do Custo da Inação
          </h2>
          
          <div className="space-y-6">
            {modules.filter(m => m.value > 0).map(mod => {
              const cls = getColorClasses(mod.color);
              
              return (
                <div key={mod.id} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`${cls.icon}`}>{mod.icon}</div>
                      <h3 className="font-bold text-slate-200">{mod.title}</h3>
                    </div>
                    <span className="font-black text-red-500 text-lg">-{formatMoney(mod.value)}/mês</span>
                  </div>
                  
                  {mod.details.length > 0 && (
                    <div className="p-4">
                      <ul className="space-y-3">
                        {mod.details.map((det, i) => (
                          <li key={i} className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                            <span className="text-slate-400">{det.text}</span>
                            <div className="text-right">
                               <span className="text-slate-500 text-xs block mb-0.5">{det.val} {det.unit}</span>
                               <span className="font-bold text-slate-200">-{formatMoney(det.loss)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>

      </div>
    </div>
  );
}
