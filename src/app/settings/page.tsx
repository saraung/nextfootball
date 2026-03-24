"use client";

import { useUIStore } from "@/store/ui-store";
import AuthGuard from "@/lib/auth/auth-guard";

function SettingsContent() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  return (
    <main className="fc-page-wrap py-10">
      <h1 className="fc-display text-4xl text-[var(--primary)] fc-reveal">
        SETTINGS
      </h1>

      <div className="fc-card fc-reveal mt-6 max-w-lg p-8">
        <h2 className="text-lg font-bold text-[var(--text)]">Appearance</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Choose your preferred theme.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Light */}
          <button
            onClick={() => setTheme("light")}
            className={`fc-card flex flex-col items-center gap-3 p-5 transition-all hover:-translate-y-0.5 ${
              theme === "light"
                ? "ring-2 ring-[var(--primary)] shadow-lg"
                : "opacity-70"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-yellow-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[var(--text)]">Light</span>
          </button>

          {/* Dark */}
          <button
            onClick={() => setTheme("dark")}
            className={`fc-card flex flex-col items-center gap-3 p-5 transition-all hover:-translate-y-0.5 ${
              theme === "dark"
                ? "ring-2 ring-[var(--primary)] shadow-lg"
                : "opacity-70"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-800 to-slate-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[var(--text)]">Dark</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
