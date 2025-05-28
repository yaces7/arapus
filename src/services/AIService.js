/**
 * AI Service
 * 
 * This service handles communication with AI APIs.
 * It provides methods to get responses from the AI based on user input.
 */
class AIService {
  constructor(apiKey = '') {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }
  
  // Set or update the API key
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }
  
  // Get a response from the AI
  async getResponse(userInput) {
    if (!this.apiKey) {
      throw new Error('API anahtarı gereklidir');
    }
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Sen Yaoay adında, yardımcı, bilgili ve arkadaş canlısı bir yapay zeka asistanısın. Türkçe konuşuyorsun ve sorulara kısa ve net cevaplar veriyorsun. Cevapların doğru, bilgilendirici ve nazik olmalı.'
            },
            {
              role: 'user',
              content: userInput
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API isteği başarısız oldu');
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI API error:', error);
      throw error;
    }
  }
  
  // Alternative method to use different AI APIs
  async useAlternativeAPI(userInput) {
    // This is a placeholder for implementing alternative AI APIs
    // such as Google's Gemini, Anthropic's Claude, etc.
    
    // Example implementation would be similar to the getResponse method
    // but with different API endpoints and request formats
    
    throw new Error('Alternative API not implemented yet');
  }
}

export default AIService;
