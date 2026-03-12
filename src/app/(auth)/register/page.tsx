"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
    <div className="fc-page-wrap flex min-h-[calc(100vh-68px)] items-center justify-center py-10">
      <form
        onSubmit={handleRegister}
        className="fc-card fc-reveal w-full max-w-md p-7 sm:p-9"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[#2f5a43]">Join The Club</p>
        <h1 className="fc-display mt-2 text-5xl leading-none text-[#163825]">Register</h1>

        {error && (
          <p className="mb-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="fc-input mt-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="fc-input mt-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="fc-btn fc-btn-primary mt-5 w-full py-3"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-[#4f6657]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#155836] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}