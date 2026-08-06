import Link from 'next/link';

import { AgentCard } from '../components/AgentCard';
import { listAgents } from '../lib/agent-registry';

export default function HomePage() {
  const agents = listAgents();

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '3rem 1rem 4rem' }}>
      <section style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#8b5cf6', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Flagship project
        </p>
        <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 4.8rem)', margin: '0.35rem 0 1rem' }}>
          Five core SME agents plus two ASFDK sub-agents, one flagship playground.
        </h1>
        <p style={{ maxWidth: 760, color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.05rem' }}>
          Explore deterministic TOI, OTOI, ASFDK, RRT Advocate, and Sleepwalker Protocol interfaces with separate foundations, transparent outputs, and optional AI Gateway augmentation. The ASFDK agent covers the Solidarity Framework and delegates to its asfdk-dev and asfdk-deploy sub-agents.
        </p>
        <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Link
            href="/agents"
            style={{
              background: '#8b5cf6',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 999,
              padding: '0.8rem 1.1rem',
              fontWeight: 700,
            }}
          >
            Browse agent directory
          </Link>
          <a
            href="/api/health"
            style={{
              border: '1px solid rgba(196, 181, 253, 0.35)',
              color: '#ddd6fe',
              textDecoration: 'none',
              borderRadius: 999,
              padding: '0.8rem 1.1rem',
              fontWeight: 700,
            }}
          >
            Inspect health payload
          </a>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '1rem' }}>Agent directory</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {agents.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </section>
    </div>
  );
}
