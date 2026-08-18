const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// 👇 MODELO CORRIGIDO AQUI 👇
const GROQ_MODEL = 'llama-3.1-8b-instant';

const getGroqApiKey = () => {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  return typeof key === 'string' ? key.trim() : '';
};

export const isGroqConfigured = () => Boolean(getGroqApiKey());

export async function improveText(text, context = 'texto profissional') {
  if (!text || text.trim().length < 10) return text;

  const apiKey = getGroqApiKey();

  if (!apiKey) {
    console.error('❌ VITE_GROQ_API_KEY não foi encontrada nas variáveis de ambiente!');
    throw new Error(
      'VITE_GROQ_API_KEY não está configurada. Adicione essa variável nas Environment Variables do Render com o prefixo VITE_ e faça um novo deploy (Clear build cache).'
    );
  }

  try {
    console.log(`🤖 [Groq Service] Enviando requisição para IA (${context})...`);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente que melhora textos de portfólio profissional. Deixe o texto mais claro, objetivo e atraente, mantendo o mesmo significado. Corrija gramática e melhore o tom. Responda apenas com o texto melhorado, sem comentários.'
          },
          {
            role: 'user',
            content: `Melhore o seguinte texto sobre ${context}: "${text.trim()}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      const apiMessage =
        data?.error?.message ||
        data?.message ||
        `A Groq respondeu com HTTP ${response.status}.`;

      console.error('❌ Error no retorno da API Groq:', apiMessage);
      throw new Error(`Erro na IA: ${apiMessage}`);
    }

    const result = data?.choices?.[0]?.message?.content?.trim();

    if (!result) {
      throw new Error('A IA respondeu, mas não retornou um texto válido.');
    }

    console.log(`✅ [Groq Service] Texto gerado com sucesso para (${context}).`);
    return result;

  } catch (error) {
    console.error('❌ Falha durante a requisição com a Groq:', error);
    throw error;
  }
}
