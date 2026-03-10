import { create } from "zustand"

interface AuthState {
  token: string | null
  user: any
  setToken: (token: string) => void
  setUser: (user: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  setToken: (token) => set({ token }),

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("token")
    set({ token: null, user: null })
  },
}))