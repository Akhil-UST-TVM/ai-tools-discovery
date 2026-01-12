export const CATEGORIES = [
  "NLP",
  "Computer Vision",
  "Dev Tools",
  "Analytics",
  "Automation",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PRICING_MODELS = ["Free", "Paid", "Subscription"] as const;

export type PricingModel = (typeof PRICING_MODELS)[number];
