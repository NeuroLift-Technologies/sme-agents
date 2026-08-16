import { getAgent } from '../../../lib/agent-registry';

/**
 * GET /.well-known/agent-card.json
 * 
 * Returns the aggregate A2A agent card for the SME Agents Playground.
 * This endpoint is the public discovery document for the A2A Protocol,
 * listing all registered agents and their specialties.
 * 
 * @returns {Promise<Response>} JSON containing an array of agent cards
 * 
 * @example
 * curl https://sme-agents-one.vercel.app/.well-known/agent-card.json
 */
export async function GET() {
  try {
    const agentList = ['toi', 'otoi', 'asfdk', 'rrt', 'sleepwalker', 'sdl'] as const;
    const cards = agentList
      .map(slug => {
        const agent = getAgent(slug);
        if (!agent) return null;
        return {
          name: agent.name,
          description: agent.summary,
          tags: [slug, 'sme'],
        };
      })
      .filter(Boolean);
    
    return Response.json({ agents: cards });
  } catch {
    return Response.json({ error: 'Failed to retrieve agent card' }, { status: 500 });
  }
}
