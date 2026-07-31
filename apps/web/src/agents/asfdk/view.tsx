'use client';

import { useState } from 'react';

import { PlaygroundShell } from '../../components/PlaygroundShell';
import { ResultPanel } from '../../components/ResultPanel';
import { getAgent } from '../../lib/agent-registry';
import { ASFDK_AGENT_PROMPT } from './prompt';

export function AsfdkView() {
  const agent = getAgent('asfdk')!;
  const [query, setQuery] = useState('How should these five SME agents coordinate a user request about safe AI autonomy?');
  const [result, setResult] = useState<unknown>(null);

  async function run() {
    const response = await fetch('/api/agents/asfdk', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: query }),
    });

    const payload = (await response.json()) as { deterministic: unknown };
    setResult(payload.deterministic);
  }

  return (
    <PlaygroundShell
      title={agent.name}
      summary="Ask all five foundations for a transparent assembly. The coordinator preserves isolation: each response stays attached to its own foundation health snapshot and domain output."
      packageLabel={`${agent.package}@${agent.version}`}
      sourceRepo={agent.repo}
      inputArea={
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Ask all agents</label>
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', minHeight: 180, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <button
            onClick={run}
            style={{ marginTop: '1rem', background: '#8b5cf6', color: '#fff', border: 0, borderRadius: 999, padding: '0.8rem 1.1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Coordinate foundations
          </button>
        </div>
      }
    >
      {result ? (
        <ResultPanel
          summary={typeof result === 'object' && result !== null && 'summary' in result ? String((result as { summary: string }).summary) : 'ASFDK response ready.'}
          data={result}
        />
      ) : null}
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>System prompt</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto' }}>{ASFDK_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
