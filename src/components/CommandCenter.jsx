import React, { useState } from 'react';
import { X, SlidersHorizontal, Settings2, Users } from 'lucide-react';
import SalesScript from './SalesScript';
import AdminSettings from './AdminSettings';
import TeamSettings from './TeamSettings';
import { syncDataToSheet } from '../logic/syncEngine';

export default function CommandCenter({ supabase, onClose, questions, setQuestions, pricingConfig, setPricingConfig, descontoRs, setDescontoRs, team, setTeam, demoModules, setDemoModules, linksConfig, setLinksConfig, hardwareConfig, setHardwareConfig }) {
  const [activeTab, setActiveTab] = useState('roteiro');

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
      <header className="flex-none bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-blue-500" />
            Central de Comando
          </h2>
          
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('roteiro')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === 'roteiro' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Roteiro de Vendas
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Financeiro (Admin)
            </button>
            <button
              onClick={() => setActiveTab('equipe')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === 'equipe' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Equipe
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'roteiro' && (
            <SalesScript questions={questions} setQuestions={setQuestions} />
          )}
          {activeTab === 'admin' && (
            <AdminSettings 
              supabase={supabase}
              pricingConfig={pricingConfig} setPricingConfig={setPricingConfig}
              descontoRs={descontoRs} setDescontoRs={setDescontoRs}
              demoModules={demoModules} setDemoModules={setDemoModules}
              linksConfig={linksConfig} setLinksConfig={setLinksConfig}
              hardwareConfig={hardwareConfig} setHardwareConfig={setHardwareConfig}
            />
          )}
          {activeTab === 'equipe' && (
            <TeamSettings 
              team={team} setTeam={setTeam}
              syncDataToSheet={syncDataToSheet}
              pricingConfig={pricingConfig}
            />
          )}</div>
      </main>
    </div>
  );
}
