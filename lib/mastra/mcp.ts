import { MCPClient } from '@mastra/mcp';
import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';

export interface MCPConfig {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
}

// Create MCP client with error handling for browser environment
export let mcp: MCPClient | null = null;
export let researchAgent: Agent | null = null;

// Only initialize MCP client and agent on the server side
if (typeof window === 'undefined') {
  try {
    mcp = new MCPClient({
      servers: {
        'perplexity-ask': {
          command: 'npx',
          args: [
            '-y',
            'server-perplexity-ask'
          ],
          env: {
            PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY || ''
          }
        }
      }
    });
    
    // Wait a bit for the MCP client to initialize properly
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create agent with MCP tools
    researchAgent = new Agent({
      name: 'Research Assistant Agent',
      instructions: 'You are a research assistant AI. You can use tools from connected MCP servers to provide comprehensive research responses. Always format your responses in markdown with clear headings and bullet points where appropriate.',
      model: google('gemini-2.5-flash'),
      tools: mcp ? await mcp.getTools() : {}
    });
  } catch (error) {
    console.warn('MCP client or agent initialization failed:', error);
  }
}

export async function generateResearchMessage(query: string): Promise<string> {
  if (!researchAgent) {
    throw new Error('Research agent is not available');
  }
  
  try {
    // Use the agent to generate a comprehensive response
    // Using generateVNext for V2 models like gemini-2.0-flash-exp
    const result = await researchAgent.generateVNext(query);
    return result.text;
  } catch (error) {
    console.error('Agent message generation error:', error);
    throw error;
  }
}
