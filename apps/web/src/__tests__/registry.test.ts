import { describe, expect, it } from 'vitest';

import { getAgent, listAgents } from '../lib/agent-registry';

describe('agent registry', () => {
  it('resolves all five agent slugs', () => {
    expect(listAgents().map((agent) => agent.slug)).toEqual([
      'toi',
      'otoi',
      'asfdk',
      'rrt',
      'sleepwalker',
    ]);
  });

  it('returns undefined for an unknown slug so the route layer can notFound()', () => {
    expect(getAgent('unknown-slug')).toBeUndefined();
  });
});
