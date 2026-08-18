const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const getGroqApiKey = () => {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  return typeof key === 'string' ? key.trim() : '';
};

export const isGroqConfigured = () => Boolean(getGroqApiKey());

export async function improveText(text, context = 'texto profissional') {
  if (!text || text.trim().length < 10) return text;

  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error(
      'VITE_GROQ_API_KEY não está configurada. Adicione essa variável no .env local e nas Environment Variables do Render e faça um novo deploy.'
    );
  }

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
  } catch {
    data = null;
  }

  if (!response.ok) {
    const apiMessage =
      data?.error?.message ||
      data?.message ||
      `A Groq respondeu com HTTP ${response.status}.`;

    throw new Error(`Erro na IA: ${apiMessage}`);
  }

  const result = data?.choices?.[0]?.message?.content?.trim();

  if (!result) {
    throw new Error('A IA respondeu, mas não retornou um texto válido.');
  }

  return result;
}
