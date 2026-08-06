import {
  BaseSMEAgent,
  type AgentMetadata,
  type AgentRequest,
  type AgentResponse
} from "../../../packages/agent-core/src/index.js";

const metadata: AgentMetadata = {
  id: "asfdk-dev-agent",
  name: "ASFDK Dev SME Agent",
  domain: "asfdk-dev",
  version: "0.2.0",
  description: "Explains the ASFDK-Dev pathway: building new agents with the Solidarity Layer from day one.",
  capabilities: ["asfdk-dev-guidance", "agent-authoring"]
};

export class ASFDKDevAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;
    const response = "The ASFDK-Dev pathway builds net-new agents with the Solidarity Layer as governance and protection middleware between model and runtime by default: [Model Provider] → [ASFDK Solidarity Layer] → [Agent Runtime] → [Tools/APIs/Actions].";
    const rationale = "ASFDK-Dev inserts the Solidarity Layer at agent construction time, so new agents start governed without retrofitting: choose a FoundationMode (e.g. CRISIS_ONLY, then widen to UNIFIED) and enable components by mode before validating with nlt-redteam.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, "Solidarity Layer", "model-to-runtime middleware"]
    });

    return { agentId: this.id, decisionId, response, rationale };
  }
}
