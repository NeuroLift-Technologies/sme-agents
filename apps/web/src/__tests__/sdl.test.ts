import { describe, expect, it } from 'vitest';

import { assessSdl } from '../agents/sdl/agent';

describe('SDL wrapper', () => {
  it('returns the prototype disclaimer flag and a schema-valid routing shape', async () => {
    const result = await assessSdl({ message: 'I feel completely overwhelmed and unsure what to do.' });

    expect(result.disclaimer).toBe(true);
    expect(result.detection.recommendedMode).toBeDefined();
    expect(Array.isArray(result.detection.responseConstraints)).toBe(true);
    expect(typeof result.detection.escalateToHuman).toBe('boolean');
    expect(result.detection.meta.schemaVersion).toBe('1.0.0');
  });
});
