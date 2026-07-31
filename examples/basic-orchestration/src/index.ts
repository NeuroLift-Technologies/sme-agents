import { createEcosystem } from "../../../apps/demo/src/ecosystem.js";

const orchestrator = createEcosystem();

const result = await orchestrator.orchestrate({
  id: "example-1",
  query: "Can an AI agent perform this action with accountability and operational compliance?"
});

console.log(result.summary);
