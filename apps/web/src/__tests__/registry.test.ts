import { describe, expect, it } from 'vitest';

import { getAgent, listAgents } from '../lib/agent-registry';

describe('agent registry', () => {
  it('resolves all seven agent slugs (five core plus two ASFDK sub-agents)', () => {
    expect(listAgents().map((agent) => agent.slug)).toEqual([
      'toi',
      'otoi',
      'asfdk',
      'asfdk-dev',
      'asfdk-deploy',
      'rrt',
      'sleepwalker',
    ]);
  });

  it('exposes sub-agent ids on the ASFDK parent definition', () => {
    expect(getAgent('asfdk')?.subAgentIds).toEqual(['asfdk-dev', 'asfdk-deploy']);
  });

  it('returns undefined for an unknown slug so the route layer can notFound()', () => {
    expect(getAgent('unknown-slug')).toBeUndefined();
  });
});
