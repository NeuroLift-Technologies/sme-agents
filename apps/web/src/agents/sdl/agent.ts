import {
  runVector,
  type DetectionResult,
  type TurnInput,
} from '@neurolift-technologies/sdl';

export type { DetectionResult };
export type { TurnInput };

export interface SdlRunResult {
  disclaimer: true;
  summary: string;
  detection: DetectionResult;
  escalated: boolean;
  recommendedMode: string;
  constraints: string[];
}

export const SDL_PROTOTYPE_DISCLAIMER =
  'PROTOTYPE — NOT A SAFETY SYSTEM. Not medical advice, not a crisis service, and performs no real-time monitoring. For emergencies, call or text 988 (US) or contact local emergency services.';

export async function assessSdl(input: TurnInput): Promise<SdlRunResult> {
  const detection = await runVector(input);

  let summary = `SDL routed this turn to "${detection.recommendedMode}" with fail-closed ${detection.meta.failClosed ? 'engaged' : 'clear'}. `;
  summary += `RRTA tier: ${detection.rrta.tier} (confidence ${detection.rrta.confidence.toFixed(2)}), sleepwalker vulnerable: ${detection.sleepwalker.vulnerable}.`;
  if (detection.escalateToHuman) {
    summary += ' Escalates toward human support.';
  }

  return {
    disclaimer: true,
    summary,
    detection,
    escalated: detection.escalateToHuman,
    recommendedMode: detection.recommendedMode,
    constraints: detection.responseConstraints,
  };
}
