import { describe, expect, it } from 'vitest';

import { assessRrt } from '../agents/rrt/agent';

describe('RRT wrapper', () => {
  it('returns the prototype disclaimer flag and structured assessment', async () => {
    const result = await assessRrt('I feel overwhelmed and unsafe.');
    expect(result.disclaimer).toBe(true);
    expect(result.assessment.crisisLevel).toBeDefined();
    expect(typeof result.assessment.confidenceScore).toBe('number');
  });
});
