export interface AgentRequest {
  id: string;
  query: string;
  context?: Record<string, unknown>;
}

export interface AgentResponse {
  agentId: string;
  decisionId: string;
  response: string;
  rationale: string;
  recommendations?: string[];
}

export interface DecisionExplanation {
  decisionId: string;
  agentId: string;
  summary: string;
  evidence: string[];
}

export interface AgentMetadata {
  id: string;
  name: string;
  domain: string;
  version: string;
  description: string;
  capabilities: string[];
  tags?: string[];
  subAgentIds?: string[];
}

export interface SMEAgent {
  id: string;
  name: string;
  domain: string;
  description: string;
  capabilities: string[];
  metadata: AgentMetadata;
  readonly subAgents?: SMEAgent[];
  process(request: AgentRequest): Promise<AgentResponse>;
  explainDecision(id: string): Promise<DecisionExplanation>;
}

export abstract class BaseSMEAgent implements SMEAgent {
  public readonly id: string;
  public readonly name: string;
  public readonly domain: string;
  public readonly description: string;
  public readonly capabilities: string[];
  public readonly metadata: AgentMetadata;
  public readonly subAgents: SMEAgent[];

  private readonly decisions = new Map<string, DecisionExplanation>();

  protected constructor(metadata: AgentMetadata, subAgents: SMEAgent[] = []) {
    this.metadata = metadata;
    this.id = metadata.id;
    this.name = metadata.name;
    this.domain = metadata.domain;
    this.description = metadata.description;
    this.capabilities = metadata.capabilities;
    this.subAgents = subAgents;
  }

  public abstract process(request: AgentRequest): Promise<AgentResponse>;

  public async explainDecision(id: string): Promise<DecisionExplanation> {
    return (
      this.decisions.get(id) ?? {
        decisionId: id,
        agentId: this.id,
        summary: "No decision explanation is available for the requested id.",
        evidence: []
      }
    );
  }

  protected recordExplanation(explanation: DecisionExplanation): void {
    this.decisions.set(explanation.decisionId, explanation);
  }
}
