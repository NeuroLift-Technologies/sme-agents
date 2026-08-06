import assert from "node:assert/strict";
import test from "node:test";
import { createEcosystem } from "../apps/demo/src/ecosystem.js";
import { ASFDKAgent } from "../agents/asfdk/src/index.js";

test("SME orchestrator returns transparent interaction history", async () => {
  const orchestrator = createEcosystem();

  const result = await orchestrator.orchestrate({
    id: "req-1",
    query: "Can an AI agent perform this action with policy enforcement and accountability?"
  });

  assert.equal(result.requestId, "req-1");
  assert.ok(result.steps.length >= 2);
  assert.ok(result.summary.includes("User Request:"));
  assert.ok(result.steps.every((step) => step.agentId.length > 0 && step.domain.length > 0));
});

test("SME orchestrator selects ASFDK sub-agents for pathway queries", async () => {
  const orchestrator = createEcosystem();

  const dev = await orchestrator.orchestrate({
    id: "req-dev",
    query: "explain the asfdk dev pathway"
  });
  assert.ok(dev.selectedAgents.includes("asfdk-dev-agent"));
  assert.ok(dev.selectedAgents.includes("asfdk-agent"));

  const deploy = await orchestrator.orchestrate({
    id: "req-deploy",
    query: "how do i deploy the asfdk into my wrapper"
  });
  assert.ok(deploy.selectedAgents.includes("asfdk-deploy-agent"));
});

test("ASFDKAgent routes dev and deploy queries to its sub-agents", async () => {
  const agent = new ASFDKAgent();

  const dev = await agent.process({
    id: "req-dev",
    query: "explain the asfdk dev pathway"
  });
  assert.equal(dev.agentId, "asfdk-dev-agent");
  assert.ok(dev.response.includes("Solidarity Layer"));

  const deploy = await agent.process({
    id: "req-deploy",
    query: "how do i deploy the asfdk into my wrapper"
  });
  assert.equal(deploy.agentId, "asfdk-deploy-agent");
  assert.ok(deploy.response.includes("wrapper"));
});
