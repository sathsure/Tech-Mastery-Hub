import Anthropic from "@anthropic-ai/sdk";

/** What the chat service needs from a model: a stream of text plus a final summary. */
export type AnswerModelEvent =
  | { type: "thinking" }
  | { type: "text"; text: string }
  | { type: "fallback"; from: string; to: string }
  | {
      type: "final";
      model: string;
      stopReason: string | null;
      refusal: { category: string | null; explanation: string | null } | null;
      usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheWriteTokens: number };
    };

export interface AnswerModelInput {
  system: string;
  messages: Anthropic.Beta.BetaMessageParam[];
  signal?: AbortSignal;
}

export interface AnswerModel {
  readonly name: string;
  readonly model: string;
  stream(input: AnswerModelInput): AsyncIterable<AnswerModelEvent>;
}

type Effort = "low" | "medium" | "high" | "xhigh" | "max";
const EFFORTS: Effort[] = ["low", "medium", "high", "xhigh", "max"];

export class ClaudeAnswerModel implements AnswerModel {
  readonly name = "claude";
  readonly model: string;
  private readonly client: Anthropic;
  private readonly effort: Effort;

  constructor(options: { model?: string; effort?: Effort; client?: Anthropic } = {}) {
    this.model = options.model ?? "claude-opus-5-5";
    this.effort = options.effort ?? "medium";
    // Credentials come from the environment: ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN or an `ant auth login` profile.
    this.client = options.client ?? new Anthropic();
  }

  async *stream(input: AnswerModelInput): AsyncIterable<AnswerModelEvent> {
    const stream = this.client.beta.messages.stream(
      {
        model: this.model,
        max_tokens: 64000,
        // Chat answers are moderate reasoning work; raise TUTOR_CLAUDE_EFFORT for deeper answers.
        output_config: { effort: this.effort },
        // If the model declines, the API retries on a suitable fallback model inside the same call.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        // Caches the whole prefix (system + earlier turns), so each new turn of a chat re-reads it cheaply.
        cache_control: { type: "ephemeral" },
        system: input.system,
        messages: input.messages,
      },
      { signal: input.signal },
    );

    for await (const event of stream) {
      if (event.type === "content_block_start") {
        if (event.content_block.type === "thinking") yield { type: "thinking" };
        if (event.content_block.type === "fallback") {
          yield { type: "fallback", from: event.content_block.from.model, to: event.content_block.to.model };
        }
      } else if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield { type: "text", text: event.delta.text };
      }
    }

    const final = await stream.finalMessage();
    const refused = final.stop_reason === "refusal";
    yield {
      type: "final",
      model: final.model,
      stopReason: final.stop_reason,
      refusal: refused ? { category: final.stop_details?.category ?? null, explanation: final.stop_details?.explanation ?? null } : null,
      usage: {
        inputTokens: final.usage.input_tokens,
        outputTokens: final.usage.output_tokens,
        cacheReadTokens: final.usage.cache_read_input_tokens ?? 0,
        cacheWriteTokens: final.usage.cache_creation_input_tokens ?? 0,
      },
    };
  }
}

/**
 * TUTOR_ANSWER_MODE: "claude" (always use Claude), "repository" (notes only, no model),
 * or "auto" (default: Claude when ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN is set).
 */
export function createAnswerModel(env: NodeJS.ProcessEnv = process.env): AnswerModel | null {
  const mode = (env.TUTOR_ANSWER_MODE ?? "auto").trim().toLowerCase();
  if (mode === "repository") return null;
  const hasCredentials = Boolean(env.ANTHROPIC_API_KEY?.trim() || env.ANTHROPIC_AUTH_TOKEN?.trim());
  if (mode !== "claude" && !hasCredentials) return null;
  const effort = EFFORTS.find(level => level === env.TUTOR_CLAUDE_EFFORT?.trim().toLowerCase());
  return new ClaudeAnswerModel({ model: env.TUTOR_CLAUDE_MODEL?.trim() || undefined, effort });
}

/** Turns SDK errors into a short message for the user (no secrets, no stack traces). */
export function describeModelError(error: unknown): { code: string; message: string; aborted: boolean } {
  if (error instanceof Anthropic.APIUserAbortError) return { code: "ABORTED", message: "Request cancelled.", aborted: true };
  if (error instanceof Anthropic.AuthenticationError) return { code: "MODEL_AUTH", message: "The AI model rejected the credentials. Check ANTHROPIC_API_KEY.", aborted: false };
  if (error instanceof Anthropic.PermissionDeniedError) return { code: "MODEL_PERMISSION", message: "This API key cannot use the configured model.", aborted: false };
  if (error instanceof Anthropic.NotFoundError) return { code: "MODEL_NOT_FOUND", message: "The configured model was not found. Check TUTOR_CLAUDE_MODEL.", aborted: false };
  if (error instanceof Anthropic.RateLimitError) return { code: "MODEL_RATE_LIMIT", message: "The AI model is rate limited right now.", aborted: false };
  if (error instanceof Anthropic.BadRequestError) return { code: "MODEL_BAD_REQUEST", message: "The AI model rejected the request.", aborted: false };
  if (error instanceof Anthropic.APIConnectionError) return { code: "MODEL_UNREACHABLE", message: "Could not reach the AI model.", aborted: false };
  if (error instanceof Anthropic.APIError) return { code: "MODEL_ERROR", message: `The AI model returned an error (${error.status ?? "unknown"}).`, aborted: false };
  if (error instanceof Error && error.name === "AbortError") return { code: "ABORTED", message: "Request cancelled.", aborted: true };
  return { code: "MODEL_ERROR", message: "The AI model failed unexpectedly.", aborted: false };
}
