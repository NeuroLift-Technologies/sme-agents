import { runVector } from "@neurolift-technologies/sdl";
import {
  BaseSMEAgent,
  type AgentMetadata,
  type AgentRequest,
  type AgentResponse
} from "../../../packages/agent-core/src/index.js";

const metadata: AgentMetadata = {
  id: "sdl-agent",
  name: "State Detection Layer SME Agent",
  domain: "state-detection",
  version: "1.0.0",
  description:
    "Routes each observed turn through the fail-closed SDL contract, unifying RRTA crisis detection, Sleepwalker continuity, and the reserved Enabler signal behind one routing decision.",
  capabilities: ["crisis-detection", "continuity-detection", "fail-closed-routing", "human-escalation"]
};

export class SdlAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;
    const detection = await runVector({ message: request.query });

    const response = `SDL routed this turn to "${detection.recommendedMode}" (RRTA tier ${detection.rrta.tier}, sleepwalker vulnerable: ${detection.sleepwalker.vulnerable}) with fail-closed ${detection.meta.failClosed ? "engaged" : "clear"}. ${
      detection.escalateToHuman ? "Escalates toward human support." : ""
    }`;
    const rationale =
      "SDL unifies acute RRTA, deterministic Sleepwalker continuity, and reserved Enabler signals behind the DetectionResult contract.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, detection.recommendedMode, ...detection.responseConstraints]
    });

    return {
      agentId: this.id,
      decisionId,
      response,
      rationale,
      recommendations: detection.responseConstraints
    };
  }
}
