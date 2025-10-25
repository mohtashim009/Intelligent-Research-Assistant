import { createTool } from '@mastra/core';
import { z } from 'zod';

if (!!process.env.PERPLEXITY_API_KEY) {
    console.error('PERPLEXITY_API_KEY not found');
}

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Direct Perplexity API call (no MCP needed)
async function callPerplexityAPI(messages: Array<{ role: string; content: string }>, model: string = 'llama-3.1-sonar-large-128k-online') {
  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Perplexity Search Tool (direct API)
export const perplexitySearchTool = createTool({
  id: 'perplexity_search',
  description: 'Search the web using Perplexity AI with real-time information and citations. Use this for comprehensive research with up-to-date information.',
  inputSchema: z.object({
    query: z.string().describe('Search query or research question'),
  }),
  execute: async ({ context }) => {
    const result = await callPerplexityAPI([
      {
        role: 'system',
        content: 'You are a helpful research assistant. Provide comprehensive, well-researched answers with citations. Format your response in markdown with clear sections and bullet points.',
      },
      {
        role: 'user',
        content: context.query,
      },
    ], 'llama-3.1-sonar-large-128k-online');
    
    return result;
  },
});

// Perplexity Deep Research Tool (direct API)
export const perplexityResearchTool = createTool({
  id: 'perplexity_research',
  description: 'Conduct in-depth research using Perplexity AI. Use this for complex research questions requiring detailed analysis and multiple sources.',
  inputSchema: z.object({
    query: z.string().describe('Research question or topic'),
  }),
  execute: async ({ context }) => {
    const result = await callPerplexityAPI([
      {
        role: 'system',
        content: `You are an advanced research assistant conducting deep research. 

Your task is to:
1. Analyze the research question thoroughly
2. Search multiple sources and perspectives
3. Provide comprehensive findings with citations
4. Structure the response with clear sections
5. Include key insights and conclusions

Format your response as a detailed research report in markdown.`,
      },
      {
        role: 'user',
        content: context.query,
      },
    ], 'llama-3.1-sonar-large-128k-online');
    
    return result;
  },
});

// Perplexity Reasoning Tool (direct API)
export const perplexityReasoningTool = createTool({
  id: 'perplexity_reason',
  description: 'Use Perplexity AI for complex reasoning and analysis tasks. Best for questions requiring logical thinking and step-by-step analysis.',
  inputSchema: z.object({
    query: z.string().describe('Question or problem requiring reasoning'),
  }),
  execute: async ({ context }) => {
    const result = await callPerplexityAPI([
      {
        role: 'system',
        content: 'You are an analytical reasoning assistant. Break down complex problems, analyze them step-by-step, and provide clear logical conclusions.',
      },
      {
        role: 'user',
        content: context.query,
      },
    ], 'llama-3.1-sonar-large-128k-online');
    
    return result;
  },
});

// Export all Perplexity tools
export const perplexityTools = {
  perplexity_search: perplexitySearchTool,
  perplexity_research: perplexityResearchTool,
  perplexity_reason: perplexityReasoningTool,
};
