import { AgentCard } from '../../components/AgentCard';
import { listAgents } from '../../lib/agent-registry';

export default function AgentsDirectoryPage() {
  const agents = listAgents();

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '2.5rem 1rem 4rem' }}>
      <h1 style={{ marginTop: 0, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>SME agent directory</h1>
      <p style={{ color: '#cbd5e1', maxWidth: 760, lineHeight: 1.8 }}>
        Every card below links to a dedicated per-agent playground. RRT Advocate and Sleepwalker Protocol surface mandatory prototype disclaimers, and each agent keeps its own ASFDK foundation instance.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        {agents.map((agent) => (
          <AgentCard key={agent.slug} agent={agent} />
        ))}
      </div>
    </div>
  );
}
