import { createTool } from '@mastra/core';
import { z } from 'zod';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// Get API key at runtime (not at module load time)
function getPerplexityApiKey(): string {
    const apiKey = process.env.PERPLEXITY_API_KEY || '';

    if (!apiKey) {
        console.warn('⚠️  PERPLEXITY_API_KEY not found in environment variables');
        console.warn('   Perplexity tools will not be available');
        throw new Error('PERPLEXITY_API_KEY is required but not set');
    }

    return apiKey;
}

// Direct Perplexity API call (no MCP needed)
async function callPerplexityAPI(messages: Array<{ role: string; content: string }>, model: string = 'sonar') {
    const apiKey = getPerplexityApiKey(); // Get key at runtime

    console.log('🔍 Calling Perplexity API...');
    console.log('   Model:', model);

    const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
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
        console.error('❌ Perplexity API error:', response.status);
        console.error('   Response:', error.substring(0, 200));
        throw new Error(`Perplexity API error: ${response.status} - ${error.substring(0, 200)}`);
    }

    const data = await response.json();
    console.log('✅ Perplexity API response received');
    return data.choices[0].message.content;
}

// Perplexity Search Tool (direct API)
export const perplexitySearchTool = createTool({
    id: 'perplexity_search',
    description: 'Search the web using Perplexity AI with real-time information and citations. Use this for general questions when SerpAPI tools are not sufficient. Provides quick, cited answers.',
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
        ], 'sonar');

        return result;
    },
});

// Perplexity Deep Research Tool (direct API)
export const perplexityResearchTool = createTool({
    id: 'perplexity_research',
    description: 'EXTREME CASES ONLY: Use only when SerpAPI tools and perplexity_search fail to provide results. Conducts very deep research with detailed analysis.',
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
        ], 'sonar');

        return result;
    },
});

// Perplexity Reasoning Tool (direct API)
export const perplexityReasoningTool = createTool({
    id: 'perplexity_reason',
    description: 'Use for complex reasoning and analysis tasks that require logical thinking. Use sparingly - prefer SerpAPI tools for factual research.',
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
        ], 'sonar');

        return result;
    },
});

// Export all Perplexity tools
export const perplexityTools = {
    perplexity_search: perplexitySearchTool,
    perplexity_research: perplexityResearchTool,
    perplexity_reason: perplexityReasoningTool,
};
