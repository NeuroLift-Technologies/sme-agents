'use client';

import { useState } from 'react';

import { PlaygroundShell } from '../../components/PlaygroundShell';
import { ResultPanel } from '../../components/ResultPanel';
import { getAgent } from '../../lib/agent-registry';
import { SDL_AGENT_PROMPT } from './prompt';

const SDL_PROTOTYPE_DISCLAIMER =
  'PROTOTYPE — NOT A SAFETY SYSTEM. Not medical advice, not a crisis service, and performs no real-time monitoring. For emergencies, call or text 988 (US) or contact local emergency services.';

export function SdlView() {
  const agent = getAgent('sdl')!;
  const [message, setMessage] = useState('I feel really overwhelmed and not sure how safe I feel right now.');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');
  const [tone, setTone] = useState('');
  const [priorJson, setPriorJson] = useState('');
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    try {
      setError(null);
      const prior = priorJson.trim() ? (JSON.parse(priorJson) as Record<string, unknown>) : undefined;
      const response = await fetch('/api/agents/sdl', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          input: message,
          model: model.trim() || undefined,
          version: version.trim() || undefined,
          tone: tone.trim() || undefined,
          prior,
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
      summary="Run the fail-closed State Detection Layer against an observed turn and inspect the routing decision: recommended mode, response constraints, and human escalation."
      packageLabel={`${agent.package}@${agent.version}`}
      sourceRepo={agent.repo}
      disclaimer={SDL_PROTOTYPE_DISCLAIMER}
      inputArea={
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Observed turn message</label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', minHeight: 140, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>Model (optional host fact)</label>
          <input
            value={model}
            onChange={(event) => setModel(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', borderRadius: 16, padding: '0.8rem 1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>Version (optional host fact)</label>
          <input
            value={version}
            onChange={(event) => setVersion(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', borderRadius: 16, padding: '0.8rem 1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>Tone (optional host fact)</label>
          <input
            value={tone}
            onChange={(event) => setTone(event.target.value)}
            spellCheck={false}
            style={{ width: '100%', borderRadius: 16, padding: '0.8rem 1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <label style={{ display: 'block', margin: '1rem 0 0.5rem', fontWeight: 700 }}>Prior host facts (JSON, optional)</label>
          <textarea
            value={priorJson}
            onChange={(event) => setPriorJson(event.target.value)}
            spellCheck={false}
            placeholder='{"model": "previous-model", "version": "0.9.0", "tone": "flat"}'
            style={{ width: '100%', minHeight: 90, borderRadius: 16, padding: '1rem', background: '#05070d', color: '#f8fafc', border: '1px solid rgba(139, 92, 246, 0.22)' }}
          />
          <button
            onClick={run}
            style={{ marginTop: '1rem', background: '#8b5cf6', color: '#fff', border: 0, borderRadius: 999, padding: '0.8rem 1.1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Run SDL detection
          </button>
        </div>
      }
    >
      {result || error ? (
        <ResultPanel
          summary={
            typeof result === 'object' && result !== null && 'summary' in result
              ? String((result as { summary: string }).summary)
              : 'Unable to run SDL detection.'
          }
          error={error}
          data={result ?? undefined}
        />
      ) : null}
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>System prompt</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, overflowX: 'auto' }}>{SDL_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
