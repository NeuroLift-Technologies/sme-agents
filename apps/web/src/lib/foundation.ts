import {
  createFoundation,
  FoundationMode,
  type NeuroLiftFoundation,
} from '@neurolift-technologies/asfdk';

import {
  type AgentMode,
  type AgentSlug,
  getAgent,
  listAgents,
} from './agent-registry';

const foundationModeMap: Record<AgentMode, FoundationMode> = {
  UNIFIED: FoundationMode.UNIFIED,
  CRISIS_ONLY: FoundationMode.CRISIS_ONLY,
  CONTINUITY_ONLY: FoundationMode.CONTINUITY_ONLY,
  FRAMEWORK_ONLY: FoundationMode.FRAMEWORK_ONLY,
  DEVELOPMENT: FoundationMode.DEVELOPMENT,
};

const foundationCache = new Map<AgentSlug, Promise<NeuroLiftFoundation>>();

function foundationUserId(slug: AgentSlug): string {
  return `apps-web-${slug}-foundation`;
}

async function buildFoundation(slug: AgentSlug): Promise<NeuroLiftFoundation> {
  const agent = getAgent(slug);
  if (!agent) {
    throw new Error(`Unknown agent slug: ${slug}`);
  }

  return createFoundation({
    userId: foundationUserId(slug),
    mode: foundationModeMap[agent.mode],
  });
}

export function getFoundation(slug: AgentSlug): Promise<NeuroLiftFoundation> {
  const cached = foundationCache.get(slug);
  if (cached) {
    return cached;
  }

  const created = buildFoundation(slug);
  foundationCache.set(slug, created);
  return created;
}

export async function getAllFoundations(): Promise<Record<AgentSlug, NeuroLiftFoundation>> {
  const entries = await Promise.all(
    listAgents().map(async (agent) => [agent.slug, await getFoundation(agent.slug)] as const),
  );

  return Object.fromEntries(entries) as Record<AgentSlug, NeuroLiftFoundation>;
}
