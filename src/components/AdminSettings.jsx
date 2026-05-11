import React, { useRef, useState } from 'react';
import { Download, Upload, Plus, Trash2, Link, RefreshCw, Eye, EyeOff, Save, Loader2, Image as ImageIcon, ArrowLeft, ArrowRight, GripHorizontal } from 'lucide-react';
import { fetchValitagPlans } from '../logic/syncEngine';
import AdminVendedores from './AdminVendedores';

export default function AdminSettings({ supabase, pricingConfig, setPricingConfig, descontoRs, setDescontoRs, demoModules, setDemoModules, linksConfig, setLinksConfig, hardwareConfig, setHardwareConfig }) {
  const fileInputRef = useRef(null);
  const { planos, taxa, descontoMax } = pricingConfig;
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [draggedPlanId, setDraggedPlanId] = useState(null);

  const movePlan = (id, direction) => {
    const sortedIds = Object.values(planos).sort((a, b) => (a.ordem || 0) - (b.ordem || 0)).map(p => p.id);
    const idx = sortedIds.indexOf(id);
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === sortedIds.length - 1)) return;

    const targetIdx = idx + direction;
    [sortedIds[idx], sortedIds[targetIdx]] = [sortedIds[targetIdx], sortedIds[idx]];

    const newPlanos = { ...planos };
    sortedIds.forEach((pId, index) => {
      newPlanos[pId] = { ...newPlanos[pId], ordem: index };
    });
    setPricingConfig(prev => ({ ...prev, planos: newPlanos }));
  };

  const handleDragStart = (e, id) => {
    setDraggedPlanId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedPlanId === targetId || !draggedPlanId) return;

    const sortedIds = Object.values(planos).sort((a, b) => (a.ordem || 0) - (b.ordem || 0)).map(p => p.id);
    const draggedIdx = sortedIds.indexOf(draggedPlanId);
    const targetIdx = sortedIds.indexOf(targetId);

    sortedIds.splice(draggedIdx, 1);
    sortedIds.splice(targetIdx, 0, draggedPlanId);

    const newPlanos = { ...planos };
    sortedIds.forEach((pId, index) => {
      newPlanos[pId] = { ...newPlanos[pId], ordem: index };
    });

    setPricingConfig(prev => ({ ...prev, planos: newPlanos }));
    setDraggedPlanId(null);
  };

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({
          pricing_config: pricingConfig,
          hardware_config: hardwareConfig,
          links_config: linksConfig,
          demo_modules: demoModules
        })
        .eq('id', 1);

      if (error) throw error;
      alert('Configurações salvas na nuvem com sucesso! Todos os vendedores receberão as atualizações.');
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar na nuvem. Verifique a conexão e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file, type, id) => {
    if (!file) return;
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens (PNG, JPG, etc).');
      return;
    }

    setUploadingId(`${type}-${id}`);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      if (type === 'impressora') {
        handleImpressoraChange(id, 'imageUrl', publicUrl);
      } else {
        handleEtiquetaChange(id, 'imageUrl', publicUrl);
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      alert('Erro ao enviar imagem. Verifique se o bucket "assets" existe e está público.');
    } finally {
      setUploadingId(null);
    }
  };

  const handleSyncPlans = async () => {
    setIsSyncing(true);
    const apiPlanos = await fetchValitagPlans();
    if (apiPlanos) {
      setPricingConfig(prev => {
        const mergedPlanos = { ...prev.planos };
        Object.keys(apiPlanos).forEach(key => {
          const isVisible = mergedPlanos[key]?.visible !== undefined ? mergedPlanos[key].visible : true;
          mergedPlanos[key] = {
            ...apiPlanos[key],
            visible: isVisible
          };
        });

        const newConfig = {
          ...prev,
          planos: mergedPlanos
        };
        localStorage.setItem('valitag_pricing_config', JSON.stringify(newConfig));
        return newConfig;
      });
      alert('Planos sincronizados com a API oficial da Valitag!');
    } else {
      alert('Falha ao sincronizar planos. Verifique a conexão com a internet.');
    }
    setIsSyncing(false);
  };

  const handlePlanoChange = (id, newPreco) => {
    setPricingConfig(prev => ({
      ...prev,
      planos: {
        ...prev.planos,
        [id]: {
          ...prev.planos[id],
          preco: parseFloat(newPreco) || 0
        }
      }
    }));
  };

  const handleToggleVisibility = (id) => {
    setPricingConfig(prev => ({
      ...prev,
      planos: {
        ...prev.planos,
        [id]: {
          ...prev.planos[id],
          visible: prev.planos[id].visible === false ? true : false
        }
      }
    }));
  };

  const handleConfigChange = (field, value) => {
    setPricingConfig(prev => ({
      ...prev,
      [field]: field === 'webhookUrl' ? value : (parseFloat(value) || 0)
    }));
  };

  const handleAddModule = () => {
    setDemoModules([...(demoModules || []), { id: Date.now().toString(), name: '', url: '' }]);
  };

  const handleRemoveModule = (id) => {
    setDemoModules((demoModules || []).filter(m => m.id !== id));
  };

  const handleModuleChange = (id, field, value) => {
    setDemoModules((demoModules || []).map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleLinkChange = (field, value) => {
    setLinksConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleHardwareChange = (field, value) => {
    setHardwareConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleImpressoraChange = (id, field, value) => {
    setHardwareConfig(prev => ({
      ...prev,
      impressoras: (prev.impressoras || []).map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  const handleEtiquetaChange = (id, field, value) => {
    setHardwareConfig(prev => ({
      ...prev,
      etiquetas: (prev.etiquetas || []).map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const handleAddCustomLink = () => {
    setLinksConfig(prev => ({
      ...prev,
      customLinks: [...(prev.customLinks || []), { id: Date.now().toString(), name: '', url: '' }]
    }));
  };

  const handleRemoveCustomLink = (id) => {
    setLinksConfig(prev => ({
      ...prev,
      customLinks: (prev.customLinks || []).filter(l => l.id !== id)
    }));
  };

  const handleCustomLinkChange = (id, field, value) => {
    setLinksConfig(prev => ({
      ...prev,
      customLinks: (prev.customLinks || []).map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  const handleExport = () => {
    const data = { pricingConfig, descontoRs, demoModules, linksConfig, hardwareConfig };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'valitag_setup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          if (data.pricingConfig) setPricingConfig(data.pricingConfig);
          if (data.descontoRs !== undefined) setDescontoRs(data.descontoRs);
          if (data.demoModules) setDemoModules(data.demoModules);
          if (data.linksConfig) setLinksConfig(data.linksConfig);
          if (data.hardwareConfig) setHardwareConfig(data.hardwareConfig);
          alert('Configurações importadas com sucesso!');
        } catch (err) {
          alert('Arquivo de configuração inválido!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <AdminVendedores supabase={supabase} />

      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold">Configurações de Preços</h3>
          <p className="text-xs text-slate-400 mt-1">Valores padrão aplicados em todas as propostas locais.</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
          <button 
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            Salvar na Nuvem
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-all"
            title="Importar Backup"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-[#0084d1]/20 hover:bg-[#0084d1]/30 border border-[#0084d1]/50 text-blue-400 rounded-lg text-sm font-bold transition-all"
            title="Exportar Backup"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Planos Mensais</h3>
          <button 
            onClick={handleSyncPlans}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 hover:bg-blue-800/60 text-blue-400 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar com Valitag API'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(planos).sort((a, b) => (a.ordem || 0) - (b.ordem || 0)).map(p => (
            <div 
              key={p.id} 
              draggable 
              onDragStart={(e) => handleDragStart(e, p.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, p.id)}
              className={`bg-slate-900 border ${p.visible === false ? 'border-slate-800 opacity-50' : 'border-slate-700'} p-4 rounded-xl transition-all cursor-grab active:cursor-grabbing ${draggedPlanId === p.id ? 'opacity-30 border-blue-500' : ''}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <GripHorizontal className="w-4 h-4 text-slate-600" />
                  <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    {p.nome} (R$)
                  </label>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => movePlan(p.id, -1)}
                    className="p-1 hover:bg-slate-800 rounded-md text-slate-500 hover:text-slate-300 transition-colors"
                    title="Mover para esquerda"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => movePlan(p.id, 1)}
                    className="p-1 hover:bg-slate-800 rounded-md text-slate-500 hover:text-slate-300 transition-colors"
                    title="Mover para direita"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleToggleVisibility(p.id)}
                    className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition-colors ml-1"
                    title={p.visible === false ? "Mostrar plano na tela comercial" : "Ocultar plano da tela comercial"}
                  >
                    {p.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <input 
                type="number"
                value={p.preco}
                onChange={(e) => handlePlanoChange(p.id, e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-xl font-bold mb-4">Implantação e Descontos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Valor Base da Implantação (R$)
            </label>
            <input 
              type="number"
              value={taxa}
              onChange={(e) => handleConfigChange('taxa', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              % Máximo de Desconto Permitido
            </label>
            <input 
              type="number"
              value={descontoMax}
              onChange={(e) => handleConfigChange('descontoMax', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Preço Mensal por Licença Extra (R$)
            </label>
            <input 
              type="number"
              value={pricingConfig.precoLicencaExtra || 147}
              onChange={(e) => handleConfigChange('precoLicencaExtra', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Taxa de Implantação por Licença (R$)
            </label>
            <input 
              type="number"
              value={pricingConfig.taxaLicencaExtra || 700}
              onChange={(e) => handleConfigChange('taxaLicencaExtra', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl md:col-span-2">
            <label className="block text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
              Ajuste de Implantação (Desconto em R$ aplicado no funil)
            </label>
            <input 
              type="number"
              value={descontoRs}
              onChange={(e) => setDescontoRs(e.target.value)}
              className="w-full bg-slate-950 border border-blue-900 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200 font-bold"
              placeholder="Ex: 500"
            />
            {descontoRs > (taxa * (descontoMax / 100)) && (
              <p className="text-red-500 text-xs font-semibold mt-2">
                Aviso: Desconto acima do limite permitido de R$ {(taxa * (descontoMax / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 mt-8">
        <h3 className="text-xl font-bold mb-4">Integração Google Sheets (Leads)</h3>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            URL do Webhook (Google Apps Script)
          </label>
          <input 
            type="text"
            value={pricingConfig.webhookUrl || ''}
            onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
            placeholder="https://script.google.com/macros/s/.../exec"
          />
          <p className="text-xs text-slate-500 mt-2">
            Cole aqui a URL do seu Web App no Google Apps Script para sincronizar os leads automaticamente.
          </p>
        </div>
      </div>
      
      {/* SEÇÃO DE MÓDULOS DE DEMO */}
      <div className="pt-8 border-t border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold">Gerenciar Módulos de Demo</h3>
            <p className="text-xs text-slate-400 mt-1">Configure os links do Supademo exibidos no funil de vendas.</p>
          </div>
          <button 
            onClick={handleAddModule}
            className="flex items-center gap-2 px-3 py-2 bg-[#0084d1] hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Novo Módulo
          </button>
        </div>

        <div className="space-y-4">
          {(demoModules || []).map((mod, index) => (
            <div key={mod.id} className="flex flex-col md:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl items-start md:items-center">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 w-full space-y-2">
                <input 
                  type="text" 
                  value={mod.name} 
                  onChange={(e) => handleModuleChange(mod.id, 'name', e.target.value)}
                  placeholder="Nome do Módulo (Ex: Controle de Validade)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex-[2] w-full space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-4 w-4 text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    value={mod.url} 
                    onChange={(e) => handleModuleChange(mod.id, 'url', e.target.value)}
                    placeholder="URL do Supademo (https://...)"
                    className="w-full pl-9 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <button 
                onClick={() => handleRemoveModule(mod.id)}
                className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                title="Remover Módulo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          {(!demoModules || demoModules.length === 0) && (
            <div className="text-center p-8 bg-slate-900 border border-slate-800 border-dashed rounded-xl text-slate-500">
              Nenhum módulo cadastrado. Adicione um para exibir na tela de Demonstração.
            </div>
          )}
        </div>
      </div>

      {/* SEÇÃO DE LINKS DA PROPOSTA */}
      <div className="pt-8 border-t border-slate-800">
        <div className="mb-6">
          <h3 className="text-xl font-bold">Configuração de Links da Proposta</h3>
          <p className="text-xs text-slate-400 mt-1">Defina os links que aparecerão no PDF para o cliente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase">Site Oficial</label>
            <input 
              type="text" value={linksConfig?.site || ''} 
              onChange={(e) => handleLinkChange('site', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://valitag.com.br"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase">Link de Onboarding / Pagamento</label>
            <input 
              type="text" value={linksConfig?.onboarding || ''} 
              onChange={(e) => handleLinkChange('onboarding', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Link do Stripe ou WhatsApp Fin."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase">Link de Impressoras Recomendadas</label>
            <input 
              type="text" value={linksConfig?.impressoras || ''} 
              onChange={(e) => handleLinkChange('impressoras', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="URL da Amazon ou parceiro"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase">Link de Compra de Etiquetas</label>
            <input 
              type="text" value={linksConfig?.etiquetas || ''} 
              onChange={(e) => handleLinkChange('etiquetas', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="URL do fornecedor"
            />
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <label className="text-sm font-semibold text-slate-400 uppercase">Links Personalizados (Opcional)</label>
          <button 
            onClick={handleAddCustomLink}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
          >
            <Plus className="w-3 h-3" /> Adicionar Link
          </button>
        </div>

        <div className="space-y-3">
          {(linksConfig?.customLinks || []).map((link, index) => (
            <div key={link.id} className="flex gap-3 items-center">
              <input 
                type="text" value={link.name} onChange={(e) => handleCustomLinkChange(link.id, 'name', e.target.value)}
                placeholder="Nome do Link" className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm"
              />
              <input 
                type="text" value={link.url} onChange={(e) => handleCustomLinkChange(link.id, 'url', e.target.value)}
                placeholder="URL" className="flex-[2] bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm"
              />
              <button onClick={() => handleRemoveCustomLink(link.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO DE GESTÃO DE HARDWARE */}
      <div className="pt-8 border-t border-slate-800">
        <div className="mb-6">
          <h3 className="text-xl font-bold">Gestão de Hardware</h3>
          <p className="text-xs text-slate-400 mt-1">Configure o catálogo de impressoras e etiquetas do aplicativo.</p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-400 uppercase">Marcas de Impressoras</label>
        </div>

        <div className="space-y-4 mb-8">
          {(hardwareConfig?.impressoras || []).map((imp, idx) => (
            <div key={imp.id || idx} className="bg-slate-900/50 p-4 border border-slate-800 rounded-lg">
              <p className="font-bold text-slate-300 mb-3 uppercase tracking-widest text-xs">Impressora {idx + 1}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" value={imp.nome || ''} onChange={(e) => handleImpressoraChange(imp.id, 'nome', e.target.value)}
                  placeholder="Nome (Ex: Elgin L42 Pro)" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm"
                />
                <div className="flex gap-2 w-full">
                  <input 
                    type="text" value={imp.imageUrl || ''} onChange={(e) => handleImpressoraChange(imp.id, 'imageUrl', e.target.value)}
                    placeholder="URL da Foto ou faça Upload ->" className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm"
                  />
                  <input 
                    type="file" 
                    id={`upload-imp-${imp.id}`} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'impressora', imp.id)}
                  />
                  <label 
                    htmlFor={`upload-imp-${imp.id}`}
                    className={`flex items-center justify-center px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors ${uploadingId === `impressora-${imp.id}` ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Upload de Imagem"
                  >
                    {uploadingId === `impressora-${imp.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  </label>
                </div>
                <input 
                  type="text" value={imp.linkCompra || ''} onChange={(e) => handleImpressoraChange(imp.id, 'linkCompra', e.target.value)}
                  placeholder="Link de Compra (Mercado Livre, etc)" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm md:col-span-2"
                />
                <textarea 
                  value={imp.beneficios || ''} onChange={(e) => handleImpressoraChange(imp.id, 'beneficios', e.target.value)}
                  placeholder="Benefícios (Um por linha)" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm md:col-span-2 h-20 resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-400 uppercase">Links de Etiquetas</label>
        </div>

        <div className="space-y-4">
          {(hardwareConfig?.etiquetas || []).map((etiqueta) => (
            <div key={etiqueta.id} className="bg-slate-900/50 p-4 border border-slate-800 rounded-lg">
              <div className="mb-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1 block">Tamanho da Etiqueta</label>
                <input 
                  type="text" value={etiqueta.tamanho || ''} onChange={(e) => handleEtiquetaChange(etiqueta.id, 'tamanho', e.target.value)}
                  placeholder="Ex: 40x40mm (Balança)" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-200"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2 w-full">
                  <input 
                    type="text" value={etiqueta.imageUrl || ''} onChange={(e) => handleEtiquetaChange(etiqueta.id, 'imageUrl', e.target.value)}
                    placeholder="URL da Foto ou faça Upload ->" className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm"
                  />
                  <input 
                    type="file" 
                    id={`upload-etiq-${etiqueta.id}`} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'etiqueta', etiqueta.id)}
                  />
                  <label 
                    htmlFor={`upload-etiq-${etiqueta.id}`}
                    className={`flex items-center justify-center px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors ${uploadingId === `etiqueta-${etiqueta.id}` ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Upload de Imagem"
                  >
                    {uploadingId === `etiqueta-${etiqueta.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  </label>
                </div>
                <input 
                  type="text" value={etiqueta.linkCompra || ''} onChange={(e) => handleEtiquetaChange(etiqueta.id, 'linkCompra', e.target.value)}
                  placeholder="URL de Compra/Detalhes" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-xl mt-6">
        <p className="text-sm text-blue-400">
          <strong>Aviso:</strong> Estas configurações são salvas localmente neste dispositivo e impactam todos os cálculos do funil instantaneamente.
        </p>
      </div>
    </div>
  );
}
