import { notFound } from 'next/navigation';

import { AsfdkView } from '../../../agents/asfdk/view';
import { AsfdkDevView } from '../../../agents/asfdk-dev/view';
import { AsfdkDeployView } from '../../../agents/asfdk-deploy/view';
import { OtoiView } from '../../../agents/otoi/view';
import { RrtView } from '../../../agents/rrt/view';
import { SleepwalkerView } from '../../../agents/sleepwalker/view';
import { ToiView } from '../../../agents/toi/view';
import { getAgent } from '../../../lib/agent-registry';

function renderAgentView(slug: string) {
  switch (slug) {
    case 'toi':
      return <ToiView />;
    case 'otoi':
      return <OtoiView />;
    case 'asfdk':
      return <AsfdkView />;
    case 'asfdk-dev':
      return <AsfdkDevView />;
    case 'asfdk-deploy':
      return <AsfdkDeployView />;
    case 'rrt':
      return <RrtView />;
    case 'sleepwalker':
      return <SleepwalkerView />;
    default:
      return null;
  }
}

export default async function AgentPlaygroundPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = getAgent(slug);

  if (!agent) {
    notFound();
  }

  return renderAgentView(agent.slug);
}
