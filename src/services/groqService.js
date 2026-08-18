const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function improveText(text, context) {
  if (!text || text.trim().length < 10) return text;

  try {
    // 1. Buscar os modelos disponíveis para esta chave de API
    const modelsResponse = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`
      }
    });
    
    let selectedModel = 'mixtral-8x7b-32768'; // fallback
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      if (modelsData && modelsData.data && modelsData.data.length > 0) {
        const modelIds = modelsData.data.map(m => m.id);
        
        // Ordem de preferência de modelos
        const preferred = [
          'llama-3.3-70b-versatile',
          'llama-3.1-8b-instant',
          'llama-3.2-90b-text-preview',
          'llama-3.2-3b-preview',
          'mixtral-8x7b-32768',
          'gemma2-9b-it'
        ];
        
        selectedModel = preferred.find(id => modelIds.includes(id)) || modelIds[0];
        console.log('Modelo selecionado dinamicamente pelo Groq:', selectedModel);
      }
    }

    // 2. Fazer a chamada para o modelo selecionado
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em melhorar textos de portfólio profissional. REGRAS OBRIGATÓRIAS:\n1. RESPONDA SEMPRE EM PORTUGUÊS DO BRASIL.\n2. Deixe o texto mais claro, objetivo e atraente, corrigindo gramática e melhorando o tom.\n3. NÃO mostre seu processo de pensamento. NÃO use a tag <think>.\n4. Retorne APENAS o texto finalizado, sem aspas, comentários ou introduções.'
          },
          {
            role: 'user',
            content: `Melhore o seguinte texto sobre ${context}: "${text}"`
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq erro status:', response.status);
      console.error('Groq erro detalhe:', JSON.stringify(errorData));
      return text;
    }

    const data = await response.json();
    let finalContent = data.choices[0].message.content || '';
    
    // Remove tags <think> e seu conteúdo gerados por modelos de raciocínio (como o DeepSeek)
    finalContent = finalContent.replace(/<think>[\s\S]*?<\/think>/g, '');
    
    return finalContent.trim();
  } catch (error) {
    console.error('Groq erro de rede ou CORS:', error);
    return text;
  }
}
