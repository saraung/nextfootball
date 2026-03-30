import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Order, CreateOrderRequest } from "@/types/order";

export async function createOrderAPI(body: CreateOrderRequest): Promise<Order> {
  const { data } = await api.post<Order>(ENDPOINTS.ORDERS, body);
  return data;
}

export async function getOrderAPI(id: number | string): Promise<Order> {
  const { data } = await api.get<Order>(ENDPOINTS.ORDER(id));
  return data;
}

export async function getUserOrdersAPI(
  userId: number | string,
  skip = 0,
  limit = 10,
): Promise<Order[]> {
  const { data } = await api.get<Order[]>(ENDPOINTS.USER_ORDERS(userId), {
    params: { skip, limit },
  });
  return data;
}

export async function getAllOrdersAPI(skip = 0, limit = 50): Promise<Order[]> {
  const { data } = await api.get<Order[]>(ENDPOINTS.ORDERS, {
    params: { skip, limit },
  });
  return data;
}

export async function updateOrderStatusAPI(
  id: number | string,
  status: string,
): Promise<Order> {
  const { data } = await api.patch<Order>(ENDPOINTS.ORDER(id), { status });
  return data;
}

export async function deleteOrderAPI(id: number | string): Promise<void> {
  await api.delete(ENDPOINTS.ORDER(id));
}
