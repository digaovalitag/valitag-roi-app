import React, { useState } from 'react';
import { PlayCircle, FileText, Maximize2, X } from 'lucide-react';

export default function Demonstracao({ demoModules = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const defaultUrl = 'https://app.supademo.com/demo/cmoh83h4028ucza2i09xgfzaz';
  const [activeDemoUrl, setActiveDemoUrl] = useState(demoModules[0]?.url || defaultUrl);
  const [activeDemoId, setActiveDemoId] = useState(demoModules[0]?.id || 'default');

  const handleModuleClick = (mod) => {
    setActiveDemoUrl(mod.url);
    setActiveDemoId(mod.id);
    setIsPlaying(true);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-100">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Veja a Valitag em Ação</h2>
        <p className="text-slate-400">Como nosso sistema simplifica o seu controle operacional na prática.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Video Area */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-blue-500 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><PlayCircle className="w-5 h-5" /> Tour pelo Sistema</span>
            {isPlaying && !isMaximized && (
              <button 
                onClick={() => setIsMaximized(true)} 
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                <Maximize2 className="w-4 h-4" /> Expandir
              </button>
            )}
          </h3>
          <div 
            className={`${isMaximized ? 'fixed inset-0 z-[9999] bg-black w-screen h-screen' : 'w-full aspect-video bg-slate-800 rounded-xl relative shadow-inner'} flex flex-col items-center justify-center border border-slate-700/50 overflow-hidden transition-all duration-300`}
          >
            {isMaximized && (
              <button 
                onClick={() => setIsMaximized(false)} 
                className="absolute top-6 right-6 z-[10000] p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full text-white transition-colors border border-slate-600 shadow-xl"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            {isPlaying && (
              <>
                {/* Máscaras para esconder branding do Supademo */}
                <div className={`absolute top-0 left-0 w-full h-[50px] z-50 pointer-events-none ${isMaximized ? 'bg-black' : 'bg-slate-800'}`}></div>
                <div className={`absolute bottom-0 left-0 w-full h-[50px] z-50 pointer-events-none ${isMaximized ? 'bg-black' : 'bg-slate-800'}`}></div>
              </>
            )}

            {isPlaying ? (
              <iframe
                src={activeDemoUrl}
                title="Valitag Interactive Demo"
                loading="lazy"
                frameBorder="0"
                allowFullScreen
                scrolling="no"
                className="w-full h-full border-0 outline-none"
              ></iframe>
            ) : (
              <div 
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex flex-col items-center justify-center group cursor-pointer hover:bg-slate-800/80 transition-colors z-10"
              >
                <div 
                  className="absolute inset-0 bg-no-repeat bg-center opacity-10 group-hover:opacity-20 transition-opacity" 
                  style={{ backgroundImage: `url('/src/assets/logo-valitag.png.jpeg')`, backgroundSize: '50%' }}
                ></div>
                <div className="relative z-10 flex flex-col items-center">
                  <PlayCircle className="w-20 h-20 text-slate-500 group-hover:text-[#0084d1] group-hover:scale-110 transition-all duration-300 drop-shadow-lg" />
                  <span className="text-slate-400 mt-5 font-bold tracking-widest uppercase text-sm group-hover:text-blue-400 transition-colors drop-shadow">Iniciar Tour Interativo</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Vertical de Módulos */}
        {demoModules && demoModules.length > 0 && (
          <div className="lg:col-span-1 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Módulos Disponíveis</h3>
            {demoModules.map((mod) => {
              const isActive = activeDemoId === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod)}
                  className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all font-bold border ${
                    isActive 
                      ? 'bg-[#0084d1] text-white border-[#0084d1] shadow-[0_0_15px_rgba(0,132,209,0.4)] scale-[1.02]' 
                      : 'bg-[#1e293b] text-slate-300 border-white/5 hover:bg-[#2a3b53] hover:border-white/10'
                  }`}
                >
                  <PlayCircle className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#0084d1]'}`} />
                  <span className="flex-1 leading-tight">{mod.name || 'Módulo Sem Nome'}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4 hover:border-slate-700 transition-colors cursor-pointer">
            <div className="p-3 bg-blue-900/30 rounded-lg text-blue-500">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Guia de Implantação</h4>
              <p className="text-sm text-slate-400 mt-1">Veja como é simples iniciar a operação na sua loja.</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-start gap-4 hover:border-slate-700 transition-colors cursor-pointer">
            <div className="p-3 bg-blue-900/30 rounded-lg text-blue-500">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Manual de Boas Práticas</h4>
              <p className="text-sm text-slate-400 mt-1">Dicas para extrair o máximo de redução de perdas.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
