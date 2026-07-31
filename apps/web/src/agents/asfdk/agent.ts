import type { HealthCheckResult } from '@neurolift-technologies/asfdk';

import { assessRrt } from '../rrt/agent';
import { assessSleepwalker } from '../sleepwalker/agent';
import { getAgent, listAgents, type AgentSlug } from '../../lib/agent-registry';
import { getAllFoundations } from '../../lib/foundation';

export interface CoordinatedResponse {
  slug: AgentSlug;
  name: string;
  foundationMode: string;
  foundationHealth: HealthCheckResult;
  summary: string;
  data?: unknown;
}

export interface AsfdkRunResult {
  summary: string;
  responses: CoordinatedResponse[];
}

function toiPerspective(query: string) {
  return {
    summary: 'TOI would translate this request into explicit allowed actions, disallowed actions, data handling, and audit signals.',
    data: {
      query,
      recommendedSections: ['Purpose', 'Scope', 'Allowed', 'Disallowed', 'Escalations'],
    },
  };
}

function otoiPerspective(query: string) {
  return {
    summary: 'OTOI would bind the TOI stack to the participating agent mesh, pick an enforcement mode, and log propagation targets.',
    data: {
      query,
      workflowOutputs: ['effective policy', 'enforcement mode', 'handoff contract'],
    },
  };
}

export async function askAllAgents(query: string): Promise<AsfdkRunResult> {
  const foundations = await getAllFoundations();
  const agents = listAgents();
  const healthEntries = await Promise.all(
    agents.map(async (agent) => [agent.slug, await foundations[agent.slug].healthCheck()] as const),
  );
  const healthMap = Object.fromEntries(healthEntries) as Record<AgentSlug, HealthCheckResult>;

  const responses: CoordinatedResponse[] = [];

  const coordinator = getAgent('asfdk')!;
  responses.push({
    slug: 'asfdk',
    name: coordinator.name,
    foundationMode: coordinator.mode,
    foundationHealth: healthMap.asfdk,
    summary: 'Coordinator foundation is active and assembling independent per-agent perspectives without merging their domains.',
    data: { query },
  });

  const toiAgent = getAgent('toi')!;
  const toiResult = toiPerspective(query);
  responses.push({
    slug: 'toi',
    name: toiAgent.name,
    foundationMode: toiAgent.mode,
    foundationHealth: healthMap.toi,
    summary: toiResult.summary,
    data: toiResult.data,
  });

  const otoiAgent = getAgent('otoi')!;
  const otoiResult = otoiPerspective(query);
  responses.push({
    slug: 'otoi',
    name: otoiAgent.name,
    foundationMode: otoiAgent.mode,
    foundationHealth: healthMap.otoi,
    summary: otoiResult.summary,
    data: otoiResult.data,
  });

  const rrtAgent = getAgent('rrt')!;
  const rrtResult = await assessRrt(query, 'apps-web-asfdk-rrt');
  responses.push({
    slug: 'rrt',
    name: rrtAgent.name,
    foundationMode: rrtAgent.mode,
    foundationHealth: healthMap.rrt,
    summary: rrtResult.summary,
    data: rrtResult,
  });

  const sleepwalkerAgent = getAgent('sleepwalker')!;
  const sleepwalkerResult = assessSleepwalker({ note: query, history: [] });
  responses.push({
    slug: 'sleepwalker',
    name: sleepwalkerAgent.name,
    foundationMode: sleepwalkerAgent.mode,
    foundationHealth: healthMap.sleepwalker,
    summary: sleepwalkerResult.summary,
    data: sleepwalkerResult,
  });

  return {
    summary: `Coordinated ${responses.length} foundation responses for the prompt: ${query}`,
    responses,
  };
}
