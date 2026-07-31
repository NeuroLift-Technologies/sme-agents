import { CrisisEngine, CrisisLevel, type CrisisAssessment } from '@neurolift-technologies/rrt-advocate';

export { CrisisLevel };
export type { CrisisAssessment };

export interface RrtRunResult {
  disclaimer: true;
  summary: string;
  assessment: CrisisAssessment;
  recommendedAction: string;
  resources: string[];
}

export const RRT_PROTOTYPE_DISCLAIMER =
  'This prototype is not medical advice and cannot diagnose, treat, or replace emergency support. If someone may be in immediate danger, contact local emergency services or 988.';

function actionForLevel(level: CrisisLevel): string {
  switch (level) {
    case CrisisLevel.BLACK:
      return 'Escalate to immediate human intervention now.';
    case CrisisLevel.RED:
      return 'Pause task execution and prioritize urgent human safety follow-up.';
    case CrisisLevel.ORANGE:
      return 'Offer support resources and flag for prompt human review.';
    case CrisisLevel.YELLOW:
      return 'Keep tone gentle and offer optional check-in resources.';
    default:
      return 'Continue with transparency and routine monitoring.';
  }
}

export async function assessRrt(input: string, userId = 'apps-web-rrt'): Promise<RrtRunResult> {
  const assessment = await new CrisisEngine(userId).assess(input);
  const recommendedAction = actionForLevel(assessment.crisisLevel);

  return {
    disclaimer: true,
    summary: `Crisis level ${assessment.crisisLevel} with confidence score ${assessment.confidenceScore.toFixed(2)}. ${recommendedAction}`,
    assessment,
    recommendedAction,
    resources: ['988 Suicide & Crisis Lifeline', 'Local emergency services', 'Trusted human support'],
  };
}
