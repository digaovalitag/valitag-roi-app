import React from 'react';
import { Settings2, DollarSign, Clock, Package, Building2, User, UserCheck, CheckCircle, ClipboardList } from 'lucide-react';
import { NumericFormat } from 'react-number-format';

export default function Diagnostico({
  estabelecimento, setEstabelecimento,
  proprietario, setProprietario,
  responsavel, setResponsavel,
  fat, setFat,
  pricingConfig,
  questions,
  responses, setResponses,
  skipDiagnostic, setSkipDiagnostic
}) {
  const handleResponseChange = (id, value) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Diagnóstico Operacional</h2>
          <p className="text-slate-400 mt-2 font-light">Insira os dados do cliente para calcular as perdas e projetar o ROI.</p>
        </div>
        
        <button
          onClick={() => setSkipDiagnostic(!skipDiagnostic)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
            skipDiagnostic 
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          {skipDiagnostic ? <CheckCircle className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
          {skipDiagnostic ? 'Venda Direta Ativada (Pulando Diagnóstico)' : 'Pular Diagnóstico'}
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-2xl shadow-lg border border-white/10 p-8 space-y-8">
        
        {/* Dados do Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Building2 className="w-4 h-4 text-blue-500" />
              Nome do Estabelecimento
            </label>
            <input 
              type="text" 
              value={estabelecimento}
              onChange={e => setEstabelecimento(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f172a] rounded-xl border border-white/10 focus:ring-2 focus:ring-[#0084d1] focus:border-[#0084d1] outline-none transition-all text-lg font-bold text-slate-200"
              placeholder="Ex: Bistrô Gianna"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <User className="w-4 h-4 text-blue-500" />
              Nome do Proprietário
            </label>
            <input 
              type="text" 
              value={proprietario}
              onChange={e => setProprietario(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f172a] rounded-xl border border-white/10 focus:ring-2 focus:ring-[#0084d1] focus:border-[#0084d1] outline-none transition-all text-lg font-bold text-slate-200"
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <UserCheck className="w-4 h-4 text-blue-500" />
              Responsável Operacional
            </label>
            <input 
              type="text" 
              value={responsavel}
              onChange={e => setResponsavel(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f172a] rounded-xl border border-white/10 focus:ring-2 focus:ring-[#0084d1] focus:border-[#0084d1] outline-none transition-all text-lg font-bold text-slate-200"
              placeholder="Ex: Maria (Gerente)"
            />
          </div>
        </div>

        <div className="border-t border-slate-800 my-6"></div>

        {!skipDiagnostic && (
          <>
            {/* Faturamento */}
            <div className="space-y-3 mb-8">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <DollarSign className="w-4 h-4 text-blue-500" />
                Faturamento Mensal Bruto
              </label>
              <div className="relative">
                <NumericFormat 
                  value={fat}
                  onValueChange={(values) => setFat(values.floatValue || '')}
                  prefix={'R$ '}
                  decimalSeparator={','}
                  thousandSeparator={'.'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  className="w-full px-4 py-3 bg-[#0f172a] rounded-xl border border-white/10 focus:ring-2 focus:ring-[#0084d1] focus:border-[#0084d1] outline-none transition-all text-lg font-black text-slate-200"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            {/* Qualificação de Campo */}
            {questions && questions.length > 0 && (
              <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                Qualificação de Campo
              </label>
              <div className="space-y-4">
                {questions.map((q, index) => {
                  const hasAnswer = responses[q.id] !== undefined && responses[q.id].toString().trim().length > 0;
                  return (
                    <div key={q.id} className="bg-[#0f172a] p-4 rounded-xl border border-white/10 transition-all hover:border-[#0084d1]/50">
                      <div className="flex gap-3 mb-3">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#1e293b] text-[#0084d1] font-bold text-xs border border-white/5">
                          {index + 1}
                        </span>
                        <p className="text-slate-200 font-light flex-1">{q.text}</p>
                        {hasAnswer && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      </div>
                      
                      {q.inputType === 'scale' ? (() => {
                        const labelsArr = q.labels ? q.labels.split(',') : [];
                        const numbers = labelsArr
                          .map(l => parseFloat(l.replace(/[^\d.]/g, '')))
                          .filter(n => !isNaN(n));
                        
                        const max = q.max || (numbers.length > 0 ? Math.max(...numbers) : 100);
                        const currentVal = responses[q.id] !== undefined ? responses[q.id] : '';
                        const numericVal = isNaN(parseFloat(currentVal)) ? 0 : parseFloat(currentVal);
                        
                        const hasTextOption = labelsArr.some(l => l.trim().toLowerCase() === 'não sei');
                        const rangeMax = Math.max(max, numericVal);
                        const percentage = rangeMax > 0 ? (numericVal / rangeMax) * 100 : 0;
                        
                        return (
                          <div className="mt-6">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                              <div className="flex-1 w-full relative">
                                <div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 relative">
                                  {/* Thumb visual */}
                                  <div 
                                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-[#0f172a] rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-all duration-75"
                                    style={{ left: `calc(${Math.min(100, Math.max(0, percentage))}% - 12px)` }}
                                  />
                                  {/* Native range input invisível */}
                                  <input 
                                    type="range"
                                    min={0}
                                    max={rangeMax}
                                    step={1}
                                    value={numericVal}
                                    onChange={(e) => handleResponseChange(q.id, parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 z-10"
                                  />
                                </div>
                                <div className="flex justify-between mt-3 text-xs text-slate-500 font-bold uppercase tracking-widest">
                                  <span>0 {q.unit}</span>
                                  <span>{max} {q.unit}{numericVal > max ? '+' : (max === numbers[numbers.length-1] && labelsArr.length && labelsArr[labelsArr.length-1].includes('+') ? '+' : '')}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                <input 
                                  type="number"
                                  value={currentVal === 'Não sei' ? '' : currentVal}
                                  onChange={(e) => handleResponseChange(q.id, e.target.value === '' ? '' : parseFloat(e.target.value))}
                                  placeholder="0"
                                  className="w-24 bg-[#1e293b] border border-white/10 rounded-xl p-3 text-center focus:ring-2 focus:ring-[#0084d1] outline-none text-slate-200 font-black text-lg transition-all"
                                />
                                <span className="text-sm text-slate-400 font-bold">{q.unit || (q.text.includes('%') ? '%' : '')}</span>
                              </div>
                            </div>
                            
                            {hasTextOption && (
                              <div className="mt-6 flex justify-end">
                                <button
                                  onClick={() => handleResponseChange(q.id, 'Não sei')}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                    currentVal === 'Não sei'
                                      ? 'bg-slate-700 text-white shadow-inner ring-2 ring-slate-500/50'
                                      : 'bg-[#1e293b] text-slate-500 hover:bg-slate-800 hover:text-slate-300 border border-white/5'
                                  }`}
                                >
                                  Não sei informar
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })() : q.inputType === 'options' ? (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {q.options?.map(opt => {
                            const isSelected = responses[q.id] === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => handleResponseChange(q.id, opt.value)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isSelected ? 'bg-[#0084d1] text-white border-[#0084d1] shadow-[0_0_15px_rgba(0,132,209,0.3)]' : 'bg-[#1e293b] text-slate-400 border-white/10 hover:border-[#0084d1]/50 hover:text-slate-200'}`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <textarea
                          value={responses[q.id] || ''}
                          onChange={(e) => handleResponseChange(q.id, e.target.value)}
                          placeholder="Anotações sobre esta pergunta..."
                          className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-[#0084d1] focus:border-[#0084d1] outline-none text-slate-300 min-h-[60px] text-sm font-light mt-4"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-slate-800 my-6"></div>
          </>
        )}
      </div>
    </div>
  );
}
