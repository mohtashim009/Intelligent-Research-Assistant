import { mastraPerplexityAdapter } from './lib/search/adapters/mastra-perplexity';
import { mastraSerpAdapter } from './lib/search/adapters/mastra-serp';

async function testRealSearch() {
  console.log('Testing real search capabilities...');
  
  // Test if adapters are configured
  console.log('Mastra Perplexity configured:', mastraPerplexityAdapter.isConfigured());
  console.log('Mastra Serp configured:', mastraSerpAdapter.isConfigured());
  
  // Test search if API key is available
  if (mastraPerplexityAdapter.isConfigured()) {
    try {
      console.log('Testing Mastra Perplexity search...');
      const perplexityResults = await mastraPerplexityAdapter.search('latest AI news', { max: 3 });
      console.log('Perplexity results:', perplexityResults);
    } catch (error: any) {
      console.error('Perplexity search error:', error.message);
      console.error('Stack trace:', error.stack);
    }
  } else {
    console.log('Mastra Perplexity adapter not configured - skipping test');
  }
  
  if (mastraSerpAdapter.isConfigured()) {
    try {
      console.log('Testing Mastra Serp search...');
      const serpResults = await mastraSerpAdapter.search('latest AI news', { max: 3 });
      console.log('Serp results:', serpResults);
    } catch (error: any) {
      console.error('Serp search error:', error.message);
      console.error('Stack trace:', error.stack);
    }
  } else {
    console.log('Mastra Serp adapter not configured - skipping test');
  }
}

testRealSearch().catch(console.error);
