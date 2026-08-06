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

export class RRTAdvocateAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;
    const response = "The action should include accountable ownership, transparency disclosures, and escalation paths.";
    const rationale = "RRT advocacy prioritizes traceable responsibility and clear user-visible accountability boundaries.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, "accountability ownership", "transparency"]
    });

    return { agentId: this.id, decisionId, response, rationale };
  }
}
