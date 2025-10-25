// import { MCPClient } from '@mastra/mcp';
import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { serpApiTools } from './serpapi-tool';
import { perplexityTools } from './perplexity-direct';

// MCP is commented out because:
// 1. Direct Perplexity API tools work everywhere (including serverless like Vercel)
// 2. MCP requires npm install at runtime (not possible in serverless)
// 3. MCP requires long-running processes (not supported in serverless)
// 4. Direct API calls are faster and more reliable

// export interface MCPConfig {
//   command?: string;
//   args?: string[];
//   env?: Record<string, string>;
//   url?: string;
// }

// let mcp: MCPClient | null = null;
let researchAgent: Agent | null = null;
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

// Initialize MCP client and agent asynchronously (lazy initialization)
async function initializeMCP() {
  // Skip if already initialized
  if (researchAgent) {
    return;
  }

  // Skip if in browser
  if (typeof window !== 'undefined') {
    return;
  }

  // Skip during build/static generation (Next.js sets this during build)
  // In production runtime, this will be undefined, so initialization will proceed
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⏭️  Skipping MCP initialization during build');
    return;
  }

  // If already initializing, wait for that to complete
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }

  // Mark as initializing and create promise
  isInitializing = true;
  initializationPromise = (async () => {
    try {
      console.log('🚀 Initializing research agent...');

      // MCP initialization commented out - using direct API calls instead
      // MCP doesn't work in serverless environments (Vercel, Netlify, etc.)
      // try {
      //   console.log('   Attempting MCP client initialization...');
      //   mcp = new MCPClient({
      //     servers: {
      //       'perplexity': {
      //         command: 'npx',
      //         args: ['-y', '@perplexity-ai/mcp-server'],
      //         env: {
      //           PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY || '',
      //           PERPLEXITY_TIMEOUT_MS: "600000",
      //         }
      //       },
      //     }
      //   });
      //   await new Promise(resolve => setTimeout(resolve, 3000));
      //   console.log('   ✅ MCP client initialized');
      // } catch (mcpError) {
      //   console.warn('   ⚠️  MCP client initialization failed');
      //   mcp = null;
      // }

      // Log available tools for debugging
      console.log('✅ Perplexity Tools loaded:', Object.keys(perplexityTools));
      console.log('✅ SerpAPI Tools loaded:', Object.keys(serpApiTools));

      // Create agent with Perplexity Direct API and SerpAPI tools
      researchAgent = new Agent({
        name: 'Deep Research Assistant',
        instructions: `You are an advanced AI Deep Research Assistant, similar to Google Deep Research.

## Core Research Methodology:

1. **Multi-Source Investigation**
   - ALWAYS use multiple tools and sources for comprehensive research
   - Start with googleSearch for overview, then dive deeper with specialized tools
   - Use googleScholar for academic credibility and peer-reviewed sources
   - Use googleNews for recent developments and current context
   - Cross-reference information across different sources

2. **Systematic Research Process**
   - Break down complex queries into sub-questions
   - Investigate each aspect thoroughly using appropriate tools
   - Gather 10-20+ sources per research query
   - Verify information across multiple sources
   - Note conflicting information and different perspectives

3. **Deep Analysis Requirements**
   - For ALL topics: Start with perplexity_search or perplexity_research for real-time, cited information
   - For academic topics: perplexity_research + googleScholar (multiple searches with different keywords)
   - For current events: perplexity_search + googleNews + googleSearch
   - For products/services: perplexity_search + googleShopping + googleSearch + reviews
   - For local information: perplexity_search + googleMaps + googleSearch
   - For technical topics: perplexity_research + googleSearch + youtubeSearch (tutorials) + googleScholar (papers)
   - For reasoning/analysis: perplexity_reason + supporting research tools

4. **Report Generation**
   - Create comprehensive, well-structured reports
   - Include an executive summary at the top
   - Organize findings by themes/categories
   - Provide detailed analysis with evidence
   - Include ALL citations with source URLs
   - Add a "Sources" section at the end with numbered references
   - Highlight key findings and insights
   - Note any limitations or gaps in available information

5. **Citation Standards**
   - Every claim must be backed by a source
   - Use inline citations: [Source Name](URL) or [1], [2], etc.
   - Include publication dates when available
   - Distinguish between academic sources, news, and general web content

6. **Quality Standards**
   - Prioritize authoritative and credible sources
   - Include diverse perspectives
   - Fact-check across multiple sources
   - Note the recency of information
   - Identify potential biases in sources

## Available Tools:

**Perplexity AI Tools (Real-time Web Search with Citations):**
- perplexity_search: Direct web search using Perplexity AI with real-time information and citations
- perplexity_research: In-depth research using Perplexity AI for complex questions requiring detailed analysis
- perplexity_reason: Complex reasoning and analysis tasks requiring logical thinking

**Primary Search Tools:**
- googleSearch: General web search - use for overview and broad information
- googleScholar: Academic papers - use for scholarly research and citations
- googleNews: Recent news - use for current events and developments

**Specialized Search Tools:**
- googleShopping: Product research and pricing
- youtubeSearch: Video content and tutorials
- googleMaps: Local businesses and places
- googleJobs: Job market research
- googleImages: Visual research

**Alternative Search Engines:**
- bingSearch: Bing web search for cross-verification
- duckduckgoSearch: Privacy-focused search for cross-verification
- baiduSearch: Chinese language content and China-specific information
- yandexSearch: Russian language content and Russia-specific information

## Research Workflow:

1. **Understand the query** and identify key aspects
2. **Start with Perplexity tools** for real-time information:
   - Use perplexity_search for quick, cited answers
   - Use perplexity_research for in-depth analysis
   - Use perplexity_reason for complex logical problems
3. **Supplement with specialized tools** (minimum 3-5 different tools total):
   - googleScholar for academic credibility
   - googleNews for recent developments
   - googleSearch for additional context
   - Specialized tools as needed (Shopping, Maps, YouTube, etc.)
4. **Execute multiple searches** with varied keywords
5. **Analyze and synthesize** findings from all sources
6. **Cross-reference information** across different tools
7. **Generate comprehensive report** with citations from all sources
8. **Review for completeness** and accuracy

## Output Format:

# [Research Topic]

## Executive Summary
[2-3 paragraph overview of key findings]

## Key Findings
- [Major insight 1] [citation]
- [Major insight 2] [citation]
- [Major insight 3] [citation]

## Detailed Analysis

### [Aspect 1]
[Detailed information with citations]

### [Aspect 2]
[Detailed information with citations]

### [Aspect 3]
[Detailed information with citations]

## Conclusions
[Synthesis and implications]

## Sources
1. [Source 1 with URL]
2. [Source 2 with URL]
...

Remember: Quality over speed. Thorough research with multiple sources is essential.`,
        model: google('gemini-2.5-flash'),
        tools: {
          ...perplexityTools,    // Direct Perplexity API (always available)
          ...serpApiTools,       // SerpAPI tools (always available)
        }
      });

      console.log('✅ Research agent initialized successfully');
    } catch (error) {
      console.error('❌ Research agent initialization failed:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      researchAgent = null;
    } finally {
      isInitializing = false;
    }
  })();

  return initializationPromise;
}

