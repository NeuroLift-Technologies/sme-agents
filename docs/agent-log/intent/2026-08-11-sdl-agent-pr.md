## Intent Log Entry

**Date:** 2026-08-11T23:20:00Z
**Agent:** OpenCode-CTO-Orchestrator
**Session:** feat/sdl-agent
**OTOI Version:** ORG-DEV-OTOI-1.0.3
**Working repo:** NeuroLift-Technologies/sme-agents

### Action

Add the State Detection Layer (SDL) as a first-class SME agent across the full
sme-agents ecosystem: `agents/sdl` workspace agent, `apps/demo` ecosystem wiring,
`apps/web` playground (agent wrapper, prompt, view), agent registry, API route,
per-agent page, tests, and README component meanings — delivered via PR.

### Rationale

The user asked to "add the nlt-sdl" to the sme-agents repo and confirmed the full
ecosystem scope. SDL (NLT-SPEC-SDL-1.0.0) is a fail-closed routing net that unifies
RRTA, Sleepwalker, and the reserved Enabler signal behind the `DetectionResult`
contract; `@neurolift-technologies/sdl@1.0.0` is published on npm. Adding it keeps
the ecosystem consistent with the other five core agents.

### Risks

- SDL is safety-critical: the playground must surface the prototype disclaimer
  (NOT a safety system / not medical advice) and never weaken fail-closed behavior.
- Transitive deps (rrt-advocate, sleepwalker-protocol) carry server-only builtins;
  mitigated by the existing webpack/Turbopack alias pattern already used by the
  rrt/sleepwalker playgrounds.
- Package API drift between the published npm package and local nlt-sdl source;
  mitigated by building against the published package surface (`runVector`,
  `DetectionResult`, `TurnInput`).

### Alternatives Considered

1. **Workspace agent only** — rejected by user; full ecosystem requested.
2. **Web playground only** — rejected by user.
3. **Copy nlt-sdl source into sme-agents** — rejected; repo convention imports
   published `@neurolift-technologies/*` packages (see rrt/sleepwalker/toi).

### Escalation Needed

**no** — additive ecosystem change within the existing repo pattern; no architecture,
deployment, external-service, or governance decisions required.

### Outcome

**Date completed:** 2026-08-12T03:36:00Z
**Result:** SDL integrated across the full ecosystem. `npm run lint`, `npm test`
(6/6 root, 12/12 web vitest), `npm run tsc`, and `npm run build` (Next 16 Turbopack)
all pass. PR #12 opened from `feat/sdl-agent`.
**Deviations from plan:** README was additionally updated to actual component
meanings from each source repo per user follow-up. Governance records
(registration, intent, handoff) were written after the fact; this intent entry is
retroactive and acknowledges that it should have been logged before the SDL build.
