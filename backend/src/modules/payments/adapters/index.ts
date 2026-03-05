import { getEnv } from "../../../config/env.js";
import { HttpError } from "../../../lib/http/exceptions.js";
import type { ProviderType } from "../../../db/types.js";
import { startPaddleCheckout } from "./paddle.js";
import { startStripeCheckout } from "./stripe.js";
import type { StartCheckoutInput, StartCheckoutResult } from "./types.js";

export async function startCheckoutWithProvider(
  provider: ProviderType,
  input: StartCheckoutInput
): Promise<StartCheckoutResult> {
  const env = getEnv();

  switch (provider) {
    case "stripe":
      return startStripeCheckout(env, input);
    case "paddle":
      return startPaddleCheckout(env, input);
    default:
      throw new HttpError(400, "PROVIDER_UNSUPPORTED", "Unsupported payment provider");
  }
}
