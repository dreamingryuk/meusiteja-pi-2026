const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Modelos confiáveis para tentar em ordem. Sem DeepSeek, sem modelos de classificação.
const MODELOS = [
  'gemma2-9b-it',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
];

async function chamadaGroq(model, text, context) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
          content: 'Você é um assistente especializado em melhorar textos de portfólio profissional. REGRAS OBRIGATÓRIAS: 1. RESPONDA SEMPRE EM PORTUGUÊS DO BRASIL. 2. Deixe o texto mais claro, objetivo e atraente, mantendo o significado original. 3. Corrija gramática e melhore o tom profissional. 4. Retorne APENAS o texto melhorado, sem aspas, sem explicações, sem introduções.'
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

  return response;
}

export async function improveText(text, context) {
  if (!text || text.trim().length < 10) return text;

  for (const model of MODELOS) {
    try {
      console.log(`Groq: tentando modelo ${model}...`);
      const response = await chamadaGroq(model, text, context);

      if (response.status === 404 || response.status === 400) {
        const err = await response.json().catch(() => ({}));
        const msg = err?.error?.message || '';
        // Modelo desativado, não existe ou incompatível — tenta o próximo
        if (
          msg.includes('does not exist') ||
          msg.includes('decommissioned') ||
          msg.includes('not found') ||
          msg.includes('not have access') ||
          msg.includes('text classification')
        ) {
          console.warn(`Groq: modelo ${model} indisponível, tentando próximo...`);
          continue;
        }
        console.error(`Groq erro (${model}):`, msg);
        return text;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error(`Groq erro status ${response.status}:`, JSON.stringify(err));
        return text;
      }

      const data = await response.json();
      let result = data.choices?.[0]?.message?.content || '';

      // Remove qualquer tag <think>...</think> de modelos de raciocínio
      result = result.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();

      console.log(`Groq: sucesso com modelo ${model}`);
      return result || text;

    } catch (error) {
      console.error(`Groq: erro de rede com modelo ${model}:`, error);
      // Continua para o próximo modelo
    }
  }

  // Nenhum modelo funcionou, retorna o texto original
  console.warn('Groq: todos os modelos falharam. Retornando texto original.');
  return text;
}
