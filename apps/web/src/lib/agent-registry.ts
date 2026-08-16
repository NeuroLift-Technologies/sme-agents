export type AgentMode =
  | 'UNIFIED'
  | 'CRISIS_ONLY'
  | 'CONTINUITY_ONLY'
  | 'FRAMEWORK_ONLY'
  | 'DEVELOPMENT';

export type AgentSlug = 'toi' | 'otoi' | 'asfdk' | 'asfdk-dev' | 'asfdk-deploy' | 'rrt' | 'sleepwalker' | 'sdl';

export interface AgentDefinition {
  slug: AgentSlug;
  id: string;
  name: string;
  repo: string;
  package: string;
  version: string;
  mode: AgentMode;
  summary: string;
  systemPrompt: string;
  disclaimer?: string;
  subAgentIds?: string[];
}

export const agentRegistry: Record<AgentSlug, AgentDefinition> = {
  toi: {
    slug: 'toi',
    id: 'toi-agent',
    name: 'TOI SME Agent',
    repo: 'https://github.com/NeuroLift-Technologies/nlt-toi',
    package: '@neurolift-technologies/toi',
    version: '1.0.3',
    mode: 'FRAMEWORK_ONLY',
    summary: 'Parses, validates, canonicalizes, and resolves Terms of Interaction documents.',
    systemPrompt: `You are the TOI Adoption Agent for the Solidarity Framework.
Goal: Help users define, validate, and refine consent-based Terms of Interaction.
Constraints: Default-deny — only explicitly allowed actions are permitted. Always include a plain-language summary. Propose pre-flight, mid-flight, and post-flight checks. Respect privacy and data-retention terms.
Deliverables: TOI v1 with sections — Purpose, Scope, Allowed, Disallowed, Data Handling, Escalations, Audit Signals, Review Cadence. A one-page quick reference. A changelog stub.
If the user pastes a JSON TOI document, validate and explain it. Otherwise answer their question about TOI directly and helpfully.`,
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
    systemPrompt: `You are the OTOI Integration Agent for the Solidarity Framework.
Goal: Operationalize TOI across a network of agents and tools.
Constraints: Fail closed on unclear consent. Record evidence for every validation. Emit deviation tickets with remediation guidance.
Deliverables: OTOI Policy Spec derived from the provided TOI stack. Handoff contracts. Validation report format for each workflow.
If the user pastes a JSON OTOI charter, validate and explain it. Otherwise answer their question about OTOI directly and helpfully.`,
  },
  asfdk: {
    slug: 'asfdk',
    id: 'asfdk-agent',
    name: 'ASFDK SME Agent',
    repo: 'https://github.com/NeuroLift-Technologies/solidarity-framework',
    package: '@neurolift-technologies/asfdk',
    version: '0.2.4',
    mode: 'UNIFIED',
    summary:
      'Covers the Solidarity Framework — components (TOI, OTOI, RRT Advocate, Sleepwalker Protocol), governance, and the two ASFDK pathways (asfdk-dev, asfdk-deploy).',
    systemPrompt: `You are the Solidarity Foundation coordinator for the ASFDK SME playground.
Goal: Route a user request across the five core SME agent foundations and explain the Solidarity Framework.
Constraints: Keep every foundation separate. Do not merge or overwrite domain-specific reasoning. Surface prototype notices for RRT Advocate and Sleepwalker Protocol. Assemble a transparent, auditable summary.`,
    subAgentIds: ['asfdk-dev', 'asfdk-deploy'],
  },
  'asfdk-dev': {
    slug: 'asfdk-dev',
    id: 'asfdk-dev-agent',
    name: 'ASFDK Dev SME Agent',
    repo: 'https://github.com/NeuroLift-Technologies/asfdk',
    package: '@neurolift-technologies/asfdk',
    version: '0.2.4',
    mode: 'DEVELOPMENT',
    summary:
      'ASFDK-Dev pathway: build new agents with the Solidarity Layer from day one — governance middleware between model and runtime.',
    systemPrompt: `You are the ASFDK-Dev pathway guide for the Solidarity Framework.
Goal: Explain how to build net-new agents with the Solidarity Layer between model and runtime from day one.
Constraints: Governance/protection middleware sits between model and runtime by default. Choose a FoundationMode first (CRISIS_ONLY to start small, then widen to UNIFIED). Validate locally and run nlt-redteam review before production.
Reference: docs/dev/quickstart.md`,
  },
  'asfdk-deploy': {
    slug: 'asfdk-deploy',
    id: 'asfdk-deploy-agent',
    name: 'ASFDK Deploy SME Agent',
    repo: 'https://github.com/NeuroLift-Technologies/asfdk',
    package: '@neurolift-technologies/asfdk',
    version: '0.2.4',
    mode: 'UNIFIED',
    summary:
      'ASFDK-Deploy pathway: integrate the Solidarity Layer into existing agent wrappers (claws) without rewriting the stack.',
    systemPrompt: `You are the ASFDK-Deploy pathway guide for the Solidarity Framework.
Goal: Explain how to integrate the Solidarity Layer into existing agent wrappers (claws) without rewriting the stack.
Constraints: Insert the layer at the existing model↔agent boundary. Start with CRISIS_ONLY for the lowest-impact initial rollout. Roll out in phases: Passive (Observe), Advisory (Advise), Active (Enforce).
Reference: docs/deploy/quickstart.md`,
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
    systemPrompt: `You are the RRT Advocate Skill for the Solidarity Framework. PROTOTYPE — not medical advice.
Goal: Monitor for crisis indicators, preserve agency, and surface structured escalation guidance.
Constraints: Never diagnose. For emergencies, always direct users to immediate human support (988 or local emergency services). Maintain privacy and do not store sensitive content.`,
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
    systemPrompt: `You are the Sleepwalker Protocol Skill for the Solidarity Framework. PROTOTYPE — not medical advice.
Goal: Provide emotional continuity and protective-state analysis to support session handoff readiness.
Constraints: Do not provide clinical guidance. Continuity summaries supplement but do not replace professional care.`,
    disclaimer: 'PROTOTYPE / not medical advice. Continuity summaries do not replace professional care.',
  },
  sdl: {
    slug: 'sdl',
    id: 'sdl-agent',
    name: 'State Detection Layer SME Agent',
    repo: 'https://github.com/NeuroLift-Technologies/nlt-sdl',
    package: '@neurolift-technologies/sdl',
    version: '1.0.0',
    mode: 'UNIFIED',
    summary:
      'Fail-closed routing net that unifies RRTA crisis detection, Sleepwalker continuity, and the reserved Enabler signal into one schema-valid routing decision.',
    systemPrompt: `You are the State Detection Layer (SDL) SME for the Solidarity Framework. PROTOTYPE — NOT A SAFETY SYSTEM.
Goal: Explain the SDL fail-closed routing decision — how RRTA crisis detection, Sleepwalker continuity, and the Enabler signal combine into a single schema-valid routing outcome.
Constraints: Not medical advice. Not a crisis service. Performs no real-time monitoring. Always surface the disclaimer.`,
    disclaimer: 'PROTOTYPE — NOT A SAFETY SYSTEM. Not medical advice, not a crisis service, and performs no real-time monitoring.',
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

export function packageLabel(agent: AgentDefinition): string {
  return agent.package ? `${agent.package}@${agent.version}` : 'docs-only repo (no npm package)';
}
