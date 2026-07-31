import { describe, expect, it } from 'vitest';

import {
  honorCharter,
  inspectConflicts,
  parseCharter,
  sampleCharter,
} from '../agents/otoi/agent';
import { sampleToiDocument } from '../agents/toi/agent';

const projectToi = `{
  "$toi": "1.0.0",
  "$tier": "project",
  "$id": "123e4567-e89b-42d3-a456-426614174010",
  "identity": { "author": "Project Owner" },
  "communication": { "tone": "professional" }
}`;

const conflictingProjectToi = `{
  "$toi": "1.0.0",
  "$tier": "project",
  "$id": "123e4567-e89b-42d3-a456-426614174011",
  "identity": { "author": "Project Owner Two" },
  "communication": { "tone": "casual" }
}`;

describe('OTOI agent wrapper', () => {
  it('parses a valid charter', () => {
    expect(parseCharter(sampleCharter).agents.length).toBe(2);
  });

  it('detects same-tier conflicts', () => {
    const result = inspectConflicts([projectToi, conflictingProjectToi]);
    expect(result.conflicts?.length).toBeGreaterThanOrEqual(1);
    const paths = result.conflicts?.map((c) => c.path) ?? [];
    expect(paths).toContain('communication.tone');
  });

  it('honors TOI documents into an effective policy', async () => {
    const result = await honorCharter(sampleCharter, [projectToi, sampleToiDocument], 'toi-agent');
    expect(result.ok).toBe(true);
    expect(result.policy?.effective.$tier).toBe('personal');
    expect(result.propagated?.identity.author).toBe('Flagship User');
  });
});
