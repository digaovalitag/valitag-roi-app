import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import logoUrl from '../assets/logo-valitag.png.jpeg';

export default function Login({ supabase, onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Usando query customizada na tabela vendedores
      const { data, error: dbError } = await supabase
        .from('vendedores')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('senha', senha.trim())
        .single();

      if (dbError || !data) {
        setError('E-mail ou senha incorretos.');
      } else {
        onLogin(data);
      }
    } catch (err) {
      setError('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoUrl} alt="Valitag" className="h-16 mx-auto mb-6 object-contain" />
          <h2 className="text-2xl font-bold text-white tracking-wide">Bem-vindo(a)</h2>
          <p className="text-slate-400 mt-2">Faça login para acessar o sistema de propostas.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] transition-all"
                  placeholder="vendedor@valitag.com.br"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-[#0084d1] hover:bg-[#0073b6] text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-8">
          Acesso restrito a colaboradores autorizados Valitag.
        </p>
      </div>
    </div>
  );
}
