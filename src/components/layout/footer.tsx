import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--card-border)] bg-[var(--card)]">
      <div className="fc-page-wrap py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="fc-display text-2xl text-[var(--primary)]">
              FootyConnects
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
              Elite football gear curated by position, style, and surface.
              Get recommendations that match your game.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--text)]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>
                <Link href="/products" className="hover:text-[var(--primary)] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[var(--primary)] transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[var(--primary)] transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--text)]">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>
                <Link href="/settings" className="hover:text-[var(--primary)] transition-colors">
                  Settings
                </Link>
              </li>
              <li>
                <span className="cursor-default">help@footyconnects.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--card-border)] pt-6 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} FootyConnects. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
