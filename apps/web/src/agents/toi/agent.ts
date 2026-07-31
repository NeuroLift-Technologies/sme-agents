import type { SafeParseResult, ToiDocument, ToiTier } from '@neurolift-technologies/toi';
import {
  canonicalize,
  compareTier,
  isToi,
  parseToi,
  resolveToi,
  safeParseToi,
  serializeToi,
  sortByPrecedence,
} from '@neurolift-technologies/toi';

export { canonicalize, compareTier, isToi, parseToi, resolveToi, safeParseToi, serializeToi };
export type { SafeParseResult, ToiDocument, ToiTier };

export interface ToiRunResult {
  ok: boolean;
  summary: string;
  errors?: string[];
  document?: ToiDocument;
  canonical?: string;
  serialized?: string;
  resolved?: ToiDocument;
  sortedTiers?: ToiTier[];
  comparisonCount: number;
}

export const sampleToiDocument = `{
  "$toi": "1.0.0",
  "$tier": "personal",
  "$id": "123e4567-e89b-42d3-a456-426614174000",
  "identity": {
    "author": "Flagship User"
  },
  "communication": {
    "tone": "direct",
    "verbosity": "concise",
    "structure": "bullet-points"
  },
  "privacy": {
    "retention": "session-only",
    "training_use": "prohibited"
  },
  "agency": {
    "action_confirmation": "always",
    "override_authority": "user-final"
  }
}`;

function extractErrors(result: SafeParseResult): string[] {
  if (result.success) {
    return [];
  }

  if ('issues' in result.error && Array.isArray(result.error.issues) && result.error.issues.length > 0) {
    return result.error.issues.map((issue) => `${issue.path || 'document'}: ${issue.message}`);
  }

  return [result.error.message];
}

export function analyzeToi(input: string, comparisonInputs: string[] = []): ToiRunResult {
  const parsed = safeParseToi(input);
  if (!parsed.success) {
    return {
      ok: false,
      summary: 'TOI document is invalid.',
      errors: extractErrors(parsed),
      comparisonCount: 0,
    };
  }

  const comparisonDocs: ToiDocument[] = [];
  const comparisonErrors: string[] = [];

  for (const comparisonInput of comparisonInputs.filter(Boolean)) {
    const comparison = safeParseToi(comparisonInput);
    if (comparison.success) {
      comparisonDocs.push(comparison.data);
    } else {
      comparisonErrors.push(...extractErrors(comparison));
    }
  }

  const document = parsed.data;
  const combined = [document, ...comparisonDocs];
  const sorted = sortByPrecedence(combined);
  const resolved = combined.length > 1 ? resolveToi(combined) : undefined;
  const canonical = canonicalize(document);
  const serialized = serializeToi(document);
  const summary = [
    `Valid TOI for ${document.identity.author}.`,
    `Tier: ${document.$tier}.`,
    comparisonDocs.length > 0
      ? `Resolved against ${comparisonDocs.length} comparison document(s).`
      : 'No comparison documents supplied.',
  ].join(' ');

  return {
    ok: comparisonErrors.length === 0,
    summary,
    errors: comparisonErrors.length > 0 ? comparisonErrors : undefined,
    document,
    canonical,
    serialized,
    resolved,
    sortedTiers: sorted.map((entry) => entry.$tier),
    comparisonCount: comparisonDocs.length,
  };
}

export function compareToiTiers(a: ToiTier, b: ToiTier): number {
  return compareTier(a, b);
}
