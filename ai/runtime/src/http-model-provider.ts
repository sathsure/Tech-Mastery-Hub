import type {
  ModelGenerationRequest,
  ModelGenerationResult,
  TutorModelProvider
} from "./model-provider.js";

interface HttpModelResponse {
  content?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/** A model call that takes longer than this is abandoned (TUTOR_MODEL_TIMEOUT_MS, default 60 s). */
const REQUEST_TIMEOUT_MS = Number(process.env.TUTOR_MODEL_TIMEOUT_MS ?? "60000") || 60000;

function trimTrailingSlashes(url: string): string {
  let end = url.length;
  while (end > 0 && url[end - 1] === "/") end--;
  return url.slice(0, end);
}

export class HttpTutorModelProvider implements TutorModelProvider {
  readonly name = "http";
  readonly model: string;

  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    baseUrl: string,
    apiKey: string,
    model: string
  ) {
    if (!baseUrl.trim()) {
      throw new Error("Model provider base URL is required.");
    }

    if (!apiKey.trim()) {
      throw new Error("Model provider API key is required.");
    }

    if (!model.trim()) {
      throw new Error("Model provider model is required.");
    }

    this.baseUrl = trimTrailingSlashes(baseUrl);
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(
    request: ModelGenerationRequest
  ): Promise<ModelGenerationResult> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`
      },
      // A provider that never answers must not hold the request open forever.
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        model: this.model,
        messages: request.messages,
        temperature: request.temperature ?? 0,
        max_tokens: request.maxTokens ?? 1200
      })
    });

    if (!response.ok) {
      throw new Error(
        `Model provider request failed with HTTP ${response.status}.`
      );
    }

    const payload =
      await response.json() as HttpModelResponse;

    const content =
      payload.content ??
      payload.choices?.[0]?.message?.content ??
      "";

    if (!content.trim()) {
      throw new Error("Model provider returned empty content.");
    }

    return {
      provider: this.name,
      model: this.model,
      content,
      repositoryGrounded: true,
      provenance: []
    };
  }
}
