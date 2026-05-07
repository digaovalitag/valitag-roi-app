import React from 'react';
import { Star, Quote } from 'lucide-react';
import antesImg from '../assets/antes.png.jfif';
import depoisImg from '../assets/depois.png.jfif';

export default function ProvaSocial() {
  const testimonials = [
    { name: 'Carlos Roberto', role: 'Dono de Churrascaria', text: 'Nossa perda de carne caiu 80% no primeiro mês. O sistema se pagou em 4 dias.' },
    { name: 'Ana Souza', role: 'Gerente de Bistrô', text: 'A fiscalização passou na semana passada e pela primeira vez não tomamos multa de validade.' },
    { name: 'Marcos Vinícius', role: 'Sócio Hamburgueria', text: 'Minha equipe economiza 2 horas por dia só com a conferência rápida. Mudou o jogo.' }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-100">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Resultados Comprovados</h2>
        <p className="text-slate-400">Veja o que os parceiros da Valitag estão falando sobre a redução de sangria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            <Quote className="w-8 h-8 text-slate-800 absolute top-4 right-4" />
            <div className="flex gap-1 text-yellow-500 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-slate-300 italic mb-6 text-sm leading-relaxed">"{t.text}"</p>
            <div>
              <p className="font-bold text-slate-200">{t.name}</p>
              <p className="text-xs text-blue-500 font-medium uppercase tracking-wider">{t.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 pt-10">
        <h3 className="text-2xl font-bold tracking-tight mb-6 text-center">Transformação Visual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-4">Antes da Valitag</span>
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-800">
              <img src={antesImg} alt="Antes da Valitag" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-4">Depois da Valitag</span>
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-800">
              <img src={depoisImg} alt="Depois da Valitag" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
