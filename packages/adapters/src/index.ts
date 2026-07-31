import type { AgentRequest, AgentResponse, SMEAgent } from "../../agent-core/src/index.js";

export interface AgentAdapter {
  invoke(agent: SMEAgent, request: AgentRequest): Promise<AgentResponse>;
}

export class DirectAgentAdapter implements AgentAdapter {
  public async invoke(agent: SMEAgent, request: AgentRequest): Promise<AgentResponse> {
    return agent.process(request);
  }
}
