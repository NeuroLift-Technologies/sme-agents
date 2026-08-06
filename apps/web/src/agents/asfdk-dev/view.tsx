import { PlaygroundShell } from '../../components/PlaygroundShell';
import { getAgent, packageLabel } from '../../lib/agent-registry';
import { ASFDK_DEV_AGENT_PROMPT } from './prompt';

export function AsfdkDevView() {
  const agent = getAgent('asfdk-dev')!;

  return (
    <PlaygroundShell
      title={agent.name}
      summary="ASFDK-Dev pathway: build new agents with the Solidarity Layer from day one — governance and protection middleware between model and runtime."
      packageLabel={packageLabel(agent)}
      sourceRepo={agent.repo}
      inputArea={
        <div>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginTop: 0 }}>
            ASFDK-Dev is for developers creating net-new agents. The agent runtime is mediated by the Solidarity Layer by default:
          </p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto', color: '#d4d4d8' }}>
{`[Model Provider]
      ↓
[ASFDK Solidarity Layer]
      ↓
[Agent Runtime]
      ↓
[Tools/APIs/Actions]`}
          </pre>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: 0 }}>
            Start with a FoundationMode decision (e.g. CRISIS_ONLY, then widen to UNIFIED) and enable components by mode: TOI and OTOI are active in UNIFIED, FRAMEWORK_ONLY, and DEVELOPMENT; RRT Advocate in UNIFIED and CRISIS_ONLY; Sleepwalker in UNIFIED, CONTINUITY_ONLY, and DEVELOPMENT. Validate locally and run nlt-redteam review before production.
          </p>
        </div>
      }
    >
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>System prompt</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto' }}>{ASFDK_DEV_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
