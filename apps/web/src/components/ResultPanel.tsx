interface ResultPanelProps {
  summary: string;
  data?: unknown;
  error?: string | null;
}

export function ResultPanel({ summary, data, error }: ResultPanelProps) {
  return (
    <section
      style={{
        marginTop: '1rem',
        border: '1px solid rgba(139, 92, 246, 0.22)',
        borderRadius: 16,
        background: 'rgba(15, 23, 42, 0.72)',
        padding: '1rem',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '0.75rem', color: '#c4b5fd' }}>Result</h3>
      <p style={{ marginTop: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{summary}</p>
      {error ? (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            background: 'rgba(127, 29, 29, 0.32)',
            borderRadius: 12,
            padding: '0.9rem',
            overflowX: 'auto',
            color: '#fecaca',
          }}
        >
          {error}
        </pre>
      ) : null}
      {data !== undefined ? (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            background: '#05070d',
            borderRadius: 12,
            padding: '0.9rem',
            overflowX: 'auto',
            color: '#d4d4d8',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}
