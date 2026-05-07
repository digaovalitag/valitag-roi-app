import React, { useRef } from 'react';
import { Camera, User, Phone, Briefcase } from 'lucide-react';

export default function TeamSettings({ team, setTeam, syncDataToSheet, pricingConfig }) {
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    const updatedTeam = { ...team, [field]: value };
    setTeam(updatedTeam);
    localStorage.setItem('valitag_team', JSON.stringify(updatedTeam));
    
    // Sincroniza com Sheets (debounce opcional, mas no-cors é rápido)
    if (field !== 'foto') {
      syncDataToSheet(pricingConfig?.webhookUrl, updatedTeam, 'team');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const updatedTeam = { ...team, foto: base64String };
        setTeam(updatedTeam);
        localStorage.setItem('valitag_team', JSON.stringify(updatedTeam));
        syncDataToSheet(pricingConfig?.webhookUrl, updatedTeam, 'team');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 text-slate-100 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Coluna da Foto */}
        <div className="flex flex-col items-center gap-4">
          <div 
            className="relative w-40 h-40 rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {team.foto ? (
              <img src={team.foto} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-slate-600" />
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              <Camera className="w-8 h-8 text-white mb-1" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Alterar</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <p className="text-xs text-slate-500 text-center max-w-[160px]">
            Recomendado: Imagem quadrada (1:1). Máx 1MB.
          </p>
        </div>

        {/* Coluna dos Dados */}
        <div className="flex-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <User className="w-4 h-4 text-blue-500" /> Nome Completo
              </label>
              <input 
                type="text"
                value={team.nome || ''}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
                placeholder="Ex: Ricardo Silva"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4 text-blue-500" /> Cargo / Função
              </label>
              <input 
                type="text"
                value={team.cargo || ''}
                onChange={(e) => handleChange('cargo', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
                placeholder="Ex: Consultor Sênior"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Phone className="w-4 h-4 text-blue-500" /> WhatsApp
              </label>
              <input 
                type="text"
                value={team.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-200"
                placeholder="Ex: (11) 99999-9999"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
