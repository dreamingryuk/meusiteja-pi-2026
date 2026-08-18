const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

async function getModelsDisponiveis() {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const ids = (data.data || []).map(m => m.id);
    console.log('=== MODELOS DISPONÍVEIS NA SUA CHAVE GROQ ===');
    ids.forEach(id => console.log(' -', id));
    console.log('=============================================');
    return ids;
  } catch {
    return [];
  }
}

async function chamadaGroq(model, text, context) {
  return await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em melhorar textos de portfólio profissional. REGRAS OBRIGATÓRIAS: 1. RESPONDA SEMPRE EM PORTUGUÊS DO BRASIL. 2. Deixe o texto mais claro e profissional. 3. Retorne APENAS o texto melhorado, sem aspas, sem explicações.'
        },
        {
          role: 'user',
          content: `Melhore este texto de portfólio sobre ${context}: ${text}`
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    })
  });
}

export async function improveText(text, context) {
  if (!text || text.trim().length < 10) return text;

  try {
    // Busca os modelos reais disponíveis na conta
    const modelIds = await getModelsDisponiveis();

    // Filtra apenas modelos de chat (remove guardrails, whisper, embed, vision, deepseek)
    const PALAVRAS_BLOQUEADAS = ['guard', 'safeguard', 'whisper', 'embed', 'vision', 'deepseek', 'distil-whisper'];
    const chatModels = modelIds.filter(id =>
      !PALAVRAS_BLOQUEADAS.some(p => id.toLowerCase().includes(p))
    );

    // Palavras-chave de modelos preferidos (leve e rápido)
    const PREFERIDOS = ['gemma', 'llama', 'mistral', 'mixtral', 'qwen'];

    // Tenta primeiro modelos preferidos, depois os demais
    const ordenados = [
      ...chatModels.filter(id => PREFERIDOS.some(p => id.toLowerCase().includes(p))),
      ...chatModels.filter(id => !PREFERIDOS.some(p => id.toLowerCase().includes(p)))
    ];

    if (ordenados.length === 0) {
      console.warn('Groq: nenhum modelo de chat encontrado.');
      return text;
    }

    for (const model of ordenados) {
      try {
        console.log(`Groq: tentando modelo ${model}...`);
        const response = await chamadaGroq(model, text, context);

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          console.warn(`Groq: modelo ${model} falhou (${response.status}):`, err?.error?.message || '');
          continue;
        }

        const data = await response.json();
        let result = data.choices?.[0]?.message?.content || '';
        // Remove tags <think> de modelos de raciocínio
        result = result.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();
        console.log(`Groq: sucesso com modelo ${model}`);
        return result || text;

      } catch (err) {
        console.warn(`Groq: erro de rede com modelo ${model}:`, err);
      }
    }

    console.warn('Groq: todos os modelos falharam.');
    return text;

  } catch (error) {
    console.error('Groq: erro geral:', error);
    return text;
  }
}
