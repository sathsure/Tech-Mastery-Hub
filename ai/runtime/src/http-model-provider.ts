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

    this.baseUrl = baseUrl.replace(/\/+$/, "");
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
