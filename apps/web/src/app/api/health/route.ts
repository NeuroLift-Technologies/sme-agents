import { listAgents } from '../../../lib/agent-registry';

export async function GET() {
  const agentVersions = Object.fromEntries(
    listAgents().map((agent) => [agent.slug, `${agent.package}@${agent.version}`]),
  );

  return Response.json({
    app: 'sme-agents-web',
    frameworks: {
      next: '16.3.0',
      react: '18.3.1',
      reactDom: '18.3.1',
      ai: '5.0.228',
    },
    versions: agentVersions,
  });
}
