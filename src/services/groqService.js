export async function improveText(text, context) {
  if (!text || text.trim().length < 10) return text;
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um assistente que melhora textos de portfólio profissional. Deixe o texto mais claro, objetivo e atraente, mantendo o mesmo significado. Corrija gramática e melhore o tom. Responda apenas com o texto melhorado, sem adicionar comentários.' 
          },
          { 
            role: 'user', 
            content: `Melhore o seguinte texto sobre ${context}: "${text}"` 
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na API Groq:', errorData);
      throw new Error(`Erro na API Groq: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro ao melhorar texto:', error);
    return text;
  }
}