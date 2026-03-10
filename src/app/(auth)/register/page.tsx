"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api/axios"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      await api.post("/auth/register", {
        email,
        password,
      })

      router.push("/login")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md p-8 border rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-6">Register</h1>

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
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </form>
    </div>
  )
}