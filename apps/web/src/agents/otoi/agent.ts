import type {
  EffectivePolicy,
  OtoiCharter,
  PolicyConflict,
  ToiDocument,
} from '@neurolift-technologies/otoi';
import {
  detectConflicts,
  honor,
  parseCharter,
  parseToi,
  propagate,
} from '@neurolift-technologies/otoi';

export { detectConflicts, honor, parseCharter, propagate };
export type { EffectivePolicy, OtoiCharter, PolicyConflict, ToiDocument };

export interface OtoiRunResult {
  ok: boolean;
  summary: string;
  errors?: string[];
  charter?: OtoiCharter;
  policy?: EffectivePolicy;
  conflicts?: PolicyConflict[];
  propagated?: ToiDocument;
}

export const sampleCharter = `{
  "$otoi": "1.0.0",
  "$id": "123e4567-e89b-42d3-a456-426614174001",
  "identity": {
    "author": "Flagship Operator"
  },
  "agents": [
    { "id": "toi-agent", "role": "validator" },
    { "id": "rrt-agent", "role": "safety" }
  ],
  "enforcement": {
    "mode": "enforced",
    "on_conflict": "highest-tier-wins",
    "audit": true
  },
  "toi_sources": []
}`;

function parseDocuments(inputs: string[]): ToiDocument[] {
  return inputs.filter(Boolean).map((input) => parseToi(input));
}

export function validateCharterInput(input: string): OtoiRunResult {
  try {
    const charter = parseCharter(input);
    return {
      ok: true,
      summary: `Valid OTOI charter with ${charter.agents.length} declared agent(s).`,
      charter,
    };
  } catch (error) {
    return {
      ok: false,
      summary: 'OTOI charter is invalid.',
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

export async function honorCharter(
  charterInput: string,
  toiInputs: string[],
  targetAgentId?: string,
): Promise<OtoiRunResult> {
  try {
    const charter = parseCharter(charterInput);
    const documents = parseDocuments(toiInputs);
    const policy = await honor(charter, { documents });
    const propagated = targetAgentId ? propagate(policy, targetAgentId) : undefined;

    return {
      ok: true,
      summary: `Honored ${documents.length} TOI document(s) across ${policy.agents.length} agent(s).`,
      charter,
      policy,
      conflicts: policy.conflicts,
      propagated,
    };
  } catch (error) {
    return {
      ok: false,
      summary: 'Unable to honor the supplied charter.',
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

export function inspectConflicts(toiInputs: string[]): OtoiRunResult {
  try {
    const documents = parseDocuments(toiInputs);
    const conflicts = detectConflicts(documents);

    return {
      ok: true,
      summary: conflicts.length
        ? `Detected ${conflicts.length} same-tier conflict(s).`
        : 'No same-tier conflicts detected.',
      conflicts,
    };
  } catch (error) {
    return {
      ok: false,
      summary: 'Unable to inspect conflicts.',
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}
