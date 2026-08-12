# sme-agents

`sme-agents` is the open-source Subject Matter Expert (SME) Agent ecosystem reference implementation for the Human and AI ElevAItion Foundation (HAIEF) Solidarity Framework.

## What HAIEF is

HAIEF stewards human-governed AI collaboration through the Solidarity Framework and its component ecosystem.

## What the Solidarity Framework is

The Solidarity Framework is the layer between the AI model and the agent. It connects agent collaboration back to the user's declared terms, ensuring human safety, transparency, minimal footprint, and escalation culture. It is an open ecosystem that includes TOI, OTOI, ASFDK, RRT Advocate, and Sleepwalker Protocol components.

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
│   ├── sleepwalker/
│   └── sdl/
├── docs/
├── examples/
├── tests/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

## SME agent capabilities

Each SME agent represents one Solidarity Framework concept using the definition from its source repository.

- **TOI SME Agent**: terms of interaction — the NeuroLift standard for user-controlled, neurodivergent-friendly, privacy-first AI collaboration, expressed as a small, portable, human-editable `.toi` file that states how AI systems should interact with a person.
- **OTOI SME Agent**: operational/orchestrated terms of interaction — the layer that makes TOI actionable, honoring the user's TOI across single-agent and multi-agent contexts (agents, tools, memory, handoffs, and escalation).
- **ASFDK SME Agent**: the Agent Solidarity Framework Development Kit — governance and protection middleware that sits between the model and the agent runtime, surfacing TOI, OTOI, RRT Advocate, and Sleepwalker Protocol from a single install.
- **RRT Advocate SME Agent**: real-time crisis intervention & protective layer — acute crisis detection and immediate safety protocols. Prototype; not medical advice and not a crisis service.
- **Sleepwalker Protocol SME Agent**: emotional continuity governance — governs sustained emotional safety across extended timeframes so AI systems do not "wake up" users who are emotionally sleepwalking without consent and support structures.
- **State Detection Layer SME Agent**: a conservative, fail-closed state detector that reads a turn before the host calls the model and emits a routing decision — how to respond, whether to surface human support, whether to escalate. A safety-critical routing net, not a clinical or diagnostic tool.

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
