'use client';

import { useState } from 'react';

import { PlaygroundShell } from '../../components/PlaygroundShell';
import { ResultPanel } from '../../components/ResultPanel';
import { getAgent } from '../../lib/agent-registry';
import { SLEEPWALKER_AGENT_PROMPT } from './prompt';

const SLEEPWALKER_PROTOTYPE_DISCLAIMER =
  'This prototype is not medical advice. It provides continuity and protective-state summaries only and should not be treated as clinical guidance.';

export function SleepwalkerView() {
  const agent = getAgent('sleepwalker')!;
  const [note, setNote] = useState('I feel numb after a very long day and need a clear handoff for tomorrow.');
  const [history, setHistory] = useState('Morning planning session\nMidday blocker review');
  const [stateJson, setStateJson] = useState('{\n  "currentTask": "handoff prep",\n  "energy": "low"\n}');
  const [previousSummary, setPreviousSummary] = useState('Previous session tracked an unfinished handoff and low energy.');
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    try {
      setError(null);
      const state = stateJson.trim() ? (JSON.parse(stateJson) as Record<string, unknown>) : undefined;
      const response = await fetch('/api/agents/sleepwalker', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          input: note,
          history: history.split('\n').map((entry) => entry.trim()).filter(Boolean),
          state,
          previousSummary,
        }),
      });

      const payload = (await response.json()) as { deterministic: unknown };
      setResult(payload.deterministic);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  return (
    <PlaygroundShell
      title={agent.name}
      summary="Summarize protective-state signals and continuity readiness from session context without persisting user data or claiming therapeutic capability."
      packageLabel={`${agent.package}@${agent.version}`}
      sourceRepo={agent.repo}
      disclaimer={SLEEPWALKER_PROTOTYPE_DISCLAIMER}
      inputArea={
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Session note</label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', minHeight: 120, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>Session history (one line per event)</label>
          <textarea
            value={history}
            onChange={(event) => setHistory(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', minHeight: 120, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>Structured session state JSON</label>
          <textarea
            value={stateJson}
            onChange={(event) => setStateJson(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', minHeight: 120, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>Previous summary (optional)</label>
          <textarea
            value={previousSummary}
            onChange={(event) => setPreviousSummary(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', minHeight: 100, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <button
            onClick={run}
            style={{ marginTop: '1rem', background: '#8b5cf6', color: '#fff', border: 0, borderRadius: 999, padding: '0.8rem 1.1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Assess continuity
          </button>
        </div>
      }
    >
      {result || error ? (
        <ResultPanel
          summary={
            typeof result === 'object' && result !== null && 'summary' in result
              ? String((result as { summary: string }).summary)
              : 'Unable to assess continuity.'
          }
          error={error}
          data={result ?? undefined}
        />
      ) : null}
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>System prompt</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto' }}>{SLEEPWALKER_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
