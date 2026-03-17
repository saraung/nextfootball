"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { ROUTES } from "@/config/routes";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirm) {
      setLocalError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    try {
      await register(email, password);
      router.push(ROUTES.PRODUCTS);
    } catch {
      // error set in store
    }
  }

  const displayError = localError || error;

  return (
    <main className="fc-page-wrap flex min-h-[70vh] items-center justify-center py-12">
      <div className="fc-card fc-reveal w-full max-w-md p-8">
        <h1 className="fc-display text-4xl text-center text-[var(--primary)]">
          JOIN THE TEAM
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Create your FootyConnects account
        </p>

        {displayError && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {displayError}
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
              setLocalError(null);
              setEmail(e.target.value);
            }}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => {
              clearError();
              setLocalError(null);
              setPassword(e.target.value);
            }}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => {
              setLocalError(null);
              setConfirm(e.target.value);
            }}
            required
          />
          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}