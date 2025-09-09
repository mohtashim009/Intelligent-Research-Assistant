import { researchAgent, generateResearchMessage } from '../mastra/mcp';

export class MastraPerplexitySearch {
  constructor() {
    // Agent is already initialized as a singleton
    // Only available on server side
  }

  async generateResearchMessage(query: string): Promise<string> {
    // Check if we're on the server side and agent is available
    if (typeof window !== 'undefined') {
      throw new Error('Mastra Perplexity search is only available on the server side');
    }
    
    return await generateResearchMessage(query);
  }
}
