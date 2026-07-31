'use client';

import { useState } from 'react';

import { PlaygroundShell } from '../../components/PlaygroundShell';
import { ResultPanel } from '../../components/ResultPanel';
import { getAgent } from '../../lib/agent-registry';
import { OTOI_AGENT_PROMPT } from './prompt';

function splitDocuments(value: string): string[] {
  return value
    .split(/\n---\n/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

type Mode = 'validate' | 'honor' | 'conflicts';

const sampleCharter = `{
  "$otoi": "1.0.0",
  "$id": "123e4567-e89b-42d3-a456-426614174001",
  "identity": {
    "author": "Flagship Operator"
  },
  "agents": [
    { "id": "toi-agent", "role": "validator" },
    { "id": "rrt-agent", "role": "safety" }
  ],
  "enforcement": {
    "mode": "enforced",
    "on_conflict": "highest-tier-wins",
    "audit": true
  },
  "toi_sources": []
}`;

export function OtoiView() {
  const agent = getAgent('otoi')!;
  const [mode, setMode] = useState<Mode>('validate');
  const [charter, setCharter] = useState(sampleCharter);
  const [documents, setDocuments] = useState('');
  const [targetAgentId, setTargetAgentId] = useState('toi-agent');
  const [result, setResult] = useState<unknown>(null);

  async function run() {
    const response = await fetch('/api/agents/otoi', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        input: charter,
        mode,
        documents: splitDocuments(documents),
        targetAgentId,
      }),
    });

    const payload = (await response.json()) as { deterministic: unknown };
    setResult(payload.deterministic);
  }

  return (
    <PlaygroundShell
      title={agent.name}
      summary="Validate charters, honor TOI stacks with the real OTOI package, inspect enforcement behavior, and surface same-tier policy conflicts before execution."
      packageLabel={`${agent.package}@${agent.version}`}
      sourceRepo={agent.repo}
      inputArea={
        <div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {(['validate', 'honor', 'conflicts'] as Mode[]).map((entry) => (
              <button
                key={entry}
                onClick={() => setMode(entry)}
                style={{
                  borderRadius: 999,
                  border: entry === mode ? '1px solid #8b5cf6' : '1px solid rgba(148, 163, 184, 0.3)',
                  background: entry === mode ? 'rgba(139, 92, 246, 0.16)' : 'transparent',
                  color: '#f8fafc',
                  padding: '0.55rem 0.9rem',
                  cursor: 'pointer',
                }}
              >
                {entry}
              </button>
            ))}
          </div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>OTOI charter</label>
          <textarea
            value={charter}
            onChange={(event) => setCharter(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', minHeight: 220, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          {mode !== 'validate' ? (
            <>
              <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>
                TOI documents (separate with <code>---</code>)
              </label>
              <textarea
                value={documents}
                onChange={(event) => setDocuments(event.target.value)}
                spellCheck={false}
                placeholder="Paste TOI JSON documents here"
                style={{ width: '100%', minHeight: 180, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
              />
            </>
          ) : null}
          {mode === 'honor' ? (
            <>
              <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>Target agent id (optional propagate preview)</label>
              <input
                value={targetAgentId}
                onChange={(event) => setTargetAgentId(event.target.value)}
                style={{ width: '100%', borderRadius: 14, padding: '0.8rem 0.9rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
              />
            </>
          ) : null}
          <button
            onClick={run}
            style={{ marginTop: '1rem', background: '#8b5cf6', color: '#fff', border: 0, borderRadius: 999, padding: '0.8rem 1.1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Run OTOI analysis
          </button>
        </div>
      }
    >
      {result ? (
        <ResultPanel
          summary={typeof result === 'object' && result !== null && 'summary' in result ? String((result as { summary: string }).summary) : 'OTOI response ready.'}
          error={typeof result === 'object' && result !== null && 'errors' in result ? ((result as { errors?: string[] }).errors?.join('\n') ?? null) : null}
          data={result}
        />
      ) : null}
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>System prompt</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto' }}>{OTOI_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
