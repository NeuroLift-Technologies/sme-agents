import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'SME Agents Flagship Playground',
  description: 'Next.js 15 playground for the NeuroLift Technologies flagship SME agents.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#0a0a0f',
          color: '#f8fafc',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <header
            style={{
              borderBottom: '1px solid rgba(139, 92, 246, 0.16)',
              position: 'sticky',
              top: 0,
              backdropFilter: 'blur(14px)',
              background: 'rgba(10, 10, 15, 0.88)',
              zIndex: 10,
            }}
          >
            <nav
              style={{
                maxWidth: 1080,
                margin: '0 auto',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Link href="/" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 700 }}>
                SME Agents
              </Link>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.95rem' }}>
                <Link href="/agents" style={{ color: '#c4b5fd', textDecoration: 'none' }}>
                  Agent directory
                </Link>
                <a href="/api/health" style={{ color: '#c4b5fd', textDecoration: 'none' }}>
                  Health API
                </a>
              </div>
            </nav>
          </header>
          <main style={{ flex: 1 }}>{children}</main>
          <footer
            style={{
              borderTop: '1px solid rgba(139, 92, 246, 0.16)',
              color: '#94a3b8',
            }}
          >
            <div style={{ maxWidth: 1080, margin: '0 auto', padding: '1.25rem 1rem 2rem' }}>
              Governed by the Solidarity Framework · HAIEF · NeuroLift Technologies · Final authority: Joshua W. Dorsey, Sr.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
