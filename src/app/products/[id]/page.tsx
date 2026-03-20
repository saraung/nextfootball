"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProductStore } from "@/features/products/store";
import { useCartStore } from "@/features/cart/store";
import { formatCurrency } from "@/lib/utils/format";
import { ROUTES } from "@/config/routes";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const product = useProductStore((s) => s.currentProduct);
  const isLoading = useProductStore((s) => s.isLoading);
  const error = useProductStore((s) => s.error);
  const fetchProduct = useProductStore((s) => s.fetchProduct);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id, fetchProduct]);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <main className="fc-page-wrap py-16 text-center">
        <div className="fc-card inline-block p-8">
          <p className="text-red-500">{error}</p>
          <Link href={ROUTES.PRODUCTS} className="mt-4 inline-block text-[var(--primary)] hover:underline">
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="fc-page-wrap py-10">
      <Link
        href={ROUTES.PRODUCTS}
        className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Shop
      </Link>

      <div className="fc-card fc-reveal overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square bg-[var(--bg-accent)] overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between p-8">
            <div>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  product.stock_quantity > 0
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </span>

              <h1 className="mt-4 fc-display text-4xl sm:text-5xl text-[var(--text)]">
                {product.name.toUpperCase()}
              </h1>

              {product.description && (
                <p className="mt-4 text-[var(--muted)] leading-relaxed">
                  {product.description}
                </p>
              )}

              <p className="mt-6 text-4xl font-bold text-[var(--primary)]">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                disabled={product.stock_quantity <= 0}
                onClick={() => addItem(product)}
              >
                Add to Cart
              </Button>
              <Link href={ROUTES.CART}>
                <Button size="lg" variant="outline">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
