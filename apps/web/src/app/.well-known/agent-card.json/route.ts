import { listAgents } from '../../../lib/agent-registry';

export async function GET() {
  try {
    const cards = listAgents().map(agent => ({
      name: agent.name,
      description: agent.summary,
    }));
    
    return Response.json({ agents: cards });
  } catch (e) {
    return Response.json({ error: 'Failed to retrieve agent card' }, { status: 500 });
  }
}
