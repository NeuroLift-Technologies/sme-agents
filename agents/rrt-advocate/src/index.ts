import {
  CrisisEngine,
  CrisisLevel,
  type CrisisAssessment
} from "@neurolift-technologies/rrt-advocate";
import {
  BaseSMEAgent,
  type AgentMetadata,
  type AgentRequest,
  type AgentResponse
} from "../../../packages/agent-core/src/index.js";

const metadata: AgentMetadata = {
  id: "rrt-advocate-agent",
  name: "RRT Advocate SME Agent",
  domain: "accountability-advocacy",
  version: "0.1.1",
  description: "Represents rights, responsibility, and transparency considerations.",
  capabilities: ["accountability-analysis", "transparency-guidance", "escalation-guidance"]
};

const RRT_PROTOTYPE_DISCLAIMER =
  "This prototype is not medical advice and cannot diagnose, treat, or replace emergency support. If someone may be in immediate danger, contact local emergency services or 988.";

function actionForLevel(level: CrisisLevel): string {
  switch (level) {
    case CrisisLevel.BLACK:
      return "Escalate to immediate human intervention now.";
    case CrisisLevel.RED:
      return "Pause task execution and prioritize urgent human safety follow-up.";
    case CrisisLevel.ORANGE:
      return "Offer support resources and flag for prompt human review.";
    case CrisisLevel.YELLOW:
      return "Keep tone gentle and offer optional check-in resources.";
    default:
      return "Continue with transparency and routine monitoring.";
  }
}

export class RRTAdvocateAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;
    const engine = new CrisisEngine(`${this.id}-${request.id}`);
    const assessment: CrisisAssessment = await engine.assess(request.query);
    const recommendedAction = actionForLevel(assessment.crisisLevel);

    const response = `Crisis level ${assessment.crisisLevel} with confidence score ${assessment.confidenceScore.toFixed(2)}. ${recommendedAction} ${RRT_PROTOTYPE_DISCLAIMER}`;
    const rationale = "RRT advocacy assesses the request through the crisis engine and maps the resulting severity level to a human-first accountability response.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, assessment.crisisLevel, assessment.recommendedInterventions.join(", ")]
    });

    return {
      agentId: this.id,
      decisionId,
      response,
      rationale,
      recommendations: [recommendedAction, ...assessment.recommendedInterventions]
    };
  }
}
