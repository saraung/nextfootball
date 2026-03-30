import { create } from "zustand";
import type { Order } from "@/types/order";
import { getUserOrdersAPI, getOrderAPI, createOrderAPI, deleteOrderAPI, getAllOrdersAPI, updateOrderStatusAPI } from "./api";
import type { CreateOrderRequest } from "@/types/order";
import { getErrorMessage } from "@/lib/utils/helpers";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  fetchUserOrders: (userId: number, skip?: number, limit?: number) => Promise<void>;
  fetchOrder: (id: number | string) => Promise<void>;
  placeOrder: (body: CreateOrderRequest) => Promise<Order>;
  fetchAllOrders: (skip?: number, limit?: number) => Promise<void>;
  updateOrderStatus: (id: number | string, status: string) => Promise<void>;
  cancelOrder: (id: number | string) => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchUserOrders: async (userId, skip = 0, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await getUserOrdersAPI(userId, skip, limit);
      set({ orders, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
    }
  },

  fetchOrder: async (id) => {
    set({ isLoading: true, error: null, currentOrder: null });
    try {
      const order = await getOrderAPI(id);
      set({ currentOrder: order, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
    }
  },

  placeOrder: async (body) => {
    set({ isLoading: true, error: null });
    try {
      const order = await createOrderAPI(body);
      set({ isLoading: false });
      return order;
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
      throw err;
    }
  },

  fetchAllOrders: async (skip = 0, limit = 50) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await getAllOrdersAPI(skip, limit);
      set({ orders, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await updateOrderStatusAPI(id, status);
      set((s) => ({
        orders: s.orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
        currentOrder: s.currentOrder?.id === updatedOrder.id ? updatedOrder : s.currentOrder,
        isLoading: false,
      }));
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
      throw err;
    }
  },

  cancelOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteOrderAPI(id);
      set((s) => ({
        orders: s.orders.filter((o) => o.id !== Number(id)),
        isLoading: false,
      }));
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
    }
  },

  clearError: () => set({ error: null }),
}));
