export type ModelRole = "system" | "user";

export interface ModelMessage {
  role: ModelRole;
  content: string;
}

export interface ModelGenerationRequest {
  messages: ModelMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface ModelGenerationResult {
  provider: string;
  model: string;
  content: string;
  repositoryGrounded: boolean;
  provenance: string[];
}

export interface TutorModelProvider {
  readonly name: string;
  readonly model: string;
  generate(request: ModelGenerationRequest): Promise<ModelGenerationResult>;
}

export interface ModelProviderConfiguration {
  provider: "deterministic" | "http";
  baseUrl: string | null;
  apiKeyConfigured: boolean;
  model: string;
}

export function readModelProviderConfiguration(): ModelProviderConfiguration {
  const provider =
    process.env.TUTOR_MODEL_PROVIDER === "http"
      ? "http"
      : "deterministic";

  const baseUrl =
    process.env.TUTOR_MODEL_BASE_URL?.trim() || null;

  const apiKeyConfigured =
    Boolean(process.env.TUTOR_MODEL_API_KEY?.trim());

  const model =
    process.env.TUTOR_MODEL_NAME?.trim() ||
    "repository-grounded-deterministic";

  return {
    provider,
    baseUrl,
    apiKeyConfigured,
    model
  };
}
