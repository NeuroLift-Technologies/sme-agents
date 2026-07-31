import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createEcosystem } from "./ecosystem.js";

const orchestrator = createEcosystem();

async function run(query: string): Promise<void> {
  const result = await orchestrator.orchestrate({ id: `demo-${Date.now()}`, query });

  console.log("\n=== SME Agent Collaboration ===");
  console.log(result.summary);
  console.log("\n--- Interaction History ---");
  for (const step of result.steps) {
    console.log(`- ${step.agentName} [${step.domain}]`);
    console.log(`  Decision: ${step.decisionId}`);
    console.log(`  Rationale: ${step.rationale}`);
  }
}

const cliQuery = process.argv.slice(2).join(" ").trim();
if (cliQuery) {
  await run(cliQuery);
} else {
  const rl = readline.createInterface({ input, output });
  const query = (await rl.question("Ask the SME ecosystem a question: ")).trim();
  rl.close();

  if (query) {
    await run(query);
  } else {
    console.log("No query provided.");
  }
}
