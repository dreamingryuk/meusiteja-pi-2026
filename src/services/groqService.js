const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Modelos disponíveis nesta conta Groq, em ordem de preferência para geração de texto
const MODELOS = [
  { id: 'qwen/qwen3.6-27b', noThinking: true },  // Suporta disable thinking
  { id: 'openai/gpt-oss-20b', noThinking: false },
  { id: 'openai/gpt-oss-120b', noThinking: false },
  { id: 'groq/compound-mini', noThinking: false },
  { id: 'groq/compound', noThinking: false },
  { id: 'allam-2-7b', noThinking: false },
];

async function chamadaGroq(modelConfig, text, context) {
  const body = {
    model: modelConfig.id,
    messages: [
      {
        role: 'system',
        content: 'Você é um assistente especializado em melhorar textos de portfólio profissional. REGRAS OBRIGATÓRIAS: 1. RESPONDA SEMPRE EM PORTUGUÊS DO BRASIL. 2. Deixe o texto mais claro e profissional. 3. Retorne APENAS o texto melhorado, sem aspas, sem explicações, sem comentários.'
      },
      {
        role: 'user',
        content: `Melhore este texto de portfólio sobre ${context}: ${text}`
      }
    ],
    temperature: 0.5,
    max_tokens: 500
  };

  // Desativa o modo "thinking" do Qwen3 para não gerar tags <think>
  if (modelConfig.noThinking) {
    body.thinking = { type: 'disabled' };
  }

  return await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify(body)
  });
}

export async function improveText(text, context) {
  if (!text || text.trim().length < 10) return text;

  for (const modelConfig of MODELOS) {
    try {
      console.log(`Groq: tentando modelo ${modelConfig.id}...`);
      const response = await chamadaGroq(modelConfig, text, context);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.warn(`Groq: modelo ${modelConfig.id} falhou (${response.status}):`, err?.error?.message || '');
        continue;
      }

      const data = await response.json();
      let result = data.choices?.[0]?.message?.content || '';

      // Segurança extra: remove tags <think> caso algum modelo ainda as gere
      result = result.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();

      console.log(`Groq: sucesso com modelo ${modelConfig.id}`);
      return result || text;

    } catch (err) {
      console.warn(`Groq: erro de rede com modelo ${modelConfig.id}:`, err);
    }
  }

  console.warn('Groq: todos os modelos falharam. Retornando texto original.');
  return text;
}
