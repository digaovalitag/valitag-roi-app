import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit, Save, Loader2, Key } from 'lucide-react';

export default function AdminVendedores({ supabase }) {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('Consultor Valitag');
  const [limite, setLimite] = useState(15);
  const [role, setRole] = useState('vendedor');

  useEffect(() => {
    fetchVendedores();
  }, []);

  const fetchVendedores = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('vendedores').select('*').order('created_at', { ascending: false });
    if (!error && data) setVendedores(data);
    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setSenha('');
    setNome('');
    setCargo('Consultor Valitag');
    setLimite(15);
    setRole('vendedor');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { 
      email: email.trim().toLowerCase(), 
      senha, 
      nome, 
      cargo, 
      limite_desconto_maximo: Number(limite),
      role 
    };

    if (editingId) {
      await supabase.from('vendedores').update(payload).eq('id', editingId);
    } else {
      await supabase.from('vendedores').insert([payload]);
    }
    
    resetForm();
    fetchVendedores();
  };

  const handleEdit = (v) => {
    setEditingId(v.id);
    setEmail(v.email);
    setSenha(v.senha);
    setNome(v.nome);
    setCargo(v.cargo || '');
    setLimite(v.limite_desconto_maximo || 15);
    setRole(v.role || 'vendedor');
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      await supabase.from('vendedores').delete().eq('id', id);
      fetchVendedores();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-white">Gerenciar Equipe (Logins)</h3>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Usuário
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-slate-950 p-6 rounded-xl border border-slate-800 mb-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            {editingId ? 'Editar Usuário' : 'Novo Usuário'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nome Completo</label>
              <input required value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">E-mail (Login)</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Senha</label>
              <input required value={senha} onChange={e => setSenha(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Cargo (Aparece no PDF)</label>
              <input value={cargo} onChange={e => setCargo(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Limite de Desconto (%)</label>
              <input type="number" required value={limite} onChange={e => setLimite(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nível de Acesso</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none">
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-slate-800">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">Cancelar</button>
            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all">
              <Save className="w-4 h-4" /> {editingId ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-500">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Nível</th>
                <th className="px-4 py-3">Limite Desc.</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map(v => (
                <tr key={v.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-4 py-3 font-bold text-white">{v.nome}</td>
                  <td className="px-4 py-3">{v.email}</td>
                  <td className="px-4 py-3">{v.cargo}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${v.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {v.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{v.limite_desconto_maximo}%</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(v)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
