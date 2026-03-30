"use client";

import { useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import AuthGuard from "@/lib/auth/auth-guard";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils/helpers";

function ProfileContent() {
  const user = useAuthStore((s) => s.user);
  const initialize = useAuthStore((s) => s.initialize);
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!user) return;
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      const body: Record<string, string> = {};
      if (email !== user.email) body.email = email;
      if (password) body.password = password;

      if (Object.keys(body).length === 0) {
        setMessage("No changes to save");
        setSaving(false);
        return;
      }

      await api.patch(ENDPOINTS.USER(user.id), body);
      setPassword("");
      setMessage("Profile updated successfully!");
      await initialize();
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setSaving(false);
  }

  if (!user) return null;

  return (
    <main className="fc-page-wrap py-10">
      <h1 className="fc-display text-4xl text-[var(--primary)] fc-reveal">
        YOUR PROFILE
      </h1>

      <div className="fc-card fc-reveal mt-6 max-w-lg p-8">
        {/* Account Badge */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-strong)] text-white text-xl font-bold">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[var(--text)]">{user.email}</p>
            <p className="text-xs text-[var(--muted)]">
              {user.is_superuser ? "Administrator" : "Member"} · ID #{user.id}
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage(null);
              setError(null);
            }}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Leave blank to keep current"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage(null);
              setError(null);
            }}
          />
          <Button onClick={handleSave} loading={saving} className="w-full" size="lg">
            Save Changes
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
