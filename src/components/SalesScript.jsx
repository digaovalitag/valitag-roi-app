import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Save, X } from 'lucide-react';

export default function SalesScript({ questions, setQuestions }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editInputType, setEditInputType] = useState('text');
  const [editMultiplier, setEditMultiplier] = useState(0);
  const [editUnit, setEditUnit] = useState('');
  const [editLabels, setEditLabels] = useState('');
  const [editModule, setEditModule] = useState('eficiencia');

  const handleAdd = () => {
    const newQ = { id: Date.now().toString(), text: 'Nova pergunta...', inputType: 'text' };
    setQuestions([...questions, newQ]);
    setEditingId(newQ.id);
    setEditValue(newQ.text);
    setEditInputType('text');
    setEditMultiplier(0);
    setEditUnit('');
    setEditLabels('');
    setEditModule('eficiencia');
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleEdit = (question) => {
    setEditingId(question.id);
    setEditValue(question.text);
    setEditInputType(question.inputType || 'text');
    setEditMultiplier(question.multiplier || 0);
    setEditUnit(question.unit || '');
    setEditLabels(question.labels || '');
    setEditModule(question.module || 'eficiencia');
  };

  const handleSave = (id) => {
    setQuestions(questions.map(q => q.id === id ? { 
      ...q, 
      text: editValue, 
      inputType: editInputType, 
      multiplier: editInputType === 'scale' ? editMultiplier : undefined,
      unit: editInputType === 'scale' ? editUnit : undefined,
      labels: editInputType === 'scale' ? editLabels : undefined,
      module: editInputType === 'scale' ? editModule : undefined
    } : q));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Roteiro de Vendas</h2>
          <p className="text-slate-400 mt-2">Guia de perguntas para qualificação e diagnóstico.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="print:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Adicionar Nova Pergunta
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <div 
            key={q.id} 
            className="group bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-600 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-blue-400 font-bold text-sm">
                {index + 1}
              </span>
              
              <div className="flex-1 pt-1">
                {editingId === q.id ? (
                  <div className="flex flex-col gap-3">
                    <textarea 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-200 min-h-[80px]"
                      placeholder="Texto da pergunta"
                      autoFocus
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Tipo de Resposta</label>
                        <select
                          value={editInputType}
                          onChange={(e) => setEditInputType(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200 text-sm"
                        >
                          <option value="text">Texto Livre</option>
                          <option value="scale">Linha de Valor (Escala)</option>
                        </select>
                      </div>

                      {editInputType === 'scale' && (
                        <>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Módulo de Impacto</label>
                            <select
                              value={editModule}
                              onChange={(e) => setEditModule(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200 text-sm"
                            >
                              <option value="validade">Validade</option>
                              <option value="estoque">Estoque</option>
                              <option value="eficiencia">Eficiência</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Multiplicador Oculto (R$ / unidade)</label>
                            <input 
                              type="number"
                              value={editMultiplier}
                              onChange={(e) => setEditMultiplier(parseFloat(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200 text-sm"
                              placeholder="Ex: 450"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Rótulo da Unidade</label>
                            <input 
                              type="text"
                              value={editUnit}
                              onChange={(e) => setEditUnit(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200 text-sm"
                              placeholder="Ex: Horas, Kg"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Valores da Escala (separados por vírgula)</label>
                            <input 
                              type="text"
                              value={editLabels}
                              onChange={(e) => setEditLabels(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200 text-sm"
                              placeholder="Ex: 0, 1, 2, 4, 8"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2 justify-end mt-2">
                      <button 
                        onClick={handleCancel}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" /> Cancelar
                      </button>
                      <button 
                        onClick={() => handleSave(q.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                      >
                        <Save className="w-4 h-4" /> Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg text-slate-200 leading-relaxed font-medium">{q.text}</p>
                    {q.inputType === 'scale' && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="bg-blue-900/40 text-blue-400 border border-blue-800/50 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest">{q.module}</span>
                        <div className="inline-flex items-center gap-3 bg-slate-950/50 px-3 py-1 rounded border border-slate-800">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Escala: {q.unit}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mult: R$ {q.multiplier}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Valores: {q.labels}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editingId !== q.id && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                  <button 
                    onClick={() => handleEdit(q)}
                    className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
