"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/features/auth/store";
import { useOrderStore } from "@/features/orders/store";
import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { ROUTES } from "@/config/routes";
import AuthGuard from "@/lib/auth/auth-guard";
import Loader from "@/components/ui/loader";
import type { Order, OrderItem } from "@/types/order";
import type { Product } from "@/types/product";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  delivered:  { bg: "bg-emerald-50",  text: "text-emerald-700",  dot: "bg-emerald-500" },
  cancelled:  { bg: "bg-red-50",      text: "text-red-600",      dot: "bg-red-500" },
  shipped:    { bg: "bg-blue-50",     text: "text-blue-700",     dot: "bg-blue-500" },
  processing: { bg: "bg-purple-50",   text: "text-purple-700",   dot: "bg-purple-500" },
  pending:    { bg: "bg-amber-50",    text: "text-amber-700",    dot: "bg-amber-400" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function ProductThumb({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-accent)] text-[var(--muted)]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }
  return (
    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--card-border)]">
      <Image src={src} alt={alt} fill className="object-cover" unoptimized />
    </div>
  );
}

// Enrich a single order's items with product names/images
async function enrichOrder(order: Order): Promise<Order> {
  const enriched = await Promise.allSettled(
    order.items.map((item: OrderItem) =>
      api
        .get<Product>(ENDPOINTS.PRODUCT(item.product_id))
        .then((r) => ({
          ...item,
          product_name: r.data.name,
          product_image_url: r.data.image_url,
        }))
        .catch(() => item),
    ),
  );
  return {
    ...order,
    items: enriched.map((r) => (r.status === "fulfilled" ? r.value : order.items[0])),
  };
}

function OrderCard({ order }: { order: Order }) {
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;
  const firstName = firstItem?.product_name ?? `Product #${firstItem?.product_id}`;

  return (
    <Link href={ROUTES.ORDER_DETAIL(order.id)}>
      <div className="fc-card fc-reveal group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--card-border)] bg-[var(--bg-accent)] px-5 py-3">
          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <span>
              ORDER <span className="font-semibold text-[var(--text)]">#{order.id}</span>
            </span>
            <span>·</span>
            <span>{formatDate(order.created_at)}</span>
            <span>·</span>
            <span>
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </span>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Body */}
        <div className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <ProductThumb src={firstItem?.product_image_url} alt={firstName} />
            <div>
              <p className="font-semibold text-[var(--text)] line-clamp-1">{firstName}</p>
              {extraCount > 0 && (
                <p className="mt-0.5 text-sm text-[var(--muted)]">
                  + {extraCount} more item{extraCount !== 1 ? "s" : ""}
                </p>
              )}
              <p className="mt-1 text-xs text-[var(--muted)]">
                Qty: {firstItem?.quantity}
                {firstItem?.price_at_purchase
                  ? ` · ${formatCurrency(firstItem.price_at_purchase)} each`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-[var(--muted)]">Order Total</p>
            <p className="text-xl font-bold text-[var(--primary)]">
              {formatCurrency(order.total_amount)}
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
              View Details →
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function OrdersContent() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const isLoading = useOrderStore((s) => s.isLoading);
  const fetchUserOrders = useOrderStore((s) => s.fetchUserOrders);
  const [enrichedOrders, setEnrichedOrders] = useState<Order[]>([]);
  const [enriching, setEnriching] = useState(false);

  useEffect(() => {
    if (user) fetchUserOrders(user.id, 0, 50);
  }, [user, fetchUserOrders]);

  // Enrich all orders with product details after they load
  useEffect(() => {
    if (orders.length === 0) { setEnrichedOrders([]); return; }
    setEnriching(true);
    Promise.all(orders.map(enrichOrder)).then((result) => {
      setEnrichedOrders(result);
      setEnriching(false);
    });
  }, [orders]);

  if (isLoading || enriching) return <Loader />;

  const displayOrders = enrichedOrders.length ? enrichedOrders : orders;

  return (
    <main className="fc-page-wrap py-10">
      <div className="flex items-baseline justify-between fc-reveal">
        <h1 className="fc-display text-4xl text-[var(--primary)]">YOUR ORDERS</h1>
        <span className="text-sm text-[var(--muted)]">
          {displayOrders.length} order{displayOrders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {displayOrders.length === 0 ? (
        <div className="fc-card fc-reveal mt-8 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-accent)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--muted)]">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <p className="font-semibold text-[var(--text)]">No orders yet</p>
          <p className="mt-1 text-sm text-[var(--muted)]">You haven&apos;t placed any orders yet.</p>
          <Link
            href={ROUTES.PRODUCTS}
            className="mt-5 inline-block rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-strong)] transition-colors"
          >
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {displayOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}
