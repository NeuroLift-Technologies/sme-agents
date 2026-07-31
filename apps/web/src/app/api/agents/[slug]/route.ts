import { analyzeToi } from '../../../../agents/toi/agent';
import { honorCharter, inspectConflicts, validateCharterInput } from '../../../../agents/otoi/agent';
import { askAllAgents } from '../../../../agents/asfdk/agent';
import { assessRrt } from '../../../../agents/rrt/agent';
import { assessSleepwalker } from '../../../../agents/sleepwalker/agent';
import { getAgent } from '../../../../lib/agent-registry';

interface AgentRequestBody {
  input: string;
  mode?: 'validate' | 'honor' | 'conflicts';
  compareTo?: string[];
  documents?: string[];
  targetAgentId?: string;
  history?: string[];
  state?: Record<string, unknown>;
  previousSummary?: string;
  userId?: string;
  model?: string;
  gatewayBaseUrl?: string;
}

async function maybeGenerateModelReply(
  slug: string,
  input: string,
  deterministicSummary: string,
  model: string | undefined,
  gatewayBaseUrl: string | undefined,
) {
  if (!process.env.AI_GATEWAY_API_KEY || !model) {
    return null;
  }

  const response = await fetch(`${gatewayBaseUrl ?? 'https://ai-gateway.vercel.sh/v1'}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: `You are assisting the ${slug} SME playground. Build on the deterministic result without contradicting it.`,
        },
        {
          role: 'user',
          content: `Deterministic summary: ${deterministicSummary}\n\nUser input: ${input}`,
        },
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
    default:
      return Response.json({ error: 'Unsupported agent slug.' }, { status: 400 });
  }

  const deterministicSummary =
    typeof deterministic === 'object' && deterministic !== null && 'summary' in deterministic
      ? String((deterministic as { summary: string }).summary)
      : 'No summary available.';

  const modelReply = await maybeGenerateModelReply(
    slug,
    body.input,
    deterministicSummary,
    body.model,
    body.gatewayBaseUrl,
  );

  return Response.json({
    agent: slug,
    deterministic,
    modelReply,
  });
}
