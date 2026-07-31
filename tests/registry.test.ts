import assert from "node:assert/strict";
import test from "node:test";
import { AgentRegistry } from "../packages/agent-registry/src/index.js";
import { TOIAgent } from "../agents/toi/src/index.js";

test("AgentRegistry registers and discovers agent metadata", () => {
  const registry = new AgentRegistry();
  const toi = new TOIAgent();

  registry.register(toi);

  const metadata = registry.discover();
  assert.equal(metadata.length, 1);
  assert.equal(metadata[0]?.id, "toi-agent");
  assert.equal(registry.getVersion("toi-agent"), "1.0.0");
});

test("AgentRegistry supports capability lookup", () => {
  const registry = new AgentRegistry();
  registry.register(new TOIAgent());

  const matches = registry.findByCapability("toi-validation");
  assert.equal(matches.length, 1);
  assert.equal(matches[0]?.name, "TOI SME Agent");
});
