import type { HealthCheckResult, NeuroLiftFoundation } from '@neurolift-technologies/asfdk';

export type { HealthCheckResult };

export interface AsfdkDevRunResult {
  summary: string;
  mode: string;
  systemStatus: Record<string, unknown>;
  health: HealthCheckResult;
}

/**
 * Returns the foundation's system status and health check for the DEVELOPMENT mode.
 * Used by the ASFDK-Dev pathway guide to show which components are active
 * when building new agents with the Solidarity Layer from day one.
 */
export async function assessAsfdkDev(foundation: NeuroLiftFoundation): Promise<AsfdkDevRunResult> {
  const systemStatus = foundation.getSystemStatus() as Record<string, unknown>;
  const health = await foundation.healthCheck();
  const activeComponents = Object.entries(health.components)
    .filter(([, c]) => c.active)
    .map(([name]) => name);

  const summary = `ASFDK-Dev (DEVELOPMENT mode): foundation is ${health.healthy ? 'healthy' : 'degraded'}. `
    + `Active components: ${activeComponents.length > 0 ? activeComponents.join(', ') : 'none'}. `
    + `TOI and Sleepwalker are active in DEVELOPMENT mode; RRT Advocate is disabled.`;

  return { summary, mode: 'DEVELOPMENT', systemStatus, health };
}
