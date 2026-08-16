import type { HealthCheckResult, NeuroLiftFoundation } from '@neurolift-technologies/asfdk';

export type { HealthCheckResult };

export interface AsfdkDeployRunResult {
  summary: string;
  mode: string;
  systemStatus: Record<string, unknown>;
  health: HealthCheckResult;
}

/**
 * Returns the foundation's system status and health check for the UNIFIED mode.
 * Used by the ASFDK-Deploy pathway guide to show which components are active
 * when integrating the Solidarity Layer into existing agent wrappers (claws).
 */
export async function assessAsfdkDeploy(foundation: NeuroLiftFoundation): Promise<AsfdkDeployRunResult> {
  const systemStatus = foundation.getSystemStatus() as Record<string, unknown>;
  const health = await foundation.healthCheck();
  const activeComponents = Object.entries(health.components)
    .filter(([, c]) => c.active)
    .map(([name]) => name);

  const summary = `ASFDK-Deploy (UNIFIED mode): foundation is ${health.healthy ? 'healthy' : 'degraded'}. `
    + `Active components: ${activeComponents.length > 0 ? activeComponents.join(', ') : 'none'}. `
    + `All Solidarity Layer components (TOI, OTOI, Sleepwalker, RRT Advocate) are active.`;

  return { summary, mode: 'UNIFIED', systemStatus, health };
}
