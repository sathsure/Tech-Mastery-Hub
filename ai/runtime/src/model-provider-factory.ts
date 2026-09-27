import {
  readModelProviderConfiguration,
  type TutorModelProvider
} from "./model-provider.js";
import { DeterministicTutorModelProvider } from "./deterministic-model-provider.js";
import { HttpTutorModelProvider } from "./http-model-provider.js";

export function createTutorModelProvider(): TutorModelProvider {
  const configuration = readModelProviderConfiguration();

  if (configuration.provider === "http") {
    if (!configuration.baseUrl) {
      throw new Error(
        "TUTOR_MODEL_BASE_URL is required when TUTOR_MODEL_PROVIDER=http."
      );
    }

    if (!configuration.apiKeyConfigured) {
      throw new Error(
        "TUTOR_MODEL_API_KEY is required when TUTOR_MODEL_PROVIDER=http."
      );
    }

    return new HttpTutorModelProvider(
      configuration.baseUrl,
      process.env.TUTOR_MODEL_API_KEY ?? "",
      configuration.model
    );
  }

  return new DeterministicTutorModelProvider();
}
