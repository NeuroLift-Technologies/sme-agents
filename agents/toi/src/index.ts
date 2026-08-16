import {
  canonicalize,
  DEFAULT_DOCUMENT,
  extractToi,
  resolveToi,
  safeParseToi,
  serializeToi,
  TOIDocumentGenerator,
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
  version: "1.0.3",
  description: "Explains, validates, extracts, and generates terms of interaction documents and boundaries.",
  capabilities: ["toi-validation", "interaction-analysis", "toi-extraction", "toi-generation"]
};

const HIGHEST_PRECEDENCE_TIER = TOI_TIERS[TOI_TIERS.length - 1];

export class TOIAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;
    const query = request.query.trim();

    if (query.length > 0 && query.startsWith("{")) {
      return this.validateDocument(request, decisionId);
    }

    const lower = query.toLowerCase();
    if (lower.startsWith("extract:")) {
      return this.extractDocument(request, decisionId, query.slice("extract:".length).trim());
    }

    if (lower === "generate" || lower === "generate default") {
      return this.generateDocument(request, decisionId);
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

  private async extractDocument(
    request: AgentRequest,
    decisionId: string,
    naturalLanguage: string
  ): Promise<AgentResponse> {
    const result = extractToi(naturalLanguage);
    if (!result.success) {
      const response = "Could not extract a valid TOI document from the provided natural-language input.";
      const rationale = "extractToi could not map the input to a schema-valid .toi document.";
      this.recordExplanation({ decisionId, agentId: this.id, summary: rationale, evidence: [naturalLanguage] });
      return { agentId: this.id, decisionId, response, rationale };
    }

    const document = result.data;
    const serialized = serializeToi(document);

    const response = `Extracted a TOI document for author "${document.identity.author}" at tier "${document.$tier}" from natural-language input.`;
    const rationale = "extractToi converts natural-language preferences into a schema-valid .toi document.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [naturalLanguage, serialized, "natural-language extraction"]
    });

    return { agentId: this.id, decisionId, response, rationale, recommendations: [serialized] };
  }

  private async generateDocument(
    request: AgentRequest,
    decisionId: string
  ): Promise<AgentResponse> {
    const gen = TOIDocumentGenerator.fromDefaults("anonymous");
    const document = gen.document;
    const serialized = serializeToi(document);

    const response = `Generated a default privacy-first TOI document at tier "${document.$tier}" for author "${document.identity.author}".`;
    const rationale = "TOIDocumentGenerator.fromDefaults() produces a schema-valid, privacy-first .toi document from the canonical defaults.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: ["default generation", serialized, DEFAULT_DOCUMENT.$tier]
    });

    return { agentId: this.id, decisionId, response, rationale, recommendations: [serialized] };
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
