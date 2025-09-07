import { getMcpClient } from './lib/mastra/mcp';
import { mastraPerplexityAdapter } from './lib/search/adapters/mastra-perplexity';
import { mastraSerpAdapter } from './lib/search/adapters/mastra-serp';

async function testMastraIntegration() {
  console.log('Testing Mastra integration...');
  
  // Test if adapters are configured
  console.log('Mastra Perplexity configured:', mastraPerplexityAdapter.isConfigured());
  console.log('Mastra Serp configured:', mastraSerpAdapter.isConfigured());
  
  // Test MCP client
  try {
    const client = getMcpClient();
    console.log('MCP client created successfully');
  } catch (error) {
    console.error('MCP client creation error:', error);
  }
}

testMastraIntegration();
