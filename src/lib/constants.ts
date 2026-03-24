export const TOKEN_KEY = "fc_access_token";
export const THEME_KEY = "fc_theme";

export const DEFAULT_PAGE_SIZE = 20;
export const ORDERS_PAGE_SIZE = 10;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
