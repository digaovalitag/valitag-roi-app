import React, { useState } from 'react';
import { Settings2, Package, AlertCircle, Check } from 'lucide-react';
import { NumericFormat } from 'react-number-format';

const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export default function Planos({ planoId, setPlanoId, licencasAdicionais, setLicencasAdicionais, descontoTaxa, setDescontoTaxa, descontoRs, setDescontoRs, descontoPlanoRs, setDescontoPlanoRs, descontoLicencasRs, setDescontoLicencasRs, descontoSetupLicencasRs, setDescontoSetupLicencasRs, pricingConfig, validadeProposta, setValidadeProposta, validadeSetup, setValidadeSetup }) {
  const { planos, taxa, descontoMax, precoLicencaExtra = 147, taxaLicencaExtra = 700 } = pricingConfig;
  const plano = planos[planoId] || planos.starter;

  const currentFinalValue = Math.max(0, taxa - (parseFloat(descontoRs) || 0));
  const currentFinalPlanoValue = Math.max(0, plano.preco - (parseFloat(descontoPlanoRs) || 0));
  
  const valorLicencasBase = licencasAdicionais * precoLicencaExtra;
  const currentFinalLicencasValue = Math.max(0, valorLicencasBase - (parseFloat(descontoLicencasRs) || 0));
  
  const taxaLicencasBase = licencasAdicionais * taxaLicencaExtra;
  const currentFinalTaxaLicencasValue = Math.max(0, taxaLicencasBase - (parseFloat(descontoSetupLicencasRs) || 0));
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setTempVal] = useState(currentFinalValue);
  const [errorMsg, setErrorMsg] = useState('');

  const [isEditingPlano, setIsEditingPlano] = useState(false);
  const [tempPlanoVal, setTempPlanoVal] = useState(currentFinalPlanoValue);
  const [errorPlanoMsg, setErrorPlanoMsg] = useState('');

  const [isEditingLicencas, setIsEditingLicencas] = useState(false);
  const [tempLicencasVal, setTempLicencasVal] = useState(currentFinalLicencasValue);
  const [errorLicencasMsg, setErrorLicencasMsg] = useState('');

  const [isEditingSetupLicencas, setIsEditingSetupLicencas] = useState(false);
  const [tempSetupLicencasVal, setTempSetupLicencasVal] = useState(currentFinalTaxaLicencasValue);
  const [errorSetupLicencasMsg, setErrorSetupLicencasMsg] = useState('');

  const handleEditClick = () => {
    setTempVal(currentFinalValue);
    setIsEditing(true);
    setErrorMsg('');
  };

  const handleConfirmEdit = () => {
    const desiredDiscount = taxa - tempVal;
    const maxDiscountAllowed = taxa * (descontoMax / 100);

    if (desiredDiscount > maxDiscountAllowed && tempVal < taxa) {
      setErrorMsg(`Mínimo permitido: R$ ${(taxa - maxDiscountAllowed).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
      setTimeout(() => setErrorMsg(''), 3000);
    } else {
      setDescontoRs(Math.max(0, desiredDiscount));
      setIsEditing(false);
      setErrorMsg('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirmEdit();
    else if (e.key === 'Escape') {
      setIsEditing(false);
      setErrorMsg('');
    }
  };

  const handleEditPlanoClick = () => {
    setTempPlanoVal(currentFinalPlanoValue);
    setIsEditingPlano(true);
    setErrorPlanoMsg('');
  };

  const handleConfirmEditPlano = () => {
    const desiredDiscount = plano.preco - tempPlanoVal;
    const maxDiscountAllowed = plano.preco * (descontoMax / 100);

    if (desiredDiscount > maxDiscountAllowed && tempPlanoVal < plano.preco) {
      setErrorPlanoMsg(`Mínimo permitido: R$ ${(plano.preco - maxDiscountAllowed).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
      setTimeout(() => setErrorPlanoMsg(''), 3000);
    } else {
      setDescontoPlanoRs(Math.max(0, desiredDiscount));
      setIsEditingPlano(false);
      setErrorPlanoMsg('');
    }
  };

  const handleKeyDownPlano = (e) => {
    if (e.key === 'Enter') handleConfirmEditPlano();
    else if (e.key === 'Escape') {
      setIsEditingPlano(false);
      setErrorPlanoMsg('');
    }
  };

  const handleEditLicencasClick = () => {
    setTempLicencasVal(currentFinalLicencasValue);
    setIsEditingLicencas(true);
    setErrorLicencasMsg('');
  };

  const handleConfirmEditLicencas = () => {
    const desiredDiscount = valorLicencasBase - tempLicencasVal;
    const maxDiscountAllowed = valorLicencasBase * (descontoMax / 100);

    if (desiredDiscount > maxDiscountAllowed && tempLicencasVal < valorLicencasBase) {
      setErrorLicencasMsg(`Mínimo permitido: R$ ${(valorLicencasBase - maxDiscountAllowed).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
      setTimeout(() => setErrorLicencasMsg(''), 3000);
    } else {
      setDescontoLicencasRs(Math.max(0, desiredDiscount));
      setIsEditingLicencas(false);
      setErrorLicencasMsg('');
    }
  };

  const handleKeyDownLicencas = (e) => {
    if (e.key === 'Enter') handleConfirmEditLicencas();
    else if (e.key === 'Escape') {
      setIsEditingLicencas(false);
      setErrorLicencasMsg('');
    }
  };

  const handleEditSetupLicencasClick = () => {
    setTempSetupLicencasVal(currentFinalTaxaLicencasValue);
    setIsEditingSetupLicencas(true);
    setErrorSetupLicencasMsg('');
  };

  const handleConfirmEditSetupLicencas = () => {
    const desiredDiscount = taxaLicencasBase - tempSetupLicencasVal;
    // Setup de licenças adicionais permite 100% de desconto
    const maxDiscountAllowed = taxaLicencasBase;

    if (desiredDiscount > maxDiscountAllowed && tempSetupLicencasVal < taxaLicencasBase) {
      setErrorSetupLicencasMsg(`Mínimo permitido: R$ 0,00`);
      setTimeout(() => setErrorSetupLicencasMsg(''), 3000);
    } else {
      setDescontoSetupLicencasRs(Math.max(0, desiredDiscount));
      setIsEditingSetupLicencas(false);
      setErrorSetupLicencasMsg('');
    }
  };

  const handleKeyDownSetupLicencas = (e) => {
    if (e.key === 'Enter') handleConfirmEditSetupLicencas();
    else if (e.key === 'Escape') {
      setIsEditingSetupLicencas(false);
      setErrorSetupLicencasMsg('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-3">Escolha o Plano Ideal</h2>
        <p className="text-slate-400 font-light">Investimento que se paga nos primeiros dias de uso.</p>
      </div>

      <div className="bg-[#1e293b] rounded-2xl shadow-lg border border-white/10 p-8 space-y-8">
        
        {/* Planos */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <Package className="w-4 h-4 text-blue-500" />
            Plano Recomendado
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(planos).filter(p => p.visible !== false).map(p => (
              <label 
                key={p.id}
                className={`relative flex flex-col p-6 cursor-pointer rounded-2xl border transition-all duration-300 ${
                  planoId === p.id 
                    ? 'border-[#0084d1] bg-gradient-to-b from-[#0f172a] to-[#0084d1]/10 shadow-[0_0_20px_rgba(0,132,209,0.3)] scale-[1.02] z-10' 
                    : 'border-slate-800 bg-slate-900/50 hover:border-[#0084d1]/50 hover:bg-slate-900'
                }`}
              >
                {p.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(0,132,209,0.5)]">
                    MAIS VENDIDO
                  </span>
                )}
                
                <input 
                  type="radio" 
                  name="plano" 
                  value={p.id}
                  checked={planoId === p.id}
                  onChange={() => {
                    setPlanoId(p.id);
                    setDescontoPlanoRs(0);
                  }}
                  className="sr-only"
                />
                
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-xl text-slate-100">{p.nome}</h4>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-black text-blue-400">
                    R$ {p.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm font-normal text-slate-500">/mês</span>
                </div>
                
                {p.description && (
                  <p className="text-xs text-slate-400 mb-6 min-h-[40px] leading-relaxed">
                    {p.description}
                  </p>
                )}
                
                {p.features && p.features.length > 0 && (
                  <div className="flex-1 space-y-3 border-t border-slate-800/60 pt-6">
                    {p.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-300 leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg text-slate-200">Licenças Adicionais (PDVs / Lojas Extras)</h4>
            <p className="text-sm text-slate-400 mt-1">Expanda a operação pagando apenas {formatMoney(precoLicencaExtra)}/mês e {formatMoney(taxaLicencaExtra)} de setup por licença extra.</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-lg border border-slate-800">
            <button 
              onClick={() => setLicencasAdicionais(Math.max(0, licencasAdicionais - 1))}
              className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            >
              <span className="text-xl font-bold">-</span>
            </button>
            <span className="text-xl font-black w-8 text-center">{licencasAdicionais}</span>
            <button 
              onClick={() => setLicencasAdicionais(licencasAdicionais + 1)}
              className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
            >
              <span className="text-xl font-bold">+</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 my-6"></div>

        {/* Resumo do Investimento */}
        <div>
          <h3 className="text-sm uppercase font-bold tracking-wider text-blue-500 mb-4">Resumo do Investimento</h3>
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-slate-300 font-medium">Plano {plano.nome}</span>
              <div className="text-right flex flex-col items-end relative">
                {isEditingPlano ? (
                  <div className="flex flex-col items-end z-10 bg-[#1e293b] p-3 rounded-lg border border-[#0084d1]/50 shadow-[0_0_20px_rgba(0,132,209,0.2)]">
                    <label className="text-xs font-bold text-slate-400 mb-2 uppercase">Novo Valor da Mensalidade</label>
                    <NumericFormat
                      value={tempPlanoVal}
                      onValueChange={(values) => setTempPlanoVal(values.floatValue || 0)}
                      prefix="R$ "
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={2}
                      fixedDecimalScale={true}
                      autoFocus
                      onKeyDown={handleKeyDownPlano}
                      className="bg-[#0f172a] border border-[#0084d1] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0084d1] text-right font-black text-2xl text-[#0084d1] w-48 transition-all"
                    />
                    <div className="flex justify-end gap-2 mt-3 w-full">
                      <button onClick={() => setIsEditingPlano(false)} className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-200">Cancelar</button>
                      <button onClick={handleConfirmEditPlano} className="px-3 py-1 text-xs font-bold bg-[#0084d1] hover:bg-blue-500 text-white rounded">Aplicar</button>
                    </div>
                    {errorPlanoMsg && (
                      <span className="text-red-400 flex items-center gap-1 text-xs font-bold mt-2"><AlertCircle className="w-3 h-3"/> {errorPlanoMsg}</span>
                    )}
                  </div>
                ) : (
                  <div onClick={handleEditPlanoClick} className="cursor-pointer group relative flex flex-col items-end p-2 -mr-2 rounded hover:bg-slate-800/50 transition-colors">
                    {descontoPlanoRs > 0 ? (
                      <>
                        <span className="line-through text-slate-500 text-sm mb-1 font-light">{formatMoney(plano.preco)}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#0084d1]/20 text-[#0084d1] text-xs font-bold px-2 py-1 rounded border border-[#0084d1]/30">
                            AJUSTE DE PARCERIA
                          </span>
                          <span className="font-black text-2xl group-hover:scale-105 transition-transform" style={{ color: '#0084d1' }}>
                            {formatMoney(currentFinalPlanoValue)}<span className="text-sm text-slate-400">/mês</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="font-bold text-slate-100 text-lg group-hover:scale-105 transition-transform">
                        {formatMoney(plano.preco)}/mês
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-300 font-medium">Taxa de Implantação</span>
              <div className="text-right flex flex-col items-end relative">
                {isEditing ? (
                  <div className="flex flex-col items-end z-10 bg-[#1e293b] p-3 rounded-lg border border-[#0084d1]/50 shadow-[0_0_20px_rgba(0,132,209,0.2)]">
                    <label className="text-xs font-bold text-slate-400 mb-2 uppercase">Novo Valor da Implantação</label>
                    <NumericFormat
                      value={tempVal}
                      onValueChange={(values) => setTempVal(values.floatValue || 0)}
                      prefix="R$ "
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={2}
                      fixedDecimalScale={true}
                      autoFocus
                      onKeyDown={handleKeyDown}
                      className="bg-slate-950 border border-blue-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-black text-2xl text-blue-400 w-48 transition-all"
                    />
                    <div className="flex justify-end gap-2 mt-3 w-full">
                      <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-200">Cancelar</button>
                      <button onClick={handleConfirmEdit} className="px-3 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded">Aplicar</button>
                    </div>
                    {errorMsg && (
                      <span className="text-red-400 flex items-center gap-1 text-xs font-bold mt-2"><AlertCircle className="w-3 h-3"/> {errorMsg}</span>
                    )}
                  </div>
                ) : (
                  <div onClick={handleEditClick} className="cursor-pointer group relative flex flex-col items-end p-2 -mr-2 rounded hover:bg-slate-800/50 transition-colors">
                    {descontoRs > 0 || descontoTaxa ? (
                      <>
                        <span className="line-through text-slate-500 text-sm mb-1 font-light">{formatMoney(taxa)}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#0084d1]/20 text-[#0084d1] text-xs font-bold px-2 py-1 rounded border border-[#0084d1]/30">
                            AJUSTE DE PARCERIA
                          </span>
                          <span className="font-black text-2xl group-hover:scale-105 transition-transform" style={{ color: '#0084d1' }}>
                            {formatMoney(currentFinalValue)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="font-bold text-slate-100 text-lg group-hover:scale-105 transition-transform">
                        {formatMoney(taxa)}
                      </span>
                    )}
                  </div>
                )}
              </div>
          </div>
          
          {licencasAdicionais > 0 && (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-4 mt-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span className="text-slate-300 font-medium">Licenças Adicionais ({licencasAdicionais}x)</span>
                <div className="text-right flex flex-col items-end relative">
                  {isEditingLicencas ? (
                    <div className="flex flex-col items-end z-10 bg-[#1e293b] p-3 rounded-lg border border-[#0084d1]/50 shadow-[0_0_20px_rgba(0,132,209,0.2)]">
                      <label className="text-xs font-bold text-slate-400 mb-2 uppercase">Novo Valor da Mensalidade (Extras)</label>
                      <NumericFormat
                        value={tempLicencasVal}
                        onValueChange={(values) => setTempLicencasVal(values.floatValue || 0)}
                        prefix="R$ "
                        decimalSeparator=","
                        thousandSeparator="."
                        decimalScale={2}
                        fixedDecimalScale={true}
                        autoFocus
                        onKeyDown={handleKeyDownLicencas}
                        className="bg-[#0f172a] border border-[#0084d1] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0084d1] text-right font-black text-2xl text-[#0084d1] w-48 transition-all"
                      />
                      <div className="flex justify-end gap-2 mt-3 w-full">
                        <button onClick={() => setIsEditingLicencas(false)} className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-200">Cancelar</button>
                        <button onClick={handleConfirmEditLicencas} className="px-3 py-1 text-xs font-bold bg-[#0084d1] hover:bg-blue-500 text-white rounded">Aplicar</button>
                      </div>
                      {errorLicencasMsg && (
                        <span className="text-red-400 flex items-center gap-1 text-xs font-bold mt-2"><AlertCircle className="w-3 h-3"/> {errorLicencasMsg}</span>
                      )}
                    </div>
                  ) : (
                    <div onClick={handleEditLicencasClick} className="cursor-pointer group relative flex flex-col items-end p-2 -mr-2 rounded hover:bg-slate-800/50 transition-colors">
                      {descontoLicencasRs > 0 ? (
                        <>
                          <span className="line-through text-slate-500 text-sm mb-1 font-light">{formatMoney(valorLicencasBase)}</span>
                          <div className="flex items-center gap-2">
                            <span className="bg-[#0084d1]/20 text-[#0084d1] text-xs font-bold px-2 py-1 rounded border border-[#0084d1]/30">
                              AJUSTE
                            </span>
                            <span className="font-black text-2xl group-hover:scale-105 transition-transform" style={{ color: '#0084d1' }}>
                              {formatMoney(currentFinalLicencasValue)}<span className="text-sm text-slate-400">/mês</span>
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="font-bold text-slate-100 text-lg group-hover:scale-105 transition-transform">
                          {formatMoney(valorLicencasBase)}/mês
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-300 font-medium">Implantação de Licenças ({licencasAdicionais}x)</span>
                <div className="text-right flex flex-col items-end relative">
                  {isEditingSetupLicencas ? (
                    <div className="flex flex-col items-end z-10 bg-[#1e293b] p-3 rounded-lg border border-[#0084d1]/50 shadow-[0_0_20px_rgba(0,132,209,0.2)]">
                      <label className="text-xs font-bold text-slate-400 mb-2 uppercase">Nova Implantação (Extras)</label>
                      <NumericFormat
                        value={tempSetupLicencasVal}
                        onValueChange={(values) => setTempSetupLicencasVal(values.floatValue || 0)}
                        prefix="R$ "
                        decimalSeparator=","
                        thousandSeparator="."
                        decimalScale={2}
                        fixedDecimalScale={true}
                        autoFocus
                        onKeyDown={handleKeyDownSetupLicencas}
                        className="bg-slate-950 border border-blue-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-black text-2xl text-blue-400 w-48 transition-all"
                      />
                      <div className="flex justify-end gap-2 mt-3 w-full">
                        <button onClick={() => setIsEditingSetupLicencas(false)} className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-200">Cancelar</button>
                        <button onClick={handleConfirmEditSetupLicencas} className="px-3 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded">Aplicar</button>
                      </div>
                      {errorSetupLicencasMsg && (
                        <span className="text-red-400 flex items-center gap-1 text-xs font-bold mt-2"><AlertCircle className="w-3 h-3"/> {errorSetupLicencasMsg}</span>
                      )}
                    </div>
                  ) : (
                    <div onClick={handleEditSetupLicencasClick} className="cursor-pointer group relative flex flex-col items-end p-2 -mr-2 rounded hover:bg-slate-800/50 transition-colors">
                      {descontoSetupLicencasRs > 0 ? (
                        <>
                          <span className="line-through text-slate-500 text-sm mb-1 font-light">{formatMoney(taxaLicencasBase)}</span>
                          <div className="flex items-center gap-2">
                            <span className="bg-[#0084d1]/20 text-[#0084d1] text-xs font-bold px-2 py-1 rounded border border-[#0084d1]/30">
                              AJUSTE
                            </span>
                            <span className="font-black text-2xl group-hover:scale-105 transition-transform" style={{ color: '#0084d1' }}>
                              {formatMoney(currentFinalTaxaLicencasValue)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="font-bold text-slate-100 text-lg group-hover:scale-105 transition-transform">
                          {formatMoney(taxaLicencasBase)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
        {/* Validade da Proposta */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-yellow-500" /> Prazos da Proposta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Validade da Proposta</label>
              <input 
                type="text" 
                value={validadeProposta} 
                onChange={(e) => setValidadeProposta(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ex: 3 dias" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Validade da Isenção de Setup</label>
              <input 
                type="text" 
                value={validadeSetup} 
                onChange={(e) => setValidadeSetup(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ex: Hoje até as 18h" 
              />
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
