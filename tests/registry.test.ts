import assert from "node:assert/strict";
import test from "node:test";
import { AgentRegistry } from "../packages/agent-registry/src/index.js";
import { TOIAgent } from "../agents/toi/src/index.js";
import { ASFDKAgent } from "../agents/asfdk/src/index.js";

test("AgentRegistry registers and discovers agent metadata", () => {
  const registry = new AgentRegistry();
  const toi = new TOIAgent();

  registry.register(toi);

  const metadata = registry.discover();
  assert.equal(metadata.length, 1);
  assert.equal(metadata[0]?.id, "toi-agent");
  assert.equal(registry.getVersion("toi-agent"), "1.0.1");
});

test("AgentRegistry supports capability lookup", () => {
  const registry = new AgentRegistry();
  registry.register(new TOIAgent());

  const matches = registry.findByCapability("toi-validation");
  assert.equal(matches.length, 1);
  assert.equal(matches[0]?.name, "TOI SME Agent");
});

test("AgentRegistry auto-registers ASFDK sub-agents from a single parent register call", () => {
  const registry = new AgentRegistry();
  registry.register(new ASFDKAgent());

  const metadata = registry.discover();
  assert.equal(metadata.length, 3);
  assert.ok(metadata.some((m) => m.id === "asfdk-dev-agent"));
  assert.ok(metadata.some((m) => m.id === "asfdk-deploy-agent"));
});
