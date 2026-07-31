import Link from 'next/link';

import type { AgentDefinition } from '../lib/agent-registry';

export function AgentCard({ agent }: { agent: AgentDefinition }) {
  return (
    <Link
      href={`/agents/${agent.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        border: '1px solid rgba(139, 92, 246, 0.18)',
        borderRadius: 20,
        padding: '1.15rem',
        background: 'rgba(15, 23, 42, 0.74)',
        transition: 'transform 140ms ease, border-color 140ms ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start' }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '0.35rem' }}>{agent.name}</h3>
          <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6 }}>{agent.summary}</p>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            color: '#ddd6fe',
            border: '1px solid rgba(196, 181, 253, 0.35)',
            borderRadius: 999,
            padding: '0.35rem 0.7rem',
            whiteSpace: 'nowrap',
          }}
        >
          {agent.mode}
        </span>
      </div>
      <p style={{ marginBottom: 0, marginTop: '0.9rem', color: agent.disclaimer ? '#fca5a5' : '#94a3b8' }}>
        {agent.disclaimer ?? `${agent.package}@${agent.version}`}
      </p>
    </Link>
  );
}
