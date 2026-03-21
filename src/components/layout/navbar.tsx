"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";
import { useCartStore } from "@/features/cart/store";
import { useUIStore } from "@/store/ui-store";
import { ROUTES } from "@/config/routes";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl">
      <nav className="fc-page-wrap flex items-center justify-between py-3">
        <Link href="/" className="fc-display text-3xl text-[var(--primary)]">
          FootyConnects
        </Link>

        <div className="flex items-center gap-1 sm:gap-3 text-sm">
          <Link
            href={ROUTES.PRODUCTS}
            className="rounded-full px-3 py-2 text-[var(--text)] hover:bg-[var(--bg-accent)] transition-colors"
          >
            Shop
          </Link>

          {/* Cart */}
          <Link
            href={ROUTES.CART}
            className="relative rounded-full px-3 py-2 text-[var(--text)] hover:bg-[var(--bg-accent)] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="inline"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-[var(--text)] hover:bg-[var(--bg-accent)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>

          {user ? (
            <>
              <Link
                href={ROUTES.ORDERS}
                className="rounded-full px-3 py-2 text-[var(--text)] hover:bg-[var(--bg-accent)] transition-colors"
              >
                Orders
              </Link>
              {user.is_superuser && (
                <Link
                  href={ROUTES.ADMIN_PRODUCTS}
                  className="rounded-full px-3 py-2 text-[var(--primary)] font-semibold hover:bg-[var(--bg-accent)] transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                href={ROUTES.PROFILE}
                className="rounded-full px-3 py-2 text-[var(--text)] hover:bg-[var(--bg-accent)] transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="inline"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
              <button
                onClick={logout}
                className="fc-btn border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--bg-accent)]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.LOGIN}
                className="rounded-full px-3 py-2 text-[var(--text)] hover:bg-[var(--bg-accent)] transition-colors"
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="fc-btn fc-btn-primary px-4 py-2 text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}