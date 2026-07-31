# Architecture Overview

`sme-agents` is a reference implementation for a multi-agent Subject Matter Expert ecosystem.

## Layered structure

- `packages/agent-core`: shared agent contracts and base functionality.
- `packages/agent-registry`: discovery, metadata validation, registration, and capability lookup.
- `packages/orchestration`: collaboration flow and transparent interaction history.
- `packages/adapters`: communication adapter interfaces and direct adapter example.
- `agents/*`: independent SME agent implementations for TOI, OTOI, ASFDK, RRT Advocate, and Sleepwalker Protocol domains.
- `apps/demo`: public educational demo application.
- `examples`: developer-facing usage examples.

## Boundary model

Each agent is responsible for only its domain interpretation. The orchestrator coordinates agents and composes responses but does not override agent-level reasoning.

## Explainability

All agents implement `explainDecision(id)` for transparent decision tracing.
