"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useProductStore } from "@/features/products/store";
import { ROUTES } from "@/config/routes";
import ProductCard from "@/components/products/product-card";
import Button from "@/components/ui/button";

export default function HomePage() {
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    if (products.length === 0) fetchProducts(0, 4);
  }, [products.length, fetchProducts]);

  return (
    <main className="fc-page-wrap py-12 sm:py-16">
      {/* Hero */}
      <section className="fc-card fc-reveal overflow-hidden p-7 sm:p-10">
        <p className="inline-flex rounded-full border border-[var(--primary)]/20 bg-[var(--bg-accent)] px-3 py-1 text-xs tracking-[0.18em] text-[var(--primary)] uppercase">
          Built For Matchday
        </p>

        <h1 className="fc-display mt-4 text-5xl leading-[0.95] sm:text-7xl text-[var(--text)]">
          FIND YOUR
          <br />
          PERFECT BOOTS
        </h1>

        <p className="mt-5 max-w-xl text-[var(--muted)] text-base sm:text-lg leading-relaxed">
          Discover elite football gear curated by position, style, and surface.
          Get recommendations that match your game.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={ROUTES.PRODUCTS}>
            <Button size="lg">Shop Collection</Button>
          </Link>
          <Link href={ROUTES.REGISTER}>
            <Button size="lg" variant="outline">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article
          className="fc-card fc-reveal p-5"
          style={{ animationDelay: "90ms" }}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-accent)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="font-semibold text-lg text-[var(--text)]">Position-Based Picks</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            From strikers to keepers, browse gear tuned for your role and movement.
          </p>
        </article>

        <article
          className="fc-card fc-reveal p-5"
          style={{ animationDelay: "150ms" }}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-accent)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h2 className="font-semibold text-lg text-[var(--text)]">Trusted Reviews</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Compare real player feedback before you commit to your next setup.
          </p>
        </article>

        <article
          className="fc-card fc-reveal p-5"
          style={{ animationDelay: "220ms" }}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-accent)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h2 className="font-semibold text-lg text-[var(--text)]">Fast Checkout</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Secure, quick checkout that gets your gear ready for the next kickoff.
          </p>
        </article>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="mt-12 fc-reveal" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="fc-display text-3xl text-[var(--text)]">FEATURED GEAR</h2>
            <Link href={ROUTES.PRODUCTS} className="text-sm font-semibold text-[var(--primary)] hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}