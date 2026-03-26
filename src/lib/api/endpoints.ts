export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  AUTH_ME: "/auth/me",

  // Users
  USERS: "/users/",
  USER: (id: number | string) => `/users/${id}`,

  // Products
  PRODUCTS: "/products/",
  PRODUCT: (id: number | string) => `/products/${id}`,

  // Orders
  ORDERS: "/orders/",
  ORDER: (id: number | string) => `/orders/${id}`,
  USER_ORDERS: (userId: number | string) => `/orders/user/${userId}`,

  // Health
  HEALTH: "/health",
} as const;
