const { getMcpClient } = require('./lib/mastra/mcp.js');

async function testMcpClient() {
  console.log('Testing MCP client...');
  
  try {
    const client = getMcpClient();
    console.log('MCP client created successfully');
    
    // Try to get toolsets
    console.log('Getting toolsets...');
    const toolsets = await client.getToolsets();
    console.log('Available toolsets:', Object.keys(toolsets));
    
    // Check if Perplexity search tool is available
    const perplexityTools = Object.keys(toolsets).filter(key => key.includes('perplexity'));
    console.log('Perplexity tools found:', perplexityTools);
  } catch (error) {
    console.error('MCP client error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testMcpClient().catch(console.error);
