import type { AgentRequest, AgentResponse, SMEAgent } from "../../agent-core/src/index.js";
import { AgentRegistry } from "../../agent-registry/src/index.js";

export interface OrchestrationStep {
  agentId: string;
  agentName: string;
  domain: string;
  decisionId: string;
  response: string;
  rationale: string;
}

export interface OrchestrationResult {
  requestId: string;
  selectedAgents: string[];
  summary: string;
  steps: OrchestrationStep[];
}

export class SMEOrchestrator {
  public constructor(private readonly registry: AgentRegistry) {}

  public async orchestrate(request: AgentRequest): Promise<OrchestrationResult> {
    const selectedAgents = this.selectAgents(request);
    const steps: OrchestrationStep[] = [];

    for (const agent of selectedAgents) {
      const response = await agent.process(request);
      steps.push(this.mapStep(agent, response));
    }

    return {
      requestId: request.id,
      selectedAgents: selectedAgents.map((agent) => agent.id),
      summary: this.createSummary(request.query, steps),
      steps
    };
  }

  private selectAgents(request: AgentRequest): SMEAgent[] {
    const allAgents = this.registry.listAgents();
    const normalizedQuery = request.query.toLowerCase();

    const matchedAgents = allAgents.filter((agent) => {
      const searchableTerms = [agent.domain, ...agent.capabilities, agent.name].map((v) => v.toLowerCase());
      return searchableTerms.some((term) => {
        if (normalizedQuery.includes(term) || normalizedQuery.includes(term.split("-").join(" "))) {
          return true;
        }

        const tokenMatches = term
          .split(/[\s-]/g)
          .filter((token) => token.length > 4)
          .some((token) => normalizedQuery.includes(token));

        return tokenMatches;
      });
    });

    if (matchedAgents.length > 0) {
      return matchedAgents;
    }

    const isPolicyQuestion =
      normalizedQuery.includes("perform") &&
      normalizedQuery.includes("action") &&
      (normalizedQuery.includes("ai agent") || normalizedQuery.includes("agent"));
    if (isPolicyQuestion) {
      return allAgents;
    }

    return allAgents;
  }

  private mapStep(agent: SMEAgent, response: AgentResponse): OrchestrationStep {
    return {
      agentId: agent.id,
      agentName: agent.name,
      domain: agent.domain,
      decisionId: response.decisionId,
      response: response.response,
      rationale: response.rationale
    };
  }

  private createSummary(query: string, steps: OrchestrationStep[]): string {
    const lines = [`User Request: ${query}`];
    for (const step of steps) {
      lines.push(`${step.agentName} (${step.domain}): ${step.response}`);
    }
    return lines.join("\n");
  }
}
