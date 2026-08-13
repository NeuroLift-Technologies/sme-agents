import {
  StateDetector,
  type EmotionalState
} from "@neurolift-technologies/sleepwalker-protocol";
import {
  BaseSMEAgent,
  type AgentMetadata,
  type AgentRequest,
  type AgentResponse
} from "../../../packages/agent-core/src/index.js";

const metadata: AgentMetadata = {
  id: "sleepwalker-agent",
  name: "Sleepwalker Protocol SME Agent",
  domain: "autonomous-continuity",
  version: "1.0.2",
  description: "Explains safe autonomous state handling and continuity concerns.",
  capabilities: ["autonomy-safety", "state-continuity", "background-execution"]
};

const SLEEPWALKER_PROTOTYPE_DISCLAIMER =
  "This prototype is not medical advice. It provides continuity and protective-state summaries only and should not be treated as clinical guidance.";

export class SleepwalkerAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;
    const detector = new StateDetector();
    const state: EmotionalState = detector.detect(request.query);

    const response = `State detection classified "${state.stateType}" (protective: ${state.protective}, requires check-in: ${state.requiresCheckIn}, confidence ${state.confidence.toFixed(2)}). ${SLEEPWALKER_PROTOTYPE_DISCLAIMER}`;
    const rationale = "Sleepwalker protocol analysis detects protective psychological states and flags continuity, guardrail, and safe background-execution concerns.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, state.stateType, `protective: ${state.protective}`]
    });

    return {
      agentId: this.id,
      decisionId,
      response,
      rationale,
      recommendations: state.requiresCheckIn
        ? ["Pause autonomous execution and offer a human check-in before continuing."]
        : ["Continue autonomous execution with continuity state preserved."]
    };
  }
}