// DO NOT initialize on module load - use lazy initialization instead
// This prevents MCP from starting during build/static generation

export async function generateResearchMessage(query: string): Promise<string> {
  // Lazy initialization - only initialize when actually needed
  if (!researchAgent) {
    console.log('🔄 Research agent not initialized, initializing now...');
    await initializeMCP();

    if (!researchAgent) {
      throw new Error('Research agent failed to initialize');
    }
  }

  try {
    console.log('\n🔬 Starting Deep Research...');
    console.log('📝 Query:', query);
    console.log('⏰ Started at:', new Date().toISOString());
    console.log('─'.repeat(80));

    // Use the agent to generate a comprehensive response
    const result = await researchAgent.generate(query, {
      onStepFinish: (step) => {
        // Log tool calls
        if (step.toolCalls && step.toolCalls.length > 0) {
          step.toolCalls.forEach((toolCall: any, index: number) => {
            console.log(`\n🔧 Tool Call #${index + 1}:`);
            // Try different property names that might contain the tool name
            const toolName = toolCall.toolName || toolCall.name || toolCall.type || 'unknown';
            console.log(`   Tool: ${toolName}`);
            // Log all available properties for debugging
            if (process.env.NODE_ENV === 'development') {
              console.log(`   Available properties:`, Object.keys(toolCall));
              console.log(`   Available properties values:`, Object.values(toolCall));

            }
            if (toolCall.args !== undefined) {
              console.log(`   Args:`, JSON.stringify(toolCall.args, null, 2));
            }
          });
        }

        // Log tool results
        if (step.toolResults && step.toolResults.length > 0) {
          step.toolResults.forEach((toolResult: any, index: number) => {
            console.log(`\n✅ Tool Result #${index + 1}:`);
            const toolName = toolResult.toolName || toolResult.name || toolResult.type || 'unknown';
            console.log(`   Tool: ${toolName}`);
            if (toolResult.result !== undefined) {
              const resultStr = JSON.stringify(toolResult.result);
              const resultPreview = resultStr.substring(0, 200);
              console.log(`   Result Preview: ${resultPreview}${resultStr.length > 200 ? '...' : ''}`);
            }
          });
        }

        // Log text generation
        if (step.text) {
          console.log(`\n💭 Agent Thinking:`);
          console.log(`   ${step.text.substring(0, 150)}...`);
        }

        console.log('─'.repeat(80));
      }
    });

    console.log('\n✨ Research Complete!');
    console.log('⏰ Finished at:', new Date().toISOString());
    console.log('📊 Response length:', result.text.length, 'characters');
    console.log('═'.repeat(80));

    return result.text;
  } catch (error) {
    console.error('\n❌ Agent message generation error:', error);
    throw error;
  }
}
