import { create } from "zustand";
import type { User } from "@/types/user";
import { loginAPI, registerAPI, getMeAPI } from "./api";
import { setToken, removeToken, getToken } from "@/lib/auth/token";
import { getErrorMessage } from "@/lib/utils/helpers";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await loginAPI(email, password);
      setToken(res.access_token);
      const user = await getMeAPI();
      set({ user, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
      throw err;
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await registerAPI({ email, password });
      // Auto-login after registration
      const res = await loginAPI(email, password);
      setToken(res.access_token);
      const user = await getMeAPI();
      set({ user, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: getErrorMessage(err) });
      throw err;
    }
  },

  logout: () => {
    removeToken();
    set({ user: null, error: null });
  },

  initialize: async () => {
    const token = getToken();
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    try {
      const user = await getMeAPI();
      set({ user, isInitialized: true });
    } catch {
      removeToken();
      set({ isInitialized: true });
    }
  },

  clearError: () => set({ error: null }),
}));
