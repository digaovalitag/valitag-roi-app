// Motor de sincronização offline-first para o Google Sheets

const OFFLINE_KEY = 'valitag_offline_leads';

export const saveOfflineLead = (leadData) => {
  const pending = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
  pending.push({
    ...leadData,
    _timestamp: new Date().toISOString()
  });
  localStorage.setItem(OFFLINE_KEY, JSON.stringify(pending));
  console.log('Lead salvo em cache offline.', leadData);
};

export const syncDataToSheet = async (webhookUrl, payload, type = 'lead') => {
  if (!webhookUrl) {
    console.warn(`Webhook URL não configurada. Salvando ${type} offline...`);
    if (type === 'lead') saveOfflineLead(payload);
    // Para time, poderíamos fazer uma fila separada, mas assumimos que o time é salvo localmente em `valitag_team` de qualquer forma
    return false;
  }

  try {
    const finalPayload = {
      type: type, // 'lead' ou 'team'
      data: payload
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalPayload)
    });

    console.log(`${type} sincronizado com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Falha na sincronização de ${type}.`, error);
    if (type === 'lead') saveOfflineLead(payload);
    return false;
  }
};

export const processOfflineLeads = async (webhookUrl) => {
  if (!webhookUrl || !navigator.onLine) return;

  const pending = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
  if (pending.length === 0) return;

  console.log(`Processando ${pending.length} leads offline...`);
  
  const stillPending = [];

  for (const lead of pending) {
    try {
      const finalPayload = {
        type: 'lead',
        data: lead
      };
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalPayload)
      });
    } catch (error) {
      console.error('Falha ao processar lead pendente', error);
      stillPending.push(lead);
    }
  }

  if (stillPending.length !== pending.length) {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(stillPending));
    console.log('Fila offline atualizada.');
  }
};

export const fetchValitagPlans = async () => {
  try {
    // Utilizando proxy CORS (CodeTabs) pois a API original bloqueia localhost
    const targetUrl = 'https://www.valitag.com.br/api/public/plans';
    const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${targetUrl}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    
    const mappedPlanos = {};
    
    data.forEach(plan => {
      if (plan.code === 'FREE') return;
      
      const codeUpper = plan.code.toUpperCase();
      let internalId = '';
      
      if (codeUpper.includes('STARTER')) internalId = 'starter';
      else if (codeUpper.includes('PRO')) internalId = 'pro';
      else if (codeUpper.includes('GESTAO_COMPLETA') || codeUpper.includes('GESTÃO COMPLETA')) internalId = 'gestaoCompleta';
      else if (codeUpper.includes('GESTAO') || codeUpper.includes('GESTÃO')) internalId = 'gestao';
      else if (codeUpper.includes('INTELIGENTE')) internalId = 'inteligente';
      else if (codeUpper.includes('TOTAL')) internalId = 'total';
      else internalId = plan.code.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      mappedPlanos[internalId] = {
        id: internalId,
        nome: plan.name,
        preco: plan.monthlyAmountCents / 100,
        description: plan.description || '',
        features: plan.features || [],
        recommended: !!plan.recommended,
        visible: true
      };
    });
    
    return mappedPlanos;
  } catch (error) {
    console.error('Erro ao sincronizar planos da API Valitag', error);
    return null;
  }
};
