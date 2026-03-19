"use client";

import type { CartItem as CartItemType } from "@/features/cart/types";
import { useCartStore } from "@/features/cart/store";
import { formatCurrency } from "@/lib/utils/format";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="fc-card flex items-center gap-4 p-4">
      {/* Image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--bg-accent)]">
        {item.product.image_url ? (
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--text)] truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-[var(--muted)]">
          {formatCurrency(item.product.price)} each
        </p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--card-border)] text-[var(--text)] hover:bg-[var(--bg-accent)] transition-colors"
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
        >
          −
        </button>
        <span className="w-8 text-center font-semibold text-[var(--text)]">
          {item.quantity}
        </span>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--card-border)] text-[var(--text)] hover:bg-[var(--bg-accent)] transition-colors"
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="w-24 text-right">
        <p className="font-bold text-[var(--primary)]">
          {formatCurrency(item.product.price * item.quantity)}
        </p>
      </div>

      {/* Remove */}
      <button
        className="rounded-full p-2 text-[var(--muted)] hover:bg-red-50 hover:text-red-500 transition-colors"
        onClick={() => removeItem(item.product.id)}
        aria-label="Remove item"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
        </svg>
      </button>
    </div>
  );
}
