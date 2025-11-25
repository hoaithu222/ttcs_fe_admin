export const AI_ENDPOINTS = {
  GENERATE_PRODUCT_DESCRIPTION: "/ai/product-description",
  GENERATE_PRODUCT_META: "/ai/product-meta",
  GENERATE_CHAT_RESPONSE: "/ai/chat",
} as const;

export type AiEndpointKey = keyof typeof AI_ENDPOINTS;

export const buildAiEndpoint = (key: AiEndpointKey): string => AI_ENDPOINTS[key];


