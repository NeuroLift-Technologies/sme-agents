import { AgentRegistry } from "../../../packages/agent-registry/src/index.js";
import { SMEOrchestrator } from "../../../packages/orchestration/src/index.js";
import { TOIAgent } from "../../../agents/toi/src/index.js";
import { OTOIAgent } from "../../../agents/otoi/src/index.js";
import { ASFDKAgent } from "../../../agents/asfdk/src/index.js";
import { RRTAdvocateAgent } from "../../../agents/rrt-advocate/src/index.js";
import { SleepwalkerAgent } from "../../../agents/sleepwalker/src/index.js";

export function createEcosystem(): SMEOrchestrator {
  const registry = new AgentRegistry();

  const agents = [
    new TOIAgent(),
    new OTOIAgent(),
    new ASFDKAgent(),
    new RRTAdvocateAgent(),
    new SleepwalkerAgent()
  ];

  // Registering the ASFDKAgent also auto-registers its sub-agents
  // (asfdk-dev-agent, asfdk-deploy-agent) via the registry.
  for (const agent of agents) {
    registry.register(agent);
  }

  return new SMEOrchestrator(registry);
}
