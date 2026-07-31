import type { ReactNode } from 'react';

export function DisclaimerBanner({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid rgba(248, 113, 113, 0.4)',
        background: 'rgba(127, 29, 29, 0.28)',
        color: '#fecaca',
        borderRadius: 14,
        padding: '0.9rem 1rem',
        marginBottom: '1rem',
        fontSize: '0.95rem',
        lineHeight: 1.5,
      }}
    >
      <strong style={{ display: 'block', marginBottom: 6 }}>Prototype notice</strong>
      {children}
    </div>
  );
}
