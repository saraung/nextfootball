"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/features/cart/store";
import { useOrderStore } from "@/features/orders/store";
import { useAuthStore } from "@/features/auth/store";
import { formatCurrency } from "@/lib/utils/format";
import { ROUTES } from "@/config/routes";
import CartItem from "@/components/cart/cart-item";
import Button from "@/components/ui/button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const totalAmount = useCartStore((s) => s.totalAmount);
  const clearCart = useCartStore((s) => s.clearCart);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const user = useAuthStore((s) => s.user);
  const isLoading = useOrderStore((s) => s.isLoading);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }
    setOrderError(null);
    try {
      const order = await placeOrder({
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      });
      clearCart();
      setOrderSuccess(true);
      setTimeout(() => router.push(ROUTES.ORDER_DETAIL(order.id)), 1500);
    } catch {
      setOrderError("Failed to place order. Please try again.");
    }
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <main className="fc-page-wrap py-16 text-center">
        <div className="fc-card fc-reveal inline-block p-10">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto text-[var(--muted)]"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <h1 className="mt-4 fc-display text-3xl text-[var(--text)]">
            YOUR CART IS EMPTY
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Add some gear to get started!
          </p>
          <Link href={ROUTES.PRODUCTS}>
            <Button className="mt-6" size="lg">
              Browse Products
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (orderSuccess) {
    return (
      <main className="fc-page-wrap py-16 text-center">
        <div className="fc-card fc-reveal inline-block p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="mt-4 fc-display text-3xl text-[var(--text)]">
            ORDER PLACED!
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Redirecting to your order details…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="fc-page-wrap py-10">
      <h1 className="fc-display text-4xl text-[var(--primary)] fc-reveal">
        YOUR CART
      </h1>

      {orderError && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {orderError}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="fc-card fc-reveal p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-[var(--text)]">
            Order Summary
          </h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[var(--muted)]">
              <span>Subtotal</span>
              <span>{formatCurrency(totalAmount())}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="border-t border-[var(--card-border)] pt-2 flex justify-between text-lg font-bold text-[var(--text)]">
              <span>Total</span>
              <span>{formatCurrency(totalAmount())}</span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            loading={isLoading}
            size="lg"
            className="mt-6 w-full"
          >
            {user ? "Place Order" : "Login to Checkout"}
          </Button>

          <Link
            href={ROUTES.PRODUCTS}
            className="mt-3 block text-center text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
