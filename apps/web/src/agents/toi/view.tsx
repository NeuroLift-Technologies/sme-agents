'use client';

import { useState } from 'react';

import { PlaygroundShell } from '../../components/PlaygroundShell';
import { ResultPanel } from '../../components/ResultPanel';
import { getAgent } from '../../lib/agent-registry';
import { TOI_AGENT_PROMPT } from './prompt';

function splitDocuments(value: string): string[] {
  return value
    .split(/\n---\n/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const sampleToiDocument = `{
  "$toi": "1.0.0",
  "$tier": "personal",
  "$id": "123e4567-e89b-42d3-a456-426614174000",
  "identity": {
    "author": "Flagship User"
  },
  "communication": {
    "tone": "direct",
    "verbosity": "concise",
    "structure": "bullet-points"
  },
  "privacy": {
    "retention": "session-only",
    "training_use": "prohibited"
  }
}`;

export function ToiView() {
  const agent = getAgent('toi')!;
  const [input, setInput] = useState(sampleToiDocument);
  const [comparisons, setComparisons] = useState('');
  const [result, setResult] = useState<unknown>(null);

  async function run() {
    const response = await fetch('/api/agents/toi', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        input,
        compareTo: splitDocuments(comparisons),
      }),
    });

    const payload = (await response.json()) as { deterministic: unknown };
    setResult(payload.deterministic);
  }

  return (
    <PlaygroundShell
      title={agent.name}
      summary="Paste a TOI document, validate it deterministically, inspect the canonical RFC 8785 representation, and optionally resolve it against lower-priority comparison documents."
      packageLabel={`${agent.package}@${agent.version}`}
      sourceRepo={agent.repo}
      inputArea={
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>TOI document</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', minHeight: 260, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>
            Comparison TOI documents (optional, separate with <code>---</code>)
          </label>
          <textarea
            value={comparisons}
            onChange={(event) => setComparisons(event.target.value)}
            spellCheck={false}
            placeholder="Paste comparison TOI JSON documents here"
            style={{ width: '100%', minHeight: 140, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <button
            onClick={run}
            style={{ marginTop: '1rem', background: '#8b5cf6', color: '#fff', border: 0, borderRadius: 999, padding: '0.8rem 1.1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Validate TOI
          </button>
        </div>
      }
    >
      {result ? (
        <ResultPanel
          summary={typeof result === 'object' && result !== null && 'summary' in result ? String((result as { summary: string }).summary) : 'TOI response ready.'}
          error={typeof result === 'object' && result !== null && 'errors' in result ? ((result as { errors?: string[] }).errors?.join('\n') ?? null) : null}
          data={result}
        />
      ) : null}
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>System prompt</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto' }}>{TOI_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
