import type { AgentMetadata, SMEAgent } from "../../agent-core/src/index.js";

interface RegistryEntry {
  agent: SMEAgent;
  metadata: AgentMetadata;
  registeredAt: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class AgentRegistry {
  private readonly entries = new Map<string, RegistryEntry>();

  public validateMetadata(metadata: AgentMetadata): ValidationResult {
    const errors: string[] = [];

    if (!metadata.id.trim()) errors.push("metadata.id is required");
    if (!metadata.name.trim()) errors.push("metadata.name is required");
    if (!metadata.domain.trim()) errors.push("metadata.domain is required");
    if (!metadata.description.trim()) errors.push("metadata.description is required");
    if (!metadata.version.trim()) errors.push("metadata.version is required");
    if (!Array.isArray(metadata.capabilities) || metadata.capabilities.length === 0) {
      errors.push("metadata.capabilities must include at least one capability");
    }

    return { valid: errors.length === 0, errors };
  }

  public register(agent: SMEAgent, metadata: AgentMetadata = agent.metadata): void {
    const validation = this.validateMetadata(metadata);
    if (!validation.valid) {
      throw new Error(`Invalid agent metadata: ${validation.errors.join(", ")}`);
    }

    if (agent.id !== metadata.id) {
      throw new Error("Agent id must match metadata id");
    }

    this.entries.set(agent.id, {
      agent,
      metadata,
      registeredAt: new Date().toISOString()
    });

    for (const subAgent of agent.subAgents ?? []) {
      this.register(subAgent, subAgent.metadata);
    }
  }

  public discover(): AgentMetadata[] {
    return [...this.entries.values()].map((entry) => entry.metadata);
  }

  public listAgents(): SMEAgent[] {
    return [...this.entries.values()].map((entry) => entry.agent);
  }

  public getAgent(id: string): SMEAgent | undefined {
    return this.entries.get(id)?.agent;
  }

  public getMetadata(id: string): AgentMetadata | undefined {
    return this.entries.get(id)?.metadata;
  }

  public getVersion(id: string): string | undefined {
    return this.entries.get(id)?.metadata.version;
  }

  public findByCapability(capability: string): SMEAgent[] {
    return this.listAgents().filter((agent) =>
      agent.capabilities.some((c) => c.toLowerCase() === capability.toLowerCase())
    );
  }

  public findByDomain(domain: string): SMEAgent[] {
    return this.listAgents().filter((agent) => agent.domain.toLowerCase() === domain.toLowerCase());
  }
}
