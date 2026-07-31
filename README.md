# sme-agents

`sme-agents` is the open-source Subject Matter Expert (SME) Agent ecosystem reference implementation for the Human and AI ElevAItion Foundation (HAIEF) Solidarity Framework.

## What HAIEF is

HAIEF stewards human-governed AI collaboration through the Solidarity Framework and its component ecosystem.

## What the Solidarity Framework is

The Solidarity Framework is an open ecosystem that includes TOI, OTOI, ASFDK, RRT Advocate, and Sleepwalker Protocol components.

## What SME agents are

SME agents are domain-specialized AI agents. Each represents one framework concept and provides explainable, bounded expertise rather than broad general assistance.

## How this repo relates to individual agent repositories

This repository is a **reference ecosystem** and demonstration project. It does **not** replace the independent implementation repositories for each SME agent.

## Repository structure

```text
sme-agents/
├── apps/
│   └── demo/
├── packages/
│   ├── agent-core/
│   ├── agent-registry/
│   ├── orchestration/
│   └── adapters/
├── agents/
│   ├── toi/
│   ├── otoi/
│   ├── asfdk/
│   ├── rrt-advocate/
│   └── sleepwalker/
├── docs/
├── examples/
├── tests/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

## SME agent capabilities

- **TOI SME Agent**: terms of interaction and boundary validation
- **OTOI SME Agent**: operational compliance and policy enforcement
- **ASFDK SME Agent**: deployment patterns and integration guidance
- **RRT Advocate SME Agent**: rights, responsibility, transparency, escalation
- **Sleepwalker Protocol SME Agent**: autonomous continuity and background execution safety

## Core interface

```ts
interface SMEAgent {
  id: string;
  name: string;
  domain: string;
  description: string;
  capabilities: string[];
  process(request: AgentRequest): Promise<AgentResponse>;
  explainDecision(id: string): Promise<DecisionExplanation>;
}
```

## Agent registry features

- discovery and metadata listing
- registration and metadata validation
- capability lookup
- version tracking

## Orchestration behavior

The orchestration layer receives user requests, identifies relevant SME agents, coordinates responses, preserves domain boundaries, and returns transparent interaction history.

## Local development

```bash
npm install
npm run lint
npm test
npm run demo -- "Can an AI agent perform this action?"
```

## Extending the ecosystem

1. Add a new domain agent in `agents/<new-agent>/` implementing `SMEAgent`.
2. Register it in your app/orchestration assembly layer.
3. Add focused tests for registration and orchestration expectations.
