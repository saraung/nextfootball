"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api/axios"
import { useAuthStore } from "@/store/auth-store"

export default function LoginPage() {
  const router = useRouter()

  const setToken = useAuthStore((state) => state.setToken)
  const setUser = useAuthStore((state) => state.setUser)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const res = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      const token = res.data.access_token

      setToken(token)
      localStorage.setItem("token", token)

      const userRes = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUser(userRes.data)

      router.push("/")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 border rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </form>
    </div>
  )
}