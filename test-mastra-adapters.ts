import { mastraPerplexityAdapter } from "@/lib/search/adapters/mastra-perplexity";
import { mastraSerpAdapter } from "@/lib/search/adapters/mastra-serp";

async function testMastraAdapters() {
  console.log("Testing Mastra adapters...");
  
  // Test if adapters are configured
  console.log("Mastra Perplexity configured:", mastraPerplexityAdapter.isConfigured());
  console.log("Mastra Serp configured:", mastraSerpAdapter.isConfigured());
  
  // Test search if API key is available
  if (mastraPerplexityAdapter.isConfigured()) {
    try {
      console.log("Testing Mastra Perplexity search...");
      const perplexityResults = await mastraPerplexityAdapter.search("latest AI news", { max: 3 });
      console.log("Perplexity results:", perplexityResults);
    } catch (error) {
      console.error("Perplexity search error:", error);
    }
  }
  
  if (mastraSerpAdapter.isConfigured()) {
    try {
      console.log("Testing Mastra Serp search...");
      const serpResults = await mastraSerpAdapter.search("latest AI news", { max: 3 });
      console.log("Serp results:", serpResults);
    } catch (error) {
      console.error("Serp search error:", error);
    }
  }
}

testMastraAdapters();
