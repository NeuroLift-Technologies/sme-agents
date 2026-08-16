import { Channel, InteractionType } from '@neurolift-technologies/asfdk';
import { analyzeToi } from '@agents/toi/agent';
import { honorCharter, inspectConflicts, validateCharterInput } from '@agents/otoi/agent';
import { askAllAgents } from '@agents/asfdk/agent';
import { assessAsfdkDev } from '@agents/asfdk-dev/agent';
import { assessAsfdkDeploy } from '@agents/asfdk-deploy/agent';
import { assessRrt } from '@agents/rrt/agent';
import { assessSleepwalker } from '@agents/sleepwalker/agent';
import { assessSdl } from '@agents/sdl/agent';
import { getAgent } from '@lib/agent-registry';
import { getFoundation } from '@lib/foundation';

const DEFAULT_MODEL = process.env.VERCEL_AI_GATEWAY_MODEL ?? 'gpt-4o-mini';

interface AgentRequestBody {
  input: string;
  mode?: 'validate' | 'honor' | 'conflicts';
  compareTo?: string[];
  documents?: string[];
  targetAgentId?: string;
  history?: string[];
  state?: Record<string, unknown>;
  previousSummary?: string;
  version?: string;
  tone?: string;
  prior?: Record<string, unknown>;
  userId?: string;
  model?: string;
  gatewayBaseUrl?: string;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const agent = getAgent(slug);
  if (!agent) {
    return Response.json({ error: 'Unknown agent slug.' }, { status: 404 });
  }

  const body = (await request.json()) as Partial<AgentRequestBody>;
  if (!body.input || typeof body.input !== 'string') {
    return Response.json({ error: 'Request body must include an input string.' }, { status: 400 });
  }

  const foundation = await getFoundation(agent.slug);
  const govResult = await foundation.processInteraction({
    timestamp: new Date(),
    interactionType: interactionTypeForSlug(slug),
    data: { text: body.input },
    userId: body.userId ?? `web-user-${slug}`,
    channel: Channel.USER_INPUT,
  });

  let deterministic: unknown;

  switch (slug) {
    case 'toi':
      deterministic = analyzeToi(body.input, body.compareTo ?? []);
      break;
    case 'otoi':
      if (body.mode === 'conflicts') {
        deterministic = inspectConflicts(body.documents ?? []);
      } else if (body.mode === 'honor') {
        deterministic = await honorCharter(body.input, body.documents ?? [], body.targetAgentId);
      } else {
        deterministic = validateCharterInput(body.input);
      }
      break;
    case 'asfdk':
      deterministic = await askAllAgents(body.input);
      break;
    case 'asfdk-dev':
      deterministic = await assessAsfdkDev(foundation);
      break;
    case 'asfdk-deploy':
      deterministic = await assessAsfdkDeploy(foundation);
      break;
    case 'rrt':
      deterministic = await assessRrt(body.input, body.userId);
      break;
    case 'sleepwalker':
      deterministic = assessSleepwalker({
        note: body.input,
        history: body.history,
        state: body.state,
        previousSummary: body.previousSummary,
      });
      break;
    case 'sdl':
      deterministic = await assessSdl({
        message: body.input,
        model: body.model,
        version: body.version,
        tone: body.tone,
        prior: body.prior,
      });
      break;
    default:
      return Response.json({ error: 'Unsupported agent slug.' }, { status: 400 });
  }

  const deterministicSummary =
    typeof deterministic === 'object' && deterministic !== null && 'summary' in deterministic
      ? String((deterministic as { summary: string }).summary)
      : 'No summary available.';

  const modelReply = await maybeGenerateModelReply(
    agent.systemPrompt,
    body.input,
    deterministicSummary,
    body.model ?? DEFAULT_MODEL,
    body.gatewayBaseUrl,
  );

  return Response.json({
    agent: slug,
    deterministic,
    governance: govResult,
    modelReply,
  });
}

/** Maps each agent slug to the correct ASFDK InteractionType per the quickstart. */
function interactionTypeForSlug(slug: string): InteractionType {
  switch (slug) {
    case 'toi':
    case 'otoi':
      return InteractionType.PREFERENCE_UPDATE;
    case 'rrt':
      return InteractionType.CRISIS_ALERT;
    case 'sleepwalker':
    case 'sdl':
      return InteractionType.EMOTIONAL_ASSESSMENT;
    case 'asfdk-dev':
    case 'asfdk-deploy':
      return InteractionType.OPTIMIZATION_REQUEST;
    case 'asfdk':
    default:
      return InteractionType.STATUS_INQUIRY;
  }
}

/** @internal - model reply generator */
async function maybeGenerateModelReply(
  systemPrompt: string,
  input: string,
  deterministicSummary: string,
  model: string | undefined,
  gatewayBaseUrl: string | undefined,
) {
  if (!process.env.AI_GATEWAY_API_KEY || !model) {
    return null;
  }

  const hasRealAnalysis =
    deterministicSummary !== 'No summary available.' &&
    !deterministicSummary.startsWith('Paste a JSON') &&
    !deterministicSummary.startsWith('ASFDK-Dev') &&
    !deterministicSummary.startsWith('ASFDK-Deploy');

  const userMessage = hasRealAnalysis
    ? `${input}

[Deterministic analysis: ${deterministicSummary}]`
    : input;

  const response = await fetch(`${gatewayBaseUrl ?? 'https://ai-gateway.vercel.sh/v1'}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI Gateway request failed with status ${response.status}`);
  }

  const completion = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  return {
    model,
    text: completion.choices?.[0]?.message?.content ?? '',
  };
}
