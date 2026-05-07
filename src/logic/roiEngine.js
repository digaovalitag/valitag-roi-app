export const DEFAULT_PLANOS = {
  starter: { id: 'starter', nome: 'Starter', preco: 247 },
  pro: { id: 'pro', nome: 'Pro', preco: 297 },
  gestao: { id: 'gestao', nome: 'Gestão', preco: 590 },
  vCoreChef: { id: 'vCoreChef', nome: 'V-Core Chef', preco: 397 },
  vCoreFull: { id: 'vCoreFull', nome: 'V-Core Full', preco: 790 },
  vCoreMyer: { id: 'vCoreMyer', nome: 'V-Core Myer', preco: 990 },
};

export const DEFAULT_TAXA = 1400;
export const DEFAULT_DESCONTO_MAX = 15;

export function calculateROI(fat, planoId, descontoTaxa, descontoRs = 0, descontoPlanoRs = 0, descontoLicencasRs = 0, descontoSetupLicencasRs = 0, questions = [], responses = {}, pricingConfig = null, licencasAdicionais = 0) {
  const faturamento = parseFloat(fat) || 0;
  const config = pricingConfig || { planos: DEFAULT_PLANOS, taxa: DEFAULT_TAXA, precoLicencaExtra: 147, taxaLicencaExtra: 700 };
  
  const precoLicencaExtra = config.precoLicencaExtra || 147;
  const taxaLicencaExtra = config.taxaLicencaExtra || 700;
  
  let perdaValidadeMensal = 0;
  let perdaEstoqueMensal = 0;
  let prejuizoEficiencia = 0;

  const detalhes = {
    validade: [],
    estoque: [],
    eficiencia: []
  };
  
  // Helper para obter resposta numérica ou string
  const getResponse = (id) => responses[id] !== undefined ? responses[id] : null;
  const getNum = (id) => parseFloat(getResponse(id)) || 0;

  // 1. Módulo de Validade
  const perdaInsumosVal = getNum('perda_insumos');
  if (perdaInsumosVal > 0) {
    const loss = perdaInsumosVal * 4 * 55; // 4 semanas x R$ 55
    perdaValidadeMensal += loss;
    detalhes.validade.push({ text: 'Perda de insumos caros (Proteínas/Laticínios)', val: perdaInsumosVal * 4, unit: 'Kg/mês', loss });
  }

  const fiscalizacao = getResponse('fiscalizacao');
  if (fiscalizacao === 'sim') {
    const loss = faturamento * 0.005; // 0.5%
    if (loss > 0) {
      perdaValidadeMensal += loss;
      detalhes.validade.push({ text: 'Multa aplicada caso visita da vigilância', val: 1, unit: 'Risco', loss });
    }
  }

  const tipoEtiqueta = getResponse('tipo_etiqueta');
  if (tipoEtiqueta === 'nao_fazem') {
    const loss = faturamento * 0.01; // 1%
    if (loss > 0) {
      perdaValidadeMensal += loss;
      detalhes.validade.push({ text: 'Risco altíssimo: Operação sem etiquetas de validade', val: 1, unit: 'Risco', loss });
    }
  }

  const dificEtiqueta = getResponse('dific_etiqueta');
  if (dificEtiqueta === 'sim') {
    const loss = faturamento * 0.0025; // 0.25%
    if (loss > 0) {
      perdaValidadeMensal += loss;
      detalhes.validade.push({ text: 'Descontrole de validade por erros manuais', val: 1, unit: 'Risco', loss });
    }
  }

  // 2. Módulo de Estoque
  const cmv = getNum('cmv');
  if (cmv > 35) {
    const loss = faturamento * 0.01; // 1%
    if (loss > 0) {
      perdaEstoqueMensal += loss;
      detalhes.estoque.push({ text: 'Vazamento por CMV Crítico', val: cmv, unit: '%', loss });
    }
  }

  const controleEstoque = getResponse('controle_estoque');
  if (controleEstoque === 'nenhum' || controleEstoque === 'baixa') {
    const loss = faturamento * 0.005; // 0.5%
    if (loss > 0) {
      perdaEstoqueMensal += loss;
      detalhes.estoque.push({ text: 'Falta de gestão de estoque eficiente', val: 1, unit: 'Risco', loss });
    }
  }

  // 3. Módulo de Eficiência Operacional
  const colaboradores = getNum('colaboradores');
  if (tipoEtiqueta === 'manual') {
    let multiplier = 1;
    if (colaboradores > 20) multiplier = 3;
    else if (colaboradores > 5) multiplier = 2;
    const loss = 450 * multiplier; // 30h * R$ 15 * multiplicador de equipe
    if (loss > 0) {
      prejuizoEficiencia += loss;
      detalhes.eficiencia.push({ text: 'Horas perdidas escrevendo etiquetas (Custo HH)', val: 30 * multiplier, unit: 'Horas', loss });
    }
  }

  const guiaChecklist = getResponse('guia_checklist');
  if (guiaChecklist === 'sim') {
    const loss = 200;
    prejuizoEficiencia += loss;
    detalhes.eficiencia.push({ text: 'Despadronização de processos (Risco Operacional)', val: 1, unit: 'Ocorr', loss });
  }

  const errosEquipe = getResponse('erros_equipe');
  if (errosEquipe === 'alta' || errosEquipe === 'media') {
    const rate = errosEquipe === 'alta' ? 0.01 : 0.005;
    const loss = faturamento * rate;
    if (loss > 0) {
      prejuizoEficiencia += loss;
      detalhes.eficiencia.push({ text: 'Retrabalho e erros da equipe', val: 1, unit: 'Risco', loss });
    }
  }
  
  let totalPerdaMensal = perdaValidadeMensal + perdaEstoqueMensal + prejuizoEficiencia;
  let totalPerdaDiaria = totalPerdaMensal / 30;
  let totalPerdaAnual = totalPerdaMensal * 12;
  
  const diagnosticoCompleto = {
    perdaValidadeMensal,
    perdaEstoqueMensal,
    prejuizoEficiencia,
    totalPerdaMensal,
    totalPerdaDiaria,
    totalPerdaAnual,
    detalhes: JSON.parse(JSON.stringify(detalhes))
  };

  let economiaDoPlanoMensal = totalPerdaMensal;

  if (planoId === 'starter') {
    economiaDoPlanoMensal = faturamento * 0.003;
  }

  const plano = config.planos[planoId] || config.planos.starter;
  
  const custoBasePlano = plano.preco;
  let custoPlanoBaseFinal = custoBasePlano;
  if (descontoPlanoRs > 0) {
    custoPlanoBaseFinal = Math.max(0, custoBasePlano - descontoPlanoRs);
  }

  const valorLicencasBase = licencasAdicionais * precoLicencaExtra;
  let custoLicencasFinal = valorLicencasBase;
  if (descontoLicencasRs > 0) {
    custoLicencasFinal = Math.max(0, valorLicencasBase - descontoLicencasRs);
  }
  
  let custoPlano = custoPlanoBaseFinal + custoLicencasFinal;
  
  const taxaBase = config.taxa;
  let custoImplantacaoBaseFinal = taxaBase;
  if (descontoTaxa) {
    custoImplantacaoBaseFinal = 0;
  } else if (descontoRs > 0) {
    custoImplantacaoBaseFinal = Math.max(0, taxaBase - descontoRs);
  }

  const taxaLicencasBase = licencasAdicionais * taxaLicencaExtra;
  let custoImplantacaoLicencasFinal = taxaLicencasBase;
  if (descontoSetupLicencasRs > 0) {
    custoImplantacaoLicencasFinal = Math.max(0, taxaLicencasBase - descontoSetupLicencasRs);
  }
  
  let custoImplantacaoTotal = taxaBase + taxaLicencasBase;
  let custoImplantacao = custoImplantacaoBaseFinal + custoImplantacaoLicencasFinal;
  
  const investimentoInicial = custoPlano + custoImplantacao;
  
  const economiaDoPlanoDiaria = economiaDoPlanoMensal / 30;
  const paybackDias = economiaDoPlanoDiaria > 0 ? custoPlano / economiaDoPlanoDiaria : 0;
  
  return {
    perdaValidadeMensal,
    perdaEstoqueMensal,
    prejuizoEficiencia,
    totalPerdaMensal,
    totalPerdaDiaria,
    totalPerdaAnual,
    investimentoInicial,
    custoPlano,
    custoImplantacao,
    custoImplantacaoTotal, // Retornando o total sem desconto
    paybackDias,
    detalhes,
    diagnosticoCompleto,
    economiaDoPlanoMensal,
    custoBasePlano,
    valorLicencas: valorLicencasBase,
    custoPlanoBaseFinal,
    custoLicencasFinal,
    custoImplantacaoBaseFinal,
    custoImplantacaoLicencasFinal,
    licencasAdicionais,
    precoLicencaExtra,
    taxaBase,
    taxaLicencas: taxaLicencasBase
  };
}
