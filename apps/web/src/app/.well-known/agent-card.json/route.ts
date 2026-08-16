import { getAgent, AgentSlug } from '../../../lib/agent-registry';

export async function GET() {
  try {
    const agents = getAgent('toi'); // placeholder - get all agents
    const agentList = ['toi', 'otoi', 'asfdk', 'rrt', 'sleepwalker', 'sdl'];
    const cards = agentList.map(slug => {
      const agent = getAgent(slug);
      if (!agent) return null;
      return {
        name: agent.name,
        description: agent.summary,
      };
    }).filter(Boolean);
    
    return Response.json({ agents: cards });
  } catch (e) {
    return Response.json({ error: 'Failed to retrieve agent card' }, { status: 500 });
  }
}
