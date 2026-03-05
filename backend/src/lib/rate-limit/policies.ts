export const globalRateLimitPolicy = {
  max: 100,
  timeWindow: "1 minute"
} as const;

export const checkoutCreateRateLimitPolicy = {
  max: 5,
  timeWindow: "1 minute"
} as const;

export const checkoutStartRateLimitPolicy = {
  max: 10,
  timeWindow: "1 minute"
} as const;

export const webhookRateLimitPolicy = {
  max: 120,
  timeWindow: "1 minute"
} as const;

export const authenticatedDownloadRateLimitPolicy = {
  max: 10,
  timeWindow: "1 minute"
} as const;

export const guestDownloadRateLimitPolicy = {
  max: 10,
  timeWindow: "1 minute"
} as const;
