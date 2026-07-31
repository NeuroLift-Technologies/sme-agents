# Knowledge Sources

> This document maps every knowledge source used to build the five SME agent
> interfaces in `apps/web/src/agents/`. The flagship is built from the **actual
> published npm packages** and informed by **canonical documentation** from each
> framework repo.

## Published npm packages (production dependencies)

| Package | Version | Purpose |
|---------|---------|---------|
| `@neurolift-technologies/toi` | 1.0.1 | Terms of Interaction (TOI) document parsing, validation, canonicalization, signing, resolution |
| `@neurolift-technologies/otoi` | 1.2.0 | OTOI charter parsing, policy honoring, conflict detection, TOI propagation across agent meshes |
| `@neurolift-technologies/asfdk` | 0.2.0 | NeuroLift Foundation coordinator — `createFoundation()`, per-agent foundation orchestration, re-exports all four pillars |
| `@neurolift-technologies/rrt-advocate` | 0.1.1 | Crisis Detection Engine (CDE): 3-layer (keyword/sentiment/behavioral) crisis detection + assessment with YAML thresholds |
| `@neurolift-technologies/sleepwalker-protocol` | 1.0.2 | Emotional state detection, protective-state analysis, session continuity management |

## Canonical documentation sources

| Agent | Source repo | Knowledge doc path | Package version |
| --- | --- | --- | --- |
| TOI | `NeuroLift-Technologies/nlt-toi` | `toi-otoi-agents.md` | `@neurolift-technologies/toi@1.0.1` |
| OTOI | `NeuroLift-Technologies/nlt-otoi` | `toi-otoi-agents.md` | `@neurolift-technologies/otoi@1.2.0` |
| ASFDK | `NeuroLift-Technologies/solidarity-framework` | `agents/solidarity-foundation-skill.md` | `@neurolift-technologies/asfdk@0.2.0` |
| RRT Advocate | `NeuroLift-Technologies/solidarity-framework` | `agents/rrt-advocate-skill.md` | `@neurolift-technologies/rrt-advocate@0.1.1` |
| Sleepwalker Protocol | `NeuroLift-Technologies/solidarity-framework` | `agents/sleepwalker-skill.md` | `@neurolift-technologies/sleepwalker-protocol@1.0.2` |

## Additional references

- **asfdk hosting prior art**: `asfdk/packages/asfdk/hosting/` — Next.js 15 landing page,
  dark theme (`#0a0a0b` bg, violet `#8b5cf6` accent). Flagship extends this into an
  interactive playground.
- **A2A Discovery Hub**: `asfdk-agents/` — agent health monitoring, registry, dashboard patterns.
- **Vercel AI Gateway**: https://vercel.com/ai-gateway — model-backed optional responses via AI SDK v5.
- **Governance**: `solidarity-framework/NLT-DEV-OTOI.md` — org-wide contract (OTOI §4.2 commit format, PR-only workflow).
- **Plan**: `.omo/plans/sme-agents-flagship-vercel.md` — approved 2026-07-31.
- **Ledger**: `.omo/drafts/2026-07-31-flagship-ledger.md` — decision log + execution tracking.
