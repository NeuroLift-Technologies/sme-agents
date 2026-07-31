'use client';

import { useState } from 'react';

import { PlaygroundShell } from '../../components/PlaygroundShell';
import { ResultPanel } from '../../components/ResultPanel';
import { getAgent } from '../../lib/agent-registry';
import { RRT_AGENT_PROMPT } from './prompt';

const RRT_PROTOTYPE_DISCLAIMER =
  'This prototype is not medical advice and cannot diagnose, treat, or replace emergency support. If someone may be in immediate danger, contact local emergency services or 988.';

export function RrtView() {
  const agent = getAgent('rrt')!;
  const [input, setInput] = useState('I am overwhelmed and not sure how safe I feel right now.');
  const [result, setResult] = useState<unknown>(null);

  async function run() {
    const response = await fetch('/api/agents/rrt', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    const payload = (await response.json()) as { deterministic: unknown };
    setResult(payload.deterministic);
  }

  return (
    <PlaygroundShell
      title={agent.name}
      summary="Run the prototype RRT Advocate crisis-assessment engine against free text and inspect the structured safety output that the package returns."
      packageLabel={`${agent.package}@${agent.version}`}
      sourceRepo={agent.repo}
      disclaimer={RRT_PROTOTYPE_DISCLAIMER}
      inputArea={
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Input text</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', minHeight: 180, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <button
            onClick={run}
            style={{ marginTop: '1rem', background: '#8b5cf6', color: '#fff', border: 0, borderRadius: 999, padding: '0.8rem 1.1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Assess crisis signals
          </button>
        </div>
      }
    >
      {result ? (
        <ResultPanel
          summary={typeof result === 'object' && result !== null && 'summary' in result ? String((result as { summary: string }).summary) : 'RRT response ready.'}
          data={result}
        />
      ) : null}
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>System prompt</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto' }}>{RRT_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
