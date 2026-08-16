export interface AgentReply {
  modelReply?: { text?: string } | null;
  deterministic?: unknown;
}

/**
 * Sends a message to an agent route and returns the parsed reply.
 * Throws if the network response is not ok.
 */
export async function sendAgentMessage(
  slug: string,
  input: string,
  history: string[],
  extra?: Record<string, unknown>,
): Promise<AgentReply> {
  const response = await fetch(`/api/agents/${slug}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ input, history, ...extra }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Agent request failed (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<AgentReply>;
}
