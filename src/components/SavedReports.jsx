import React, { useEffect, useState } from 'react';
import { X, FileText, Calendar, Edit, Loader2 } from 'lucide-react';

export default function SavedReports({ user, supabase, onClose, onLoadProposal }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('leads_roi')
          .select('*, vendedores(nome)')
          .not('dados_proposta', 'is', null)
          .order('created_at', { ascending: false });
          
        if (user?.role !== 'admin') {
          query = query.eq('vendedor_id', user.id);
        }
        
        const { data, error } = await query;
        if (!error && data) {
          setReports(data);
        }
      } catch (err) {
        console.error('Erro ao buscar relatorios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user, supabase]);

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 z-[100] animate-in fade-in">
      <div className="bg-[#0f172a] rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl border border-slate-800 relative overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0084d1]/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#0084d1]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Relatórios Salvos</h2>
              <p className="text-slate-400 text-sm">Selecione uma proposta antiga para editar ou baixar novamente.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#0084d1]" />
              <p>Carregando relatórios...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
              <FileText className="w-16 h-16 opacity-20" />
              <p>Nenhuma proposta salva ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((r) => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col gap-4 group hover:border-[#0084d1]/50 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,132,209,0.15)]">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-white line-clamp-1" title={r.nome_cliente}>{r.nome_cliente}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded">
                      ROI: {formatMoney(r.roi_estimado)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-400 flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(r.created_at).toLocaleDateString('pt-BR')} às {new Date(r.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    {user?.role === 'admin' && r.vendedores?.nome && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
                        <span className="text-xs bg-slate-800 px-2 py-1 rounded-full">Vendedor: {r.vendedores.nome}</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => r.dados_proposta && onLoadProposal(r.dados_proposta)}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#0084d1] text-slate-300 hover:text-white py-2.5 rounded-lg font-bold transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" /> Carregar para Edição
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
