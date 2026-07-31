export type AgentMode =
  | 'UNIFIED'
  | 'CRISIS_ONLY'
  | 'CONTINUITY_ONLY'
  | 'FRAMEWORK_ONLY'
  | 'DEVELOPMENT';

export type AgentSlug = 'toi' | 'otoi' | 'asfdk' | 'rrt' | 'sleepwalker';

export interface AgentDefinition {
  slug: AgentSlug;
  id: string;
  name: string;
  repo: string;
  package: string;
  version: string;
  mode: AgentMode;
  summary: string;
  disclaimer?: string;
}

export const agentRegistry: Record<AgentSlug, AgentDefinition> = {
  toi: {
    slug: 'toi',
    id: 'toi-agent',
    name: 'TOI SME Agent',
    repo: 'https://github.com/NeuroLift-Technologies/nlt-toi',
    package: '@neurolift-technologies/toi',
    version: '1.0.1',
    mode: 'FRAMEWORK_ONLY',
    summary: 'Parses, validates, canonicalizes, and resolves Terms of Interaction documents.',
  },
  otoi: {
    slug: 'otoi',
    id: 'otoi-agent',
    name: 'OTOI SME Agent',
    repo: 'https://github.com/NeuroLift-Technologies/nlt-otoi',
    package: '@neurolift-technologies/otoi',
    version: '1.2.0',
    mode: 'UNIFIED',
    summary: 'Honors TOI stacks across agent meshes with enforcement and conflict handling.',
  },
  asfdk: {
    slug: 'asfdk',
    id: 'asfdk-agent',
    name: 'ASFDK Coordinator',
    repo: 'https://github.com/NeuroLift-Technologies/asfdk',
    package: '@neurolift-technologies/asfdk',
    version: '0.2.0',
    mode: 'UNIFIED',
    summary: 'Coordinates all five foundations without merging domain-specific reasoning.',
  },
  rrt: {
    slug: 'rrt',
    id: 'rrt-agent',
    name: 'RRT Advocate SME Agent',
    repo: 'https://github.com/NeuroLift-Technologies/rrt-advocate',
    package: '@neurolift-technologies/rrt-advocate',
    version: '0.1.1',
    mode: 'CRISIS_ONLY',
    summary: 'Prototype crisis-signal assessment with transparent escalation guidance.',
    disclaimer: 'PROTOTYPE / not medical advice. For emergencies, contact local emergency services or 988.',
  },
  sleepwalker: {
    slug: 'sleepwalker',
    id: 'sleepwalker-agent',
    name: 'Sleepwalker Protocol SME Agent',
    repo: 'https://github.com/NeuroLift-Technologies/sleepwalker',
    package: '@neurolift-technologies/sleepwalker-protocol',
    version: '1.0.2',
    mode: 'CONTINUITY_ONLY',
    summary: 'Prototype continuity and protective-state analysis for session handoff readiness.',
    disclaimer: 'PROTOTYPE / not medical advice. Continuity summaries do not replace professional care.',
  },
};

export const agentList = Object.values(agentRegistry);
export const agentSlugs = agentList.map((agent) => agent.slug);

export function listAgents(): AgentDefinition[] {
  return agentList;
}

export function getAgent(slug: string): AgentDefinition | undefined {
  return agentRegistry[slug as AgentSlug];
}
