import type { ReactNode } from 'react';

import { DisclaimerBanner } from './DisclaimerBanner';

interface PlaygroundShellProps {
  title: string;
  summary: string;
  packageLabel: string;
  sourceRepo: string;
  disclaimer?: string;
  inputArea: ReactNode;
  children?: ReactNode;
}

export function PlaygroundShell({
  title,
  summary,
  packageLabel,
  sourceRepo,
  disclaimer,
  inputArea,
  children,
}: PlaygroundShellProps) {
  return (
    <section
      style={{
        maxWidth: 980,
        margin: '0 auto',
        padding: '2rem 1rem 4rem',
      }}
    >
      <div
        style={{
          border: '1px solid rgba(139, 92, 246, 0.22)',
          background: 'rgba(15, 23, 42, 0.62)',
          borderRadius: 24,
          padding: '1.5rem',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.22)',
        }}
      >
        <p style={{ color: '#8b5cf6', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          SME Playground
        </p>
        <h1 style={{ margin: '0.2rem 0 0.75rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{title}</h1>
        <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginTop: 0 }}>{summary}</p>
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
          Package: <code>{packageLabel}</code> · Source: <a href={sourceRepo} style={{ color: '#c4b5fd' }}>{sourceRepo}</a>
        </p>
        {disclaimer ? <DisclaimerBanner>{disclaimer}</DisclaimerBanner> : null}
        {inputArea}
        {children}
      </div>
    </section>
  );
}
