import {
  canonicalize,
  resolveToi,
  safeParseToi,
  serializeToi,
  TOI_TIERS
} from "@neurolift-technologies/toi";
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
  version: "1.0.1",
  description: "Explains and validates terms of interaction boundaries.",
  capabilities: ["toi-validation", "interaction-analysis"]
};

const HIGHEST_PRECEDENCE_TIER = TOI_TIERS[TOI_TIERS.length - 1];

export class TOIAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;

    if (request.query.trim().length > 0 && request.query.trim().startsWith("{")) {
      return this.validateDocument(request, decisionId);
    }

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

  private async validateDocument(
    request: AgentRequest,
    decisionId: string
  ): Promise<AgentResponse> {
    const parsed = safeParseToi(request.query);

    if (!parsed.success) {
      const response = "The supplied TOI document is invalid and cannot establish interaction boundaries.";
      const rationale = "TOI validation failed against the canonical schema, so no contract is assumed.";

      this.recordExplanation({
        decisionId,
        agentId: this.id,
        summary: rationale,
        evidence: [request.query, "schema validation", "invalid document"]
      });

      return { agentId: this.id, decisionId, response, rationale };
    }

    const document = parsed.data;
    const canonical = canonicalize(document);
    const serialized = serializeToi(document);
    const resolved = resolveToi([document]);

    const response = `Valid TOI document for ${document.identity.author} at tier ${document.$tier}. Canonical fingerprint: ${canonical.slice(0, 48)}... Effective tier after resolution: ${resolved.$tier}.`;
    const rationale = "TOI validation confirmed schema compliance and produced a canonical, serialized, tier-resolved contract.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, canonical, serialized, "tier resolution"]
    });

    return {
      agentId: this.id,
      decisionId,
      response,
      rationale,
      recommendations: [`Highest precedence tier in the contract set: ${HIGHEST_PRECEDENCE_TIER}`]
    };
  }
}
