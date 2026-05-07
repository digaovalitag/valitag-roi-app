import React from 'react';
import { LayoutDashboard, TrendingUp, MonitorPlay, Star, FileText, Printer } from 'lucide-react';
import logoUrl from '../assets/logo-valitag.png.jpeg';

export default function Sidebar({ currentStep, setCurrentStep }) {
  const navItems = [
    { id: 1, label: 'Diagnóstico', icon: LayoutDashboard },
    { id: 2, label: 'ROI', icon: TrendingUp },
    { id: 3, label: 'Demo', icon: MonitorPlay },
    { id: 4, label: 'Equipamentos', icon: Printer },
    { id: 5, label: 'Prova Social', icon: Star },
    { id: 6, label: 'Proposta', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-white/5 h-screen flex flex-col print:hidden shrink-0 z-20">
      <div className="p-6 border-b border-white/5 flex justify-center">
        <img src={logoUrl} alt="Valitag" className="w-40 object-contain opacity-90" />
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 px-4">Funil de Vendas</h3>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.id;
          const isPast = item.id < currentStep;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentStep && setCurrentStep(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-medium group ${
                isActive 
                  ? 'bg-[#0084d1]/10 text-[#0084d1] shadow-[0_0_15px_rgba(0,132,209,0.1)] border border-[#0084d1]/20' 
                  : isPast
                    ? 'text-slate-400 hover:bg-[#1e293b] hover:text-slate-200 border border-transparent'
                    : 'text-slate-500 hover:bg-[#1e293b] hover:text-slate-300 border border-transparent'
              }`}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${isActive ? 'border-[#0084d1] bg-[#0084d1] text-white' : isPast ? 'border-[#0084d1] text-[#0084d1]' : 'border-slate-700 text-slate-500'} text-xs font-bold transition-colors`}>
                {item.id}
              </div>
              <span className="flex-1">{item.label}</span>
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0084d1]' : 'text-slate-600 group-hover:text-slate-400'}`} />
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Valitag ROI App v2.0</p>
      </div>
    </aside>
  );
}
