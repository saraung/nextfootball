"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { ROUTES } from "@/config/routes";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push(ROUTES.PRODUCTS);
    } catch {
      // error is set in store
    }
  }

  return (
    <main className="fc-page-wrap flex min-h-[70vh] items-center justify-center py-12">
      <div className="fc-card fc-reveal w-full max-w-md p-8">
        <h1 className="fc-display text-4xl text-center text-[var(--primary)]">
          WELCOME BACK
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Sign in to your FootyConnects account
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              clearError();
              setEmail(e.target.value);
            }}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              clearError();
              setPassword(e.target.value);
            }}
            required
          />
          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}