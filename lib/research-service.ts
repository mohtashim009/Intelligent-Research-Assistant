export class ResearchService {
  static async generateResearchMessage(query: string): Promise<string> {
    console.log('Research service called with query:', query);
    
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('Research API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Research API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Research API response data:', data);
      return data.result;
    } catch (error) {
      console.error('Research service error:', error);
      throw error;
    }
  }
}
