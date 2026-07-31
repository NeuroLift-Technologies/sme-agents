import {
  BaseSMEAgent,
  type AgentMetadata,
  type AgentRequest,
  type AgentResponse
} from "../../../packages/agent-core/src/index.js";

const metadata: AgentMetadata = {
  id: "toi-agent",
  name: "TOI SME Agent",
  domain: "interaction-contracts",
  version: "1.0.0",
  description: "Explains and validates terms of interaction boundaries.",
  capabilities: ["toi-validation", "interaction-analysis"]
};

export class TOIAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;
    const response = "The requested action must comply with explicit interaction terms and user-agent boundaries.";
    const rationale = "TOI focuses on contract clarity, expectations, and consent boundaries before action execution.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, "interaction terms", "boundary validation"]
    });

    return { agentId: this.id, decisionId, response, rationale };
  }
}
