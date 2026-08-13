import {
  detectConflicts,
  honor,
  parseCharter,
  propagate,
  type EffectivePolicy,
  type OtoiCharter,
  type PolicyConflict
} from "@neurolift-technologies/otoi";
import {
  BaseSMEAgent,
  type AgentMetadata,
  type AgentRequest,
  type AgentResponse
} from "../../../packages/agent-core/src/index.js";

const metadata: AgentMetadata = {
  id: "otoi-agent",
  name: "OTOI SME Agent",
  domain: "operational-enforcement",
  version: "1.2.0",
  description: "Evaluates operational compliance against established terms.",
  capabilities: ["policy-enforcement", "operational-compliance"]
};

export class OTOIAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;

    if (request.query.trim().length > 0 && request.query.trim().startsWith("{")) {
      return this.evaluateCharter(request, decisionId);
    }

    const response = "Operationally, the action is permitted only when policy checks and audit requirements are satisfied.";
    const rationale = "OTOI verifies whether execution pathways conform to enforceable operational terms.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, "policy checks", "audit constraints"]
    });

    return { agentId: this.id, decisionId, response, rationale };
  }

  private async evaluateCharter(
    request: AgentRequest,
    decisionId: string
  ): Promise<AgentResponse> {
    try {
      const charter: OtoiCharter = parseCharter(request.query);
      const policy: EffectivePolicy = await honor(charter, { documents: [] });
      const conflicts: PolicyConflict[] = detectConflicts([policy.effective]);
      const targetAgentId = charter.agents[0]?.id;
      const propagated = targetAgentId ? propagate(policy, targetAgentId) : undefined;

      const response = `Honored OTOI charter across ${policy.agents.length} agent(s) in "${policy.enforcement.mode}" mode. Effective tier: ${policy.effective.$tier}. Same-tier conflicts: ${conflicts.length}.`;
      const rationale = "OTOI honored the supplied charter into an effective interaction policy with enforcement and conflict detection applied.";

      this.recordExplanation({
        decisionId,
        agentId: this.id,
        summary: rationale,
        evidence: [request.query, policy.enforcement.mode, `conflicts: ${conflicts.length}`]
      });

      return {
        agentId: this.id,
        decisionId,
        response,
        rationale,
        recommendations: [
          `Enforcement mode in force: ${policy.enforcement.mode}`,
          propagated ? `Policy propagated to agent ${targetAgentId}.` : "No agent id available for propagation."
        ]
      };
    } catch (error) {
      const response = "The supplied OTOI charter is invalid or could not be honored against enforceable terms.";
      const rationale = `OTOI processing failed: ${error instanceof Error ? error.message : String(error)}`;

      this.recordExplanation({
        decisionId,
        agentId: this.id,
        summary: rationale,
        evidence: [request.query, "charter validation"]
      });

      return { agentId: this.id, decisionId, response, rationale };
    }
  }
}
