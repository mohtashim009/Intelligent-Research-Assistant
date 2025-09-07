import { MCPClient } from '@mastra/mcp';

// Test MCP connectivity with the provided URL
async function testMcpConnectivity() {
  console.log('Testing MCP server connectivity...');
  
  // Check if PERPLEXITY_MCP_URL is set
  const url = process.env.PERPLEXITY_MCP_URL || process.env.MCP_PERPLEXITY_URL;
  console.log('PERPLEXITY_MCP_URL set:', !!process.env.PERPLEXITY_MCP_URL);
  console.log('MCP_PERPLEXITY_URL set:', !!process.env.MCP_PERPLEXITY_URL);
  console.log('URL value:', url);
  
  if (!url) {
    console.log('No MCP URL found in environment variables');
    return;
  }
  
  try {
    // Create MCP client with the provided URL
    const client = new MCPClient({
      servers: {
        perplexity: { url: new URL(url) }
      }
    });
    
    console.log('MCP client created successfully');
    
    // Try to get toolsets
    console.log('Getting toolsets...');
    const toolsets = await client.getToolsets();
    console.log('Available toolsets:', Object.keys(toolsets));
    
    // Check if Perplexity search tool is available
    const perplexityTools = Object.keys(toolsets).filter(key => key.includes('perplexity'));
    console.log('Perplexity tools found:', perplexityTools);
    
    // Close the connection
    await client.disconnect();
    console.log('MCP client disconnected');
  } catch (error) {
    console.error('MCP connectivity error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testMcpConnectivity().catch(console.error);
