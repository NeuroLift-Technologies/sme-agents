import assert from "node:assert/strict";
import test from "node:test";
import { createEcosystem } from "../apps/demo/src/ecosystem.js";

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
