"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils/format";
import { useCartStore } from "@/features/cart/store";
import { ROUTES } from "@/config/routes";
import Button from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="fc-card fc-reveal group flex flex-col overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl">
      <Link href={ROUTES.PRODUCT_DETAIL(product.id)} className="block">
        <div className="relative aspect-square overflow-hidden bg-[var(--bg-accent)]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
          {product.stock_quantity <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white uppercase">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
          <h3 className="font-semibold text-[var(--text)] line-clamp-2 hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-[var(--muted)] line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-[var(--primary)]">
            {formatCurrency(product.price)}
          </span>
          <Button
            size="sm"
            disabled={product.stock_quantity <= 0}
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
