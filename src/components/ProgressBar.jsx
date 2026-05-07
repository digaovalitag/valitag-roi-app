import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import logoUrl from '../assets/logo-valitag.png.jpeg';

export default function ProgressBar({ currentStep, setCurrentStep }) {
  const steps = [
    { id: 1, name: 'Diagnóstico' },
    { id: 2, name: 'Impacto (ROI)' },
    { id: 3, name: 'Demonstração' },
    { id: 4, name: 'Resultados' },
    { id: 5, name: 'Proposta' }
  ];

  return (
    <div className="w-full bg-[#0f172a] border-b border-white/10 py-4 px-6 sticky top-0 z-20 print:hidden flex items-center shadow-lg">
      <div className="flex-shrink-0 mr-8">
        <img src={logoUrl} alt="Valitag" className="h-8 object-contain opacity-90" />
      </div>
      <div className="w-full max-w-4xl mx-auto flex-1">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-between w-full">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative flex flex-col items-center flex-1 ${stepIdx !== steps.length - 1 ? 'pr-4' : ''}`}>
                <div className="absolute top-4 left-1/2 -translate-y-1/2 w-full h-0.5 bg-white/5 -z-10 hidden sm:block"></div>
                {step.id < currentStep ? (
                  <>
                    <div className="absolute top-4 left-1/2 -translate-y-1/2 w-full h-0.5 bg-[#0084d1] -z-10 hidden sm:block"></div>
                    <button onClick={() => setCurrentStep && setCurrentStep(step.id)} className="w-8 h-8 rounded-full bg-[#0084d1] flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer border border-[#0084d1]">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </button>
                    <span className="mt-2 text-xs font-medium text-[#0084d1] uppercase tracking-wider hidden sm:block cursor-pointer" onClick={() => setCurrentStep && setCurrentStep(step.id)}>{step.name}</span>
                  </>
                ) : step.id === currentStep ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-[#1e293b] border-2 border-[#0084d1] flex items-center justify-center shadow-[0_0_15px_rgba(0,132,209,0.6)] cursor-default">
                      <span className="text-sm font-bold text-[#0084d1]">{step.id}</span>
                    </div>
                    <span className="mt-2 text-xs font-bold text-slate-100 uppercase tracking-wider hidden sm:block">{step.name}</span>
                  </>
                ) : (
                  <>
                    <button onClick={() => setCurrentStep && setCurrentStep(step.id)} className="w-8 h-8 rounded-full bg-[#1e293b] border-2 border-white/10 flex items-center justify-center hover:border-slate-500 transition-colors cursor-pointer">
                      <span className="text-sm font-medium text-slate-500">{step.id}</span>
                    </button>
                    <span className="mt-2 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:block cursor-pointer" onClick={() => setCurrentStep && setCurrentStep(step.id)}>{step.name}</span>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
