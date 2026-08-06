import { PlaygroundShell } from '../../components/PlaygroundShell';
import { getAgent, packageLabel } from '../../lib/agent-registry';
import { ASFDK_DEPLOY_AGENT_PROMPT } from './prompt';

export function AsfdkDeployView() {
  const agent = getAgent('asfdk-deploy')!;

  return (
    <PlaygroundShell
      title={agent.name}
      summary="ASFDK-Deploy pathway: integrate the Solidarity Layer into existing agent wrappers (claws) without rewriting the stack."
      packageLabel={packageLabel(agent)}
      sourceRepo={agent.repo}
      inputArea={
        <div>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginTop: 0 }}>
            ASFDK-Deploy is for teams with existing production or pre-production wrappers. The Solidarity Layer is inserted at the current model↔agent boundary:
          </p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto', color: '#d4d4d8' }}>
{`[Model Provider]
      ↓
[ASFDK Solidarity Layer]
      ↓
[Claws (Agent Wrappers)]
      ↓
[Tools/APIs/Actions]`}
          </pre>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: 0 }}>
            Map wrapper I/O to the ASFDK contract, start with CRISIS_ONLY for the lowest-impact rollout, then promote phase by phase — Passive (Observe), Advisory (Advise), Active (Enforce) — validating each phase before moving on.
          </p>
        </div>
      }
    >
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>System prompt</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto' }}>{ASFDK_DEPLOY_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
