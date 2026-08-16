import { getAgent } from '../../../../lib/agent-registry';

/**
 * POST /api/a2a/[slug]
 * 
 * JSON-RPC endpoint implementing the A2A Protocol for a specific agent.
 * Allows peer agents to send messages and receive responses.
 * 
 * The A2A protocol uses a JSON-RPC 2.0 envelope. This route accepts
 * standard A2A message requests and returns JSON-RPC-compliant responses.
 * 
 * @param request - The incoming HTTP request with JSON-RPC payload
 * @param context - Route params containing the target agent slug
 * @returns {Promise<Response>} JSON-RPC 2.0 formatted response
 * 
 * @example
 * // Send a message to the TOI agent via A2A
 * curl -X POST https://sme-agents-one.vercel.app/api/a2a/toi \
 *   -H "Content-Type: application/json" \
 *   -d '{"jsonrpc":"2.0","method":"message/send","params":{"text":"parse my TOI"}}'
 */
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
  const response = {
    jsonrpc: '2.0' as const,
    id: (body as { id?: unknown })?.id ?? 1,
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
}
