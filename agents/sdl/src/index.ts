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
    const response =
      "Every observed turn is routed through the fail-closed SDL contract, escalating toward human support rather than guessing.";
    const rationale =
      "SDL analysis unifies acute RRTA, deterministic Sleepwalker continuity, and reserved Enabler signals behind one routing decision with response constraints.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, "rrta signals", "sleepwalker continuity", "fail-closed boundary"]
    });

    return { agentId: this.id, decisionId, response, rationale };
  }
}
