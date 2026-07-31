# sme-agents Flagship — Vercel OSS Program Playground

Status: APPROVED by Joshua W. Dorsey, Sr. on 2026-07-31 (brief + corrections).
Execution model: **distributed across A2A hub agents + hard phase gates** (owner-locked 2026-07-31).
Execution: separate worker session via `$start-work`. Plan mode is sticky — this file authorizes
execution ONLY when the user starts the worker session.

## 1. Objective

Turn `sme-agents` (1-PR skeleton) into the public-facing **HAIEF Solidarity Framework playground**
hosted on Vercel (Hobby tier): five SEPARATE SME agent interfaces — TOI, OTOI, ASFDK, RRT Advocate,
Sleepwalker — each built from its actual framework repo (real published package APIs + knowledge
grounded in that repo's docs), each with **ASFDK embedded** (its own `NeuroLiftFoundation` instance),
brought together at the **orchestration level only** (never merged into one foundation). Model-backed
responses optional via **Vercel AI Gateway** (AI SDK; provider = hosting platform; no third-party
lock-in). Deliver application prep for the Vercel OSS Program (window reopens August 2026):
CODE_OF_CONDUCT.md ×3 and the asfdk npm license-metadata fix.

**No single agent does it all.** Work is distributed across the A2A hub agents with Joshua
reviewing at hard phase gates.

## 2. Current Evidence (verified during planning)

- **sme-agents**: npm workspaces TS monorepo (NodeNext ESM, tsc strict). Packages: agent-core,
  agent-registry, orchestration, adapters. Agents: `agents/{toi,otoi,asfdk,rrt-advocate,sleepwalker}`
  — all stubs. `apps/demo` CLI. 2 tests. No web app, no CI, no CoC. 1 PR total.
- **Published packages (npm, publisher `neurolift-tech`)**: `@neurolift-technologies/toi@1.0.1`,
  `otoi@1.2.0`, `asfdk@0.2.0`, `rrt-advocate@0.1.1`, `sleepwalker-protocol@1.0.2`. All browser-safe
  deps (client-side use feasible).
- **toi API**: parseToi, safeParseToi, isToi, serializeToi, canonicalize, generateKeyPair, signToi,
  verifyToi, isSigned, resolveToi, sortByPrecedence, compareTier, toiSchema, toiSignatureSchema,
  TOI_TIERS, TIER_PRECEDENCE, TIER_RANK, ToiDocument, ToiSignature, ToiTier, error taxonomy.
- **otoi API**: parseCharter, honor, propagate, detectConflicts, assertToiCompatible,
  isToiCompatible, otoiCharterSchema, otoiAgentSchema, otoiSourceSchema, otoiEnforcementSchema,
  OTOI_ENFORCEMENT_MODES, OTOI_CONFLICT_STRATEGIES, OtoiCharter, OtoiAgent, EffectivePolicy,
  PolicyConflict, error taxonomy. Re-exports toi primitives.
- **asfdk API**: createFoundation(userId, mode?) / createFoundation(config), NeuroLiftFoundation,
  FoundationMode {UNIFIED, CRISIS_ONLY, CONTINUITY_ONLY, FRAMEWORK_ONLY, DEVELOPMENT},
  InteractionType, FoundationConfig, FoundationResponse, HealthCheckResult; namespaces
  `toi.*`, `otoi.*`, `rrt.*`, `sleepwalker.*` (all pillar APIs re-exported).
- **Knowledge sources**: `nlt-repos/nlt-toi/toi-otoi-agents.md` (TOI Adoption Agent spec +
  ready-to-use system prompt); `nlt-repos/nlt-otoi/toi-otoi-agents.md` (TOI + OTOI Integration Agent
  specs + system prompts); `nlt-repos/solidarity-framework/agents/*.md` skill docs
  (rrt-advocate-skill, sleepwalker-skill, nlt-otoi-skill, solidarity-foundation-skill).
- **Prior art**: `asfdk/hosting/` = Next.js 15 landing page (next 15.5.18, react 18.2.0), dark theme
  `#0a0a0f` bg, violet `#8b5cf6` accent. Style reference for the flagship.
- **Vercel**: AI Gateway (hundreds of models, one API key, no markup — user-shared,
  vercel.com/ai-gateway); OSS Program $3,600 credits/12 mo, applications reopen August, **CoC
  required per repo**. Hobby = free non-commercial.
- **A2A hub** (localhost:3001, healthy): mistral-vibe-technical-assurance = verification gate
  (skills: technical-review, code-quality, security-analysis, governance-compliance,
  testing-verification); asfdk-harness = governance; opencode-cto-orchestrator = coordinator;
  poolside-agent + github-copilot-cli = third-party (authorization for repo work UNCONFIRMED —
  verify at Gate 0; fallback to execution worker if unavailable).
- **Governance**: OTOI PR-only (no push to main), `[AGENT_NAME] type(scope): description` commits,
  agent registration at session start, handoff to repo `agent-logs/`.
- **CoC gaps**: missing in rrt-advocate, sleepwalker, sme-agents. **asfdk license mismatch**: npm
  metadata MIT vs repo Apache-2.0.

## 3. Execution Model — Distributed + Phase-Gated (owner-locked)

**Model**: No single agent runs the whole build. The plan executes through a task-distribution
matrix across A2A hub agents (localhost:3001), coordinated by the OpenCode CTO Orchestrator role,
with **hard phase gates** at which Joshua reviews and explicitly signs off before any next phase
starts. Any agent unreachable or unauthorized at execution start has its tasks fall back to the
execution worker (never silently blocks a phase — fallback or escalate, then record it).

### 3.1 Task distribution matrix

| Work item | Owning agent | Mode | A2A handoff |
|---|---|---|---|
| Verification of every phase output (technical-review, code-quality, security-analysis, governance-compliance, testing-verification) | mistral-vibe-technical-assurance | verify/review | Task card via hub → review receipt |
| Governance enforcement (OTOI checks, commit format, registration, receipts) | asfdk-harness | govern | Via hub; harness tools already govern |
| CoC PR authorship ×3 (sme-agents, rrt-advocate, sleepwalker) | execution worker (poolside-agent if authorized at Gate 0) | implement | Task card per repo → PR → Mistral Vibe review → **Gate A** |
| asfdk license metadata fix PR | execution worker | implement | PR → Mistral Vibe review → **Gate B** (Joshua approval + credentials for publish) |
| apps/web build — 5 agent modules, orchestration, AI Gateway layer | execution worker (+ poolside-agent for parallel modules IF authorized; else worker only) | implement | Per-module task cards → worker integrates → Mistral Vibe review → **Gate C** |
| Vercel project creation + deploys | Joshua + worker | deploy | Worker prepares everything; Joshua signs off at **Gate E** |

### 3.2 Phase gates (hard stops — no next phase without Joshua's explicit go)

- **Gate 0** (after Todo 0): Joshua confirms A2A agent availability/authorization (esp.
  poolside-agent) + active-threads update visible.
- **Gate A** (after Phase 1 CoC PRs): Joshua reviews the 3 PRs before merge.
- **Gate B** (asfdk publish): Joshua approval + credentials (already an escalation point).
- **Gate C** (after Phase 2 build): Joshua reviews the running app (dev-server demo) before
  verification phase.
- **Gate D** (after Phase 3): Joshua reviews Mistral Vibe findings + resolutions before merge.
- **Gate E** (Phase 4): Joshua sign-off for Vercel project creation and production deploy.

### 3.3 Handoff mechanism (per OTOI delegation format)

Every task card carries: principal (Joshua W. Dorsey, Sr.), delegating agent, receiving agent,
task, scope, allowed actions, denied actions, approval_required, receipt_required, escalation
triggers. Every completed card produces a receipt logged to the ledger +
`sme-agents/agent-logs/`.

## 4. Execution Todo 0 — Session Setup (worker, first actions)

> **Parallel-start note (owner-locked 2026-07-31):** Joshua will start all 4 A2A agents
> somewhat simultaneously. Everything in Todo 0 MUST be idempotent and claim-based:
> - The active-threads update and session registration happen exactly once — first agent to
>   arrive does them, others check and skip. Never duplicate entries or registrations.
> - The plan file already exists in the repo — agents READ it, never rewrite it.
> - Claim lanes in the ledger (append-only `## [timestamp] Claim: <agent> — <task card>`
>   lines) before starting a work item, to prevent duplicate work.

1. **Update active threads** — append the `sme-agents Flagship` thread to
   `/home/joshd/Desktop/asfdk-agents/active-threads.md` (content below; exact text prepared during
   planning, blocked from direct write by plan mode). **Idempotent**: first check whether
   `## Thread: sme-agents Flagship (Vercel OSS Program)` already exists — if yes, skip; if no,
   append the exact block below.
2. Register session (nlt-agent-registration) in sme-agents. **Idempotent**: skip if a
   registration for this session already exists.
3. `git checkout -b feat/flagship-vercel` in sme-agents. **Idempotent**: if branch exists,
   check it out; do not create duplicates.
4. Verify npm auth (`npm whoami` → must be `neurolift-tech`; else stop and escalate).
5. Ping A2A hub agents (localhost:3001): confirm mistral-vibe + poolside reachable; confirm
   poolside authorization for repo work. Record availability in ledger. → **GATE 0**.

### Exact active-threads.md content to append

```markdown
---

## Thread: sme-agents Flagship (Vercel OSS Program)

- **Opened**: 2026-07-31
- **Agents**: OpenCode CTO Orchestrator (coordinator/plan), Mistral Vibe Technical Assurance (verification gate), ASFDK Harness (governance), Poolside (pending authorization)
- **Objective**: Turn `sme-agents` from skeleton into the public-facing HAIEF Solidarity Framework playground, hosted on Vercel — 5 separate SME agent interfaces (TOI, OTOI, ASFDK, RRT Advocate, Sleepwalker), each built from its actual framework repo with ASFDK embedded; model-backed responses via Vercel AI Gateway; application prep for Vercel OSS Program (window reopens August 2026)
- **Status**: 🔵 PLANNED — plan approved by Joshua 2026-07-31; execution = distributed across A2A agents + hard phase gates; plan file at `nlt-repos/sme-agents/.omo/plans/sme-agents-flagship-vercel.md`
- **Application slate** (7 repos): solidarity-framework, asfdk, nlt-toi, nlt-otoi, rrt-advocate, sleepwalker, sme-agents

### Key Decisions (owner-locked)
- Each SME agent is its **own separate interface** (own embedded ASFDK instance, own surfaced view); ASFDK coordinates them at the orchestration level only — never merged into one foundation
- Each agent is built from its actual repo: real package imports (`toi`, `otoi`, `asfdk`, `rrt-advocate`, `sleepwalker-protocol`) + knowledge from repo docs (e.g. `toi-otoi-agents.md` system prompts in nlt-toi/nlt-otoi)
- Model layer optional via Vercel AI SDK + AI Gateway (provider = hosting platform, no third-party lock-in); deterministic framework checks remain the correctness layer
- **Execution: distributed across A2A agents + hard phase gates (Gates 0/A/B/C/D/E) — no single agent does it all; Joshua signs off at every gate**
- Scope: flagship web app + application prep (CODE_OF_CONDUCT ×3: sme-agents, rrt-advocate, sleepwalker; fix asfdk npm license metadata MIT → Apache-2.0)
- Safety: RRT/Sleepwalker are PROTOTYPE/not-medical-advice — visible disclaimers mandatory

### Escalation Points
- asfdk npm publish (needs neurolift-tech credentials + Joshua approval)
- Vercel project creation / production deploy sign-off
- Any governed-repo changes (rrt-advocate, sleepwalker, nlt-toi, nlt-otoi, asfdk) → PR-only workflow + Mistral Vibe review

### Verification Gate
- Mistral Vibe Technical Assurance (A2A hub localhost:3001): technical-review, code-quality, security-analysis, governance-compliance, testing-verification

### Handoff Notes
- Execution NOT started — plan mode sticky; Joshua starts worker session via `$start-work`
- See ledger: `nlt-repos/sme-agents/.omo/drafts/2026-07-31-flagship-ledger.md`
```

## 5. Phase 1 — Application Prep PRs (3 repos, OTOI PR-only workflow)

### 5.1 CODE_OF_CONDUCT.md (sme-agents, rrt-advocate, sleepwalker)
- Source for house text: `solidarity-framework/CODE_OF_CONDUCT.md` (check existence first; if
  absent, use `asfdk/CODE_OF_CONDUCT.md`; if both absent, Contributor Covenant v2.1 with
  NeuroLift Technologies as contact, email placeholder `conduct@neurolift.tech` — escalate to
  Joshua for the real contact before finalizing).
- One feature branch + PR per repo. Commit format:
  `[OPENCODE-CTO-ORCHESTRATOR] docs(sme-agents): add code of conduct` (same pattern for the other
  two repos).
- Each PR → Mistral Vibe governance-compliance review → **GATE A** (Joshua reviews before merge).

### 5.2 asfdk npm license metadata fix (FLAGGED — needs Joshua approval + publish access)
- Edit `asfdk/packages/asfdk/package.json`: `"license": "Apache-2.0"` (repo is Apache-2.0; npm
  metadata incorrectly MIT).
- PR via feature branch → Mistral Vibe review → **GATE B** (Joshua approval). After merge,
  `npm publish` from the package dir — requires Joshua approval + `npm whoami` = neurolift-tech.
- Bump patch: `0.2.0 → 0.2.1`. `npm pack` + local smoke test BEFORE publish.

## 6. Phase 2 — Flagship Web App (`sme-agents/apps/web`)

### 6.1 Workspace wiring
- Add `apps/web` to root `package.json` workspaces.
- Dependencies (pinned): next@^15.5.18, react@^18.2.0, react-dom@^18.2.0, typescript,
  @neurolift-technologies/toi@1.0.1, @neurolift-technologies/otoi@1.2.0,
  @neurolift-technologies/asfdk@0.2.0, @neurolift-technologies/rrt-advocate@0.1.1,
  @neurolift-technologies/sleepwalker-protocol@1.0.2. Optional model layer (installed but inert
  without env key): `ai` (AI SDK v7), `@ai-sdk/openai-compatible`.
- Import the **published packages** (not workspace TS) — avoids transpilePackages fragility;
  the packages ARE the repos' runtime. Knowledge (system prompts) comes from repo docs (6.4).
- Scripts: `dev`, `build`, `start`, `lint`, `test` (vitest).

### 6.2 File tree (decision-complete)

```
apps/web/
  package.json
  tsconfig.json
  next.config.ts            # output default; transpilePackages: []
  vitest.config.ts
  .env.example              # AI_GATEWAY_API_KEY= (never commit .env; gitignore it)
  src/
    app/
      layout.tsx            # dark theme #0a0a0f, violet #8b5cf6 accent, gov footer
      page.tsx              # landing: hero + 5-agent directory cards
      agents/page.tsx       # directory: all 5 agents, separate interfaces
      agents/[slug]/page.tsx# per-agent playground route
      api/
        agents/[slug]/route.ts   # POST: deterministic check + optional model reply
        health/route.ts          # GET: returns app + framework version info
    lib/
      agent-registry.ts     # slug → {id, name, repo, package, mode, summary}
      foundation.ts         # createFoundation per agent (each its OWN instance)
    agents/
      toi/agent.ts          # parseToi/safeParseToi/isToi/serializeToi/canonicalize/resolveToi
      toi/prompt.ts         # system prompt (adapted from nlt-toi/toi-otoi-agents.md)
      toi/view.tsx          # interface: paste/validate TOI doc, tier display, canonical output
      otoi/agent.ts         # parseCharter/honor/propagate/detectConflicts
      otoi/prompt.ts        # from nlt-otoi/toi-otoi-agents.md (OTOI Integration Agent)
      otoi/view.tsx         # interface: charter editor/validator, enforcement modes, conflict view
      asfdk/agent.ts        # coordinator: routes interaction across all 5 foundations (its own UNIFIED foundation)
      asfdk/prompt.ts       # from solidarity-framework/agents/solidarity-foundation-skill.md
      asfdk/view.tsx        # interface: "ask all agents" — per-agent responses + assembly
      rrt/agent.ts          # rrt-advocate package calls (crisis detection) + PROTOTYPE disclaimer
      rrt/prompt.ts         # from solidarity-framework/agents/rrt-advocate-skill.md
      rrt/view.tsx          # interface: text input → RRT assessment (crisis-aware routing)
      sleepwalker/agent.ts  # sleepwalker-protocol calls (continuity/state checks) + disclaimer
      sleepwalker/prompt.ts # from solidarity-framework/agents/sleepwalker-skill.md
      sleepwalker/view.tsx  # interface: session state → continuity summary/handoff readiness
    components/             # shared: AgentCard, PlaygroundShell, DisclaimerBanner, ResultPanel
```

### 6.3 Agent design (each = own interface, own foundation, separate)
- **TOI agent**: system prompt from `toi-otoi-agents.md` (default-deny, plain-language summary,
  TOI v1 sections). Deterministic core: visitor pastes a TOI document → `safeParseToi` →
  errors surfaced plainly; `parseToi` + `canonicalize` → canonical form; `resolveToi`/tier display
  via TOI_TIERS/TIER_PRECEDENCE. Optionally model-drafted plain-language summary via AI Gateway.
- **OTOI agent**: prompt from nlt-otoi spec (fail-closed, handoff contracts). Deterministic core:
  charter editor → `parseCharter` validation; `honor`/`propagate` on a sample policy;
  `detectConflicts` between two charters with OTOI_CONFLICT_STRATEGIES explained.
- **RRT Advocate agent**: package call on visitor text (crisis detection). **Mandatory visible
  disclaimer**: PROTOTYPE — not medical advice; if crisis content detected, present calm,
  escalation-focused response with care resources (never diagnose). No medical claims anywhere.
- **Sleepwalker agent**: package call for continuity/transition checks. **Mandatory disclaimer**.
- **ASFDK agent (coordinator)**: its interface is the "bring them all together" surface — a
  question is routed to all five separate foundations (each its own instance), and the ASFDK
  agent assembles the coordinated response. Demonstrates orchestration without merging.
- Model layer (optional): when `AI_GATEWAY_API_KEY` env is present, agent routes can append a
  model-generated response via AI SDK (`@ai-sdk/openai-compatible` pointed at AI Gateway base
  URL); otherwise the app is fully functional deterministic-only. Key = Vercel env secret only,
  never in VCS (`.env.example` documents it; `.gitignore` excludes `.env*` except example).
- 404 → `notFound()` for unknown slugs. All agent routes share one typed POST handler.

### 6.4 Knowledge grounding (satisfies "built from the actual repos")
- `apps/web/agents/*/prompt.ts` headers attribute source repo + doc path (e.g.
  `nlt-toi/toi-otoi-agents.md`). Add `apps/web/KNOWLEDGE-SOURCES.md` mapping each agent →
  repo → doc → package version. README links each agent card to its source repo.

### 6.5 Tests (vitest, existing 2 tests must keep passing)
- toi: valid doc parses; invalid doc → structured errors; canonicalize idempotent.
- otoi: charter parse; detectConflicts finds known conflict; honor returns EffectivePolicy.
- rrt/sleepwalker: wrapper returns PROTOTYPE disclaimer flag + expected shape.
- registry: all 5 slugs resolve; unknown slug → notFound path.

### 6.6 Distribution of the build
- Execution worker builds the shared shell (workspace wiring, layout, registry, components,
  API route, health).
- One agent module per task card: toi, otoi, asfdk, rrt, sleepwalker (worker executes; if
  poolside-agent is authorized at Gate 0, up to 3 modules are handed to it as parallel task
  cards with the exact module spec above; worker integrates and tests).
- Worker integrates → runs full test suite → Mistral Vibe technical-review + code-quality →
  **GATE C**.

## 7. Phase 3 — Verification Gate (Mistral Vibe Technical Assurance via A2A)

1. `npm run build` (root + apps/web) — must pass.
2. `npx tsc --noEmit` (web) — clean.
3. `npm test` — all pass (existing 2 + new).
4. `npm run lint` — clean.
5. Manual: `npm run dev` → visit `/` and all 5 `/agents/[slug]`; disclaimers visible on
   rrt/sleepwalker; no console errors.
6. **Mistral Vibe review** (A2A hub localhost:3001): send the diff/plan for
   technical-review, code-quality, security-analysis (esp. env-secret handling),
   governance-compliance (OTOI, commit format, handoffs), testing-verification. Address findings
   before merge. → **GATE D** (Joshua reviews findings + resolutions).
7. Grep check: `AI_GATEWAY_API_KEY` appears only in `.env.example`, env-config, and route
   reading `process.env` — zero hardcoded values.

## 8. Phase 4 — Vercel Deployment (escalation-gated)

1. `vercel login` or web-console link — requires Joshua if no auth available (escalation).
2. `vercel link` in apps/web (project name suggestion: `sme-agents-flagship`).
3. Add env var `AI_GATEWAY_API_KEY` in Vercel dashboard (or `vercel env add`) — secret only.
4. `vercel deploy --preview` → verify; then **GATE E: Joshua sign-off for production deploy**.
5. Feature branch → PR → OTOI review → merge to main. Verify Vercel auto-deploy on main.

## 9. Out of Scope

- Vercel OSS Program **submission** (August, Joshua's action — plan only prepares artifacts).
- VibeVoice, haief, awesome-copilot, antigravity-sdk-python, Copilot auth, Openwork MCP.
- Changes to solidarity-framework content or docs repo.
- Any npm publish beyond the asfdk license-metadata fix.
- Third-party LLM providers (AI Gateway is the only model path; deterministic-only mode is the
  default-correct behavior).

## 10. Risks

- asfdk publish / Vercel creation / prod deploy → blocked on Joshua credentials (escalation points, not failures).
- poolside-agent authorization UNCONFIRMED → verified at Gate 0; fallback to worker; never blocks.
- Prototype packages public → disclaimers hard-gated (tests assert disclaimer flag).
- AI Gateway key leak → env-secret-only + grep verification; rotation = dashboard action.
- Governed-repo CoC PRs → PR-only + Mistral Vibe review; no push to main.
- Client-side package compatibility → pinned versions, build + dev-server verification.

## 11. Approval Requirements (execution-time)

- Already granted: this plan (2026-07-31, Joshua) including the distributed + phase-gated model.
- Still required at execution, per gate: Gate 0 agent authorization (Joshua), Gate A PR merges
  (Joshua), Gate B asfdk publish (Joshua + credentials), Gate C app demo (Joshua), Gate D
  findings sign-off (Joshua), Gate E Vercel creation + prod deploy (Joshua). Worker stops and
  escalates at every gate — no autonomous phase advancement.

## 12. Rollback

- Any PR: revert commit / close PR — nothing ships to main without OTOI review + Joshua gate.
- Vercel: redeploy previous deployment (dashboard one-click); nothing breaks on Hobby.
- asfdk publish: if 0.2.1 misbehaves, unpublish requires npm support — mitigate by
  `npm pack` + local smoke test BEFORE publish; escalate on any doubt.

## 13. Receipt / Handoff Requirements

- Per-task-card receipts (OTOI delegation format) from every A2A handoff → ledger + agent-logs.
- Handoff record (OTOI Section 5) to `sme-agents/agent-logs/handoff-2026-07-31-*.json` +
  `log.md` entry, listing files changed, tests run, escalations, decisions, gate outcomes.
- Update `asfdk-agents/active-threads.md` status per gate (IN PROGRESS → COMPLETED with results).
- Mistral Vibe review receipts attached to each PR and the final PR.
- Ledger closed: `sme-agents/.omo/drafts/2026-07-31-flagship-ledger.md` gets final status line.
