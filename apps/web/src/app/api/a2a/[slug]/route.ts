import { getAgent } from '../../../../lib/agent-registry';

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const agent = getAgent(slug);
  
  if (!agent) {
    return Response.json({ error: 'Unknown agent slug.' }, { status: 404 });
  }

  const body = await request.json();
  
  try {
    // Simple JSON-RPC response for peer agent communication
    const response = {
      jsonrpc: '2.0',
      id: body?.id || 1,
      result: {
        agent: slug,
        status: 'received',
      },
    };
    
    return new Response(
      JSON.stringify(response),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (e) {
    return Response.json({ error: 'Internal A2A server error' }, { status: 500 });
  }
}
