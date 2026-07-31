import webPackage from '../../../../package.json';

import { listAgents } from '../../../lib/agent-registry';

export async function GET() {
  const agentVersions = Object.fromEntries(
    listAgents().map((agent) => [agent.slug, `${agent.package}@${agent.version}`]),
  );

  return Response.json({
    app: webPackage.name,
    frameworks: {
      next: webPackage.dependencies.next,
      react: webPackage.dependencies.react,
      reactDom: webPackage.dependencies['react-dom'],
      ai: webPackage.dependencies.ai,
    },
    versions: agentVersions,
  });
}
