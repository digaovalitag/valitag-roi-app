import React, { useState } from 'react';
import { FileText, ShoppingCart, Settings, Send, User, ChevronDown, ChevronUp } from 'lucide-react';

export default function RightSidebar({ user, team, estabelecimento, responsavel, onOpenConfig, onReset, onSendProposal, onOpenSavedReports, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <aside className="w-80 bg-[#0084d1] h-screen flex flex-col text-white print:hidden shrink-0 shadow-[-10px_0_30px_rgba(0,132,209,0.2)] z-30">
      
      {/* Bloco Perfil */}
      <div className="p-8 flex flex-col items-center border-b border-white/20">
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden mb-4 border-2 border-white/30 shadow-lg">
          {team?.foto ? (
            <img src={team.foto} alt="Consultor" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-black text-white">
              {team?.nome ? team.nome.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-center leading-tight">{team?.nome || 'Consultor Valitag'}</h2>
        <p className="text-sm text-blue-200 mt-1">{team?.cargo || 'Especialista em Vendas'}</p>
      </div>

      {/* Bloco Contexto Operacional */}
      <div className="p-6 border-b border-white/20 bg-black/10">
        <h3 className="text-xs uppercase tracking-widest text-blue-200 font-bold mb-4">Atendimento Atual</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-blue-200">Estabelecimento</p>
            <p className="font-bold text-lg truncate">{estabelecimento || 'Não definido'}</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">Responsável</p>
            <p className="font-medium truncate">{responsavel || 'Não definido'}</p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas (Dropdown) */}
      <div className="p-6 flex-1 flex flex-col justify-end">
        <div className="relative">
          {menuOpen && (
            <div className="absolute bottom-full mb-3 left-0 w-full bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
              <button 
                onClick={() => { onReset(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left"
              >
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm">Nova Venda</span>
              </button>
              
              <button 
                onClick={() => { onOpenSavedReports(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left"
              >
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm">Relatórios Salvos</span>
              </button>

              {user?.role === 'admin' && (
                <button 
                  onClick={() => { onOpenConfig(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left"
                >
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-sm">Painel Admin</span>
                </button>
              )}

              <button 
                onClick={() => { onLogout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-colors border-b border-slate-100 text-left"
              >
                <User className="w-5 h-5 text-red-500" />
                <span className="font-bold text-sm text-red-500">Sair da Conta</span>
              </button>


            </div>
          )}

          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all shadow-lg backdrop-blur-sm"
          >
            <span className="font-bold text-sm tracking-wide">Menu de Ações</span>
            {menuOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="p-6 flex items-center justify-center gap-2 border-t border-white/20 bg-black/20">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
        <span className="text-xs font-bold tracking-widest text-blue-100">PLATAFORMA ONLINE</span>
      </div>

    </aside>
  );
}
