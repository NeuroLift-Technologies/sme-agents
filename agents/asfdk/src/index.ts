import {
  createFoundation,
  detectInjectionPatterns,
  FoundationMode,
  sanitizeInput,
  type HealthCheckResult,
  type SanitizationResult
} from "@neurolift-technologies/asfdk";
import {
  BaseSMEAgent,
  type AgentMetadata,
  type AgentRequest,
  type AgentResponse
} from "../../../packages/agent-core/src/index.js";
import { ASFDKDevAgent } from "./dev-agent.js";
import { ASFDKDeployAgent } from "./deploy-agent.js";

const metadata: AgentMetadata = {
  id: "asfdk-agent",
  name: "ASFDK SME Agent",
  domain: "solidarity-framework",
  version: "0.2.4",
  description: "Explains the Solidarity Framework — its components (TOI, OTOI, RRT Advocate, Sleepwalker Protocol), governance model, prompt-injection defense utilities, and the two ASFDK pathways (asfdk-dev, asfdk-deploy).",
  capabilities: ["framework-guidance", "component-mapping", "governance-guidance", "prompt-defense"],
  subAgentIds: ["asfdk-dev-agent", "asfdk-deploy-agent"]
};

export class ASFDKAgent extends BaseSMEAgent {
  public constructor() {
    super(metadata, [new ASFDKDevAgent(), new ASFDKDeployAgent()]);
  }

  public async process(request: AgentRequest): Promise<AgentResponse> {
    const decisionId = `${this.id}-${request.id}`;
    const query = request.query.toLowerCase();

    const isDefenseQuery = ["injection", "prompt defense", "sanitize", "sanitization", "prompt security"].some(
      (token) => query.includes(token)
    );
    const isDeployQuery = ["deploy", "deployment", "integration", "wrapper", "claw"].some((token) =>
      query.includes(token)
    );
    const isDevQuery =
      (query.includes("dev") && !query.includes("deploy")) ||
      query.includes("build") ||
      query.includes("authoring");

    if (isDefenseQuery) {
      return this.evaluatePromptDefense(request, decisionId);
    }

    if (isDeployQuery) {
      return this.delegate(request, decisionId, "asfdk-deploy-agent");
    }

    if (isDevQuery) {
      return this.delegate(request, decisionId, "asfdk-dev-agent");
    }

    const health = await this.foundationHealth();

    const response = `The Solidarity Framework governs human-AI collaboration through the TOI, OTOI, ASFDK, RRT Advocate, and Sleepwalker Protocol components; ASFDK implements it as a kit with asfdk-dev (build new agents with the Solidarity Layer) and asfdk-deploy (integrate it into existing wrappers) pathways. Foundation health: ${health.healthy ? "healthy" : "degraded"} in UNIFIED mode across ${Object.keys(health.components).length} component(s).`;
    const rationale = "ASFDK is the implementation kit for the Solidarity Framework: component mapping ties each framework component to its governing agent, and governance guidance explains how the ASFDK layer enforces those components between model and runtime.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, "component mapping", "governance model", `health: ${health.healthy}`]
    });

    return { agentId: this.id, decisionId, response, rationale };
  }

  private evaluatePromptDefense(request: AgentRequest, decisionId: string): AgentResponse {
    const sanitized: SanitizationResult = sanitizeInput(request.query);
    const injectionCheck = detectInjectionPatterns(request.query);

    const response = `Prompt defense assessment: input risk level "${sanitized.riskLevel}", clean: ${sanitized.clean}. Injection pattern ${injectionCheck.detected ? `detected (${injectionCheck.pattern})` : "not detected"}.${sanitized.reason ? ` Reason: ${sanitized.reason}.` : ""}`;
    const rationale = "ASFDK prompt-defense utilities sanitize inputs and detect injection patterns to guard the Solidarity Layer boundary between model and runtime.";

    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: rationale,
      evidence: [request.query, sanitized.riskLevel, `injection detected: ${injectionCheck.detected}`]
    });

    return {
      agentId: this.id,
      decisionId,
      response,
      rationale,
      recommendations: sanitized.clean && !injectionCheck.detected
        ? ["Input is clean; no injection patterns detected."]
        : [`Input flagged at risk level "${sanitized.riskLevel}". Do not forward to the model without remediation.`]
    };
  }

  private async foundationHealth(): Promise<HealthCheckResult> {
    const foundation = await createFoundation({
      userId: "sme-agents-asfdk-agent",
      mode: FoundationMode.UNIFIED
    });
    return foundation.healthCheck();
  }

  private async delegate(
    request: AgentRequest,
    decisionId: string,
    subAgentId: string
  ): Promise<AgentResponse> {
    const subAgent = this.subAgents.find((agent) => agent.id === subAgentId);
    if (!subAgent) {
      throw new Error(`ASFDK sub-agent not found: ${subAgentId}`);
    }

    const response = await subAgent.process(request);
    this.recordExplanation({
      decisionId,
      agentId: this.id,
      summary: `Delegated ${request.query} to ${subAgent.name}.`,
      evidence: [request.query, `routed to ${subAgentId}`]
    });

    return response;
  }
}
