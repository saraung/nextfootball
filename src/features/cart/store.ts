import { create } from "zustand";
import type { Product } from "@/types/product";
import type { CartItem } from "./types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("fc_cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("fc_cart", JSON.stringify(items));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),

  addItem: (product, quantity = 1) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.product.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      items.push({ product, quantity });
    }
    saveCart(items);
    set({ items });
  },

  removeItem: (productId) => {
    const items = get().items.filter((i) => i.product.id !== productId);
    saveCart(items);
    set({ items });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const items = get().items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i,
    );
    saveCart(items);
    set({ items });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalAmount: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
