import React from 'react';
import { Printer, CheckCircle, ExternalLink, Package } from 'lucide-react';
import imgElgin from '../assets/elginl42profull.png';
import imgZebra from '../assets/zebrazd230.jpg';
import imgArgox from '../assets/argoxos214ex.jfif';

const LOCAL_PRINTER_IMAGES = [imgElgin, imgZebra, imgArgox];

export default function Equipamentos({ hardwareConfig, responses, setResponses }) {
  const possuiImpressora = responses['possui_impressora'];
  const modeloImpressora = responses['modelo_impressora'] || '';

  const handlePossuiChange = (val) => {
    setResponses(prev => ({ ...prev, possui_impressora: val }));
  };

  const handleModeloChange = (e) => {
    setResponses(prev => ({ ...prev, modelo_impressora: e.target.value }));
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-900/30 rounded-2xl mb-4 text-[#0084d1]">
          <Printer className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">Equipamentos e Insumos</h2>
        <p className="text-slate-400">Tudo o que você precisa para rodar a operação com máxima eficiência.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg mb-8">
        <h3 className="text-lg font-bold text-slate-200 mb-6 uppercase tracking-widest text-center">Você já possui impressora térmica?</h3>
        
        <div className="flex gap-4 justify-center mb-8">
          <button 
            onClick={() => handlePossuiChange('Sim')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              possuiImpressora === 'Sim' ? 'bg-[#0084d1] text-white shadow-[0_0_15px_rgba(0,132,209,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Sim, já possuo
          </button>
          <button 
            onClick={() => handlePossuiChange('Não')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              possuiImpressora === 'Não' ? 'bg-[#0084d1] text-white shadow-[0_0_15px_rgba(0,132,209,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Não possuo
          </button>
        </div>

        {possuiImpressora === 'Sim' && (
          <div className="max-w-md mx-auto animate-in zoom-in-95 duration-300">
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Qual o modelo da impressora?</label>
            <input 
              type="text"
              value={modeloImpressora}
              onChange={handleModeloChange}
              placeholder="Ex: Zebra ZD230, Elgin L42 Pro..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-center text-slate-100 focus:ring-2 focus:ring-[#0084d1] outline-none transition-all"
            />
          </div>
        )}
      </div>

      {(possuiImpressora === 'Não' || possuiImpressora === 'Sim') && (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* BLOCO A: IMPRESSORAS */}
          {possuiImpressora === 'Não' && (
            <div className="mb-12">
              <h3 className="text-xl font-black text-slate-100 mb-6 text-center">Impressoras Homologadas Recomendadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(hardwareConfig?.impressoras || []).map((imp, idx) => {
                  const benList = (imp.beneficios || '').split('\n').filter(b => b.trim() !== '');
                  const Wrapper = imp.linkCompra ? 'a' : 'div';
                  
                  return (
                    <Wrapper 
                      key={imp.id || idx}
                      href={imp.linkCompra || undefined}
                      target={imp.linkCompra ? "_blank" : undefined}
                      rel={imp.linkCompra ? "noreferrer" : undefined}
                      className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all group flex flex-col ${imp.linkCompra ? 'hover:border-[#0084d1]/50 hover:shadow-[0_0_20px_rgba(0,132,209,0.2)] cursor-pointer' : ''}`}
                    >
                      <div className="h-48 bg-white/5 flex items-center justify-center p-6 relative">
                        {(() => {
                          const url = imp.imageUrl?.trim() || '';
                          const isValid = url.startsWith('http') || url.startsWith('data:');
                          const finalSrc = isValid ? url : LOCAL_PRINTER_IMAGES[idx];
                          
                          return finalSrc ? (
                            <img 
                              src={finalSrc} 
                              alt={imp.nome || 'Impressora'} 
                              className="max-h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300" 
                              onError={(e) => { e.target.onerror = null; e.target.src = LOCAL_PRINTER_IMAGES[idx]; }}
                            />
                          ) : (
                            <Printer className="w-16 h-16 text-slate-700" />
                          );
                        })()}
                        {imp.linkCompra && (
                          <div className="absolute top-3 right-3 bg-[#0084d1] text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            Comprar <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h4 className="text-lg font-bold text-white mb-4 text-center">{imp.nome || `Impressora ${idx + 1}`}</h4>
                        <ul className="space-y-3 mb-6 flex-1 text-sm">
                          {benList.length > 0 ? benList.map((b, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-slate-300">{b}</span>
                            </li>
                          )) : (
                            <li className="text-slate-500 italic text-center">Nenhum benefício cadastrado.</li>
                          )}
                        </ul>
                        {imp.linkCompra && (
                          <div className="mt-auto w-full flex items-center justify-center gap-2 bg-[#1e293b] group-hover:bg-[#0084d1] text-slate-300 group-hover:text-white py-2.5 rounded-lg font-bold transition-colors text-sm">
                            Comprar Agora <ExternalLink className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </div>
          )}

          {/* BLOCO B: ETIQUETAS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-black text-slate-100 mb-2">Suprimentos / Etiquetas</h3>
            <p className="text-slate-400 mb-8">Formatos homologados para funcionamento perfeito do sistema.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(hardwareConfig?.etiquetas || []).map((etiq, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all group flex flex-col">
                  <div className="h-40 bg-white/5 flex items-center justify-center p-4 relative">
                    {etiq.imageUrl ? (
                      <img src={etiq.imageUrl} alt={`Etiqueta ${etiq.tamanho}`} className="max-h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <Package className="w-12 h-12 text-slate-700" />
                    )}
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-xs font-bold text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                      {etiq.tamanho}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-end">
                    {etiq.linkCompra ? (
                      <a 
                        href={etiq.linkCompra} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#0084d1] text-slate-300 hover:text-white py-2.5 rounded-lg font-bold transition-colors text-sm"
                      >
                        Ver Detalhes <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <button disabled className="w-full bg-slate-800 text-slate-500 py-2.5 rounded-lg font-bold text-sm cursor-not-allowed">
                        Link Indisponível
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
