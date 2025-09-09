import { generateResearchMessage } from '@/lib/mastra/mcp';

export async function POST(request: Request) {
  console.log('Research API route called');
  
  try {
    const body = await request.json();
    const { query } = body;
    
    console.log('Research query received:', query);
    
    if (!query) {
      console.log('Research API error: Query is required');
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await generateResearchMessage(query);
    
    console.log('Research result generated:', result);
    
    return new Response(
      JSON.stringify({ result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Research API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate research response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
