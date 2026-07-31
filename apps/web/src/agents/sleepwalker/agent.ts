import { StateDetector, type EmotionalState } from '@neurolift-technologies/sleepwalker-protocol';

export type { EmotionalState };

export interface SleepwalkerSessionInput {
  note: string;
  history?: string[];
  state?: Record<string, unknown>;
  previousSummary?: string;
}

export interface SleepwalkerRunResult {
  disclaimer: true;
  summary: string;
  emotionalState: EmotionalState;
  handoffReady: boolean;
  continuity: {
    historyCount: number;
    stateKeys: string[];
    previousSummaryPresent: boolean;
  };
}

export const SLEEPWALKER_PROTOTYPE_DISCLAIMER =
  'This prototype is not medical advice. It provides continuity and protective-state summaries only and should not be treated as clinical guidance.';

export function assessSleepwalker(input: SleepwalkerSessionInput): SleepwalkerRunResult {
  const detector = new StateDetector();
  const history = input.history ?? [];
  const emotionalState = detector.detect(input.note, history);
  const stateKeys = Object.keys(input.state ?? {});
  const previousSummaryPresent = Boolean(input.previousSummary?.trim());
  const handoffReady = Boolean(input.note.trim()) && (history.length > 0 || stateKeys.length > 0 || previousSummaryPresent);

  return {
    disclaimer: true,
    summary: `${emotionalState.stateType} state detected with ${emotionalState.protective ? 'protective' : 'non-protective'} posture. Handoff readiness is ${handoffReady ? 'ready' : 'not ready'} based on available continuity context.`,
    emotionalState,
    handoffReady,
    continuity: {
      historyCount: history.length,
      stateKeys,
      previousSummaryPresent,
    },
  };
}
