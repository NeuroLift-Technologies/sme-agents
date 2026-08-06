import { describe, expect, it } from 'vitest';

import { analyzeToi, canonicalize, parseToi, safeParseToi, sampleToiDocument } from '../agents/toi/agent';

describe('TOI agent wrapper', () => {
  it('parses a valid document', () => {
    const parsed = safeParseToi(sampleToiDocument);
    expect(parsed.success).toBe(true);
  });

  it('returns errors for invalid input', () => {
    const result = analyzeToi('{"$toi":"1.0.0"}');
    expect(result.ok).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('canonicalize is idempotent for a valid document', () => {
    const document = parseToi(sampleToiDocument);
    const canonical = canonicalize(document);
    const recanonical = canonicalize(parseToi(canonical));
    expect(recanonical).toBe(canonical);
  });
});
