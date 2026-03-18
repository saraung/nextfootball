import { create } from "zustand";
import type { Product } from "@/types/product";
import {
  getProductsAPI,
  getProductAPI,
} from "./api";
import { getErrorMessage } from "@/lib/utils/helpers";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  fetchProducts: (skip?: number, limit?: number) => Promise<void>;
  fetchProduct: (id: number | string) => Promise<void>;
  clearCurrentProduct: () => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async (skip = 0, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const products = await getProductsAPI(skip, limit);
      set({ products, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
    }
  },

  fetchProduct: async (id) => {
    set({ isLoading: true, error: null, currentProduct: null });
    try {
      const product = await getProductAPI(id);
      set({ currentProduct: product, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null }),
  clearError: () => set({ error: null }),
}));
