import { describe, expect, it } from 'vitest';

import { assessSleepwalker } from '../agents/sleepwalker/agent';

describe('Sleepwalker wrapper', () => {
  it('returns the prototype disclaimer flag and continuity shape', () => {
    const result = assessSleepwalker({
      note: 'I feel numb and need a clear follow-up plan.',
      history: ['Morning standup'],
      state: { task: 'handoff' },
    });

    expect(result.disclaimer).toBe(true);
    expect(result.emotionalState.stateType).toBeDefined();
    expect(typeof result.handoffReady).toBe('boolean');
  });
});
