import { mastra } from '@/lib/mastra';

export async function POST(request: Request) {
  console.log('Research API route called');

  try {
    const body = await request.json();
    const { query, threadId, resourceId } = body;

    console.log('Research query received:', query);

    if (!query) {
      console.log('Research API error: Query is required');
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the master agent to handle routing to appropriate sub-agents
    const masterAgent = mastra.getAgent('masterAgent');

    // Track progress logs
    const progressLogs: string[] = [];

    // Generate response with memory context and step logging
    const result = await masterAgent.generate(query, {
      memory: threadId && resourceId ? {
        thread: threadId,
        resource: resourceId,
      } : undefined,
      maxSteps: 20, // Allow multiple agent interactions (master -> research -> tools -> synthesis)
      onStepFinish: (step) => {
        // Log tool calls
        if (step.toolCalls && step.toolCalls.length > 0) {
          step.toolCalls.forEach((toolCall: any) => {
            console.log(toolCall);
            const toolName = toolCall.toolName || toolCall.name || 'unknown';
            const logMessage = `🔧 Using ${toolName}...`;
            console.log(logMessage);
            progressLogs.push(logMessage);
          });
        }

        // Log tool results
        if (step.toolResults && step.toolResults.length > 0) {
          step.toolResults.forEach((toolResult: any) => {
            console.log(toolResult);
            const toolName = toolResult.toolName || toolResult.name || 'unknown';
            const success = !toolResult.error;
            const logMessage = success
              ? `✅ ${toolName} completed`
              : `❌ ${toolName} failed`;
            console.log(logMessage);
            progressLogs.push(logMessage);
          });
        }

        // Log text generation
        if (step.text && step.text.length > 0) {
          const preview = step.text.substring(0, 100);
          console.log(`💭 Agent: ${preview}...`);
        }
      }
    });

    console.log('Research result generated');
    console.log('Progress logs:', progressLogs);
    console.log('Result object:', JSON.stringify(result, null, 2));
    console.log('Result text length:', result.text?.length || 0);
    console.log('Result text preview:', result.text?.substring(0, 200) || 'NO TEXT');

    return new Response(
      JSON.stringify({
        result: result.text || 'No response generated',
        threadId: threadId || 'default',
        resourceId: resourceId || 'default',
        progressLogs: progressLogs, // Include progress logs in response
        toolsUsed: progressLogs.filter(log => log.includes('Using')).length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Research API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate research response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
