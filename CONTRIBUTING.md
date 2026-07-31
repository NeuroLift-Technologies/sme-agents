# Contributing to sme-agents

Thanks for contributing to the `sme-agents` ecosystem.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run checks:
   ```bash
   npm run lint
   npm test
   ```
3. Run the demo:
   ```bash
   npm run demo -- "Can an AI agent perform this action?"
   ```

## Guidelines

- Keep each SME agent focused on its own domain boundaries.
- Reuse shared interfaces from `packages/agent-core`.
- Add or update tests for behavior changes in registry/orchestration flows.
- Keep examples educational and aligned with Solidarity Framework concepts.
