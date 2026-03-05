import type { ProviderType } from "../../../db/types.js";

export type StartCheckoutInput = {
  checkoutSessionId: string;
  orderId: string;
  correlationId: string;
  identityKey: string;
  currency: string;
  totalCents: number;
  items: Array<{
    productId: string;
    title: string;
    unitAmountCents: number;
    quantity: number;
  }>;
  customer: {
    userId: string | null;
    email: string | null;
  };
  successUrl: string;
  cancelUrl: string;
};

export type StartCheckoutResult = {
  provider: ProviderType;
  providerSessionId: string;
  redirectUrl: string;
  expiresAt?: string;
};
