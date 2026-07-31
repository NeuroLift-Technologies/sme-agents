export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
      <p style={{ color: '#8b5cf6', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Not found
      </p>
      <h1>Unknown SME agent</h1>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
        The requested playground does not exist. Return to the directory to choose one of the five flagship SME agents.
      </p>
    </div>
  );
}
