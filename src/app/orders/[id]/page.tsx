"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useOrderStore } from "@/features/orders/store";
import { useAuthStore } from "@/features/auth/store";
import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { ROUTES } from "@/config/routes";
import AuthGuard from "@/lib/auth/auth-guard";
import Loader from "@/components/ui/loader";
import Button from "@/components/ui/button";
import type { Order, OrderItem } from "@/types/order";
import type { Product } from "@/types/product";

// ─── Status tracker ───────────────────────────────────────────────────────────

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  processing: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  shipped: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 4v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  delivered: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

function StatusTracker({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-500">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const activeIdx = STATUS_STEPS.indexOf(status as typeof STATUS_STEPS[number]);

  return (
    <div className="relative">
      {/* Connector line */}
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-[var(--card-border)]" style={{ marginLeft: "calc(12.5% - 1px)", marginRight: "calc(12.5% - 1px)" }} />
      {/* Progress line */}
      {activeIdx > 0 && (
        <div
          className="absolute top-5 h-0.5 bg-[var(--primary)] transition-all duration-500"
          style={{
            left: `calc(12.5%)`,
            width: `calc(${(activeIdx / (STATUS_STEPS.length - 1)) * 75}%)`,
          }}
        />
      )}
      <div className="relative flex justify-between">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx <= activeIdx;
          const active = idx === activeIdx;
          return (
            <div key={step} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--card-border)] bg-[var(--card)] text-[var(--muted)]"
                } ${active ? "ring-4 ring-[var(--primary)] ring-opacity-20" : ""}`}
              >
                {STATUS_ICONS[step]}
              </div>
              <p className={`text-xs font-medium text-center ${done ? "text-[var(--primary)]" : "text-[var(--muted)]"}`}>
                {STATUS_LABELS[step]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Product row ──────────────────────────────────────────────────────────────

function ItemRow({ item }: { item: OrderItem }) {
  const name = item.product_name ?? `Product #${item.product_id}`;
  const subtotal = item.price_at_purchase * item.quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-[var(--card-border)] last:border-0">
      {/* Thumbnail */}
      {item.product_image_url ? (
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--card-border)]">
          <Image src={item.product_image_url} alt={name} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-accent)] text-[var(--muted)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      )}

      {/* Details */}
      <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-[var(--text)]">{name}</p>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {formatCurrency(item.price_at_purchase)} × {item.quantity}
          </p>
          <Link
            href={ROUTES.PRODUCT_DETAIL(item.product_id)}
            className="mt-1 inline-block text-xs text-[var(--primary)] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View product →
          </Link>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--muted)]">Subtotal</p>
          <p className="text-lg font-bold text-[var(--text)]">{formatCurrency(subtotal)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function enrichOrderItems(order: Order): Promise<Order> {
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
    items: enriched.map((r, i) => (r.status === "fulfilled" ? r.value : order.items[i])),
  };
}

function OrderDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const storeOrder = useOrderStore((s) => s.currentOrder);
  const isLoading = useOrderStore((s) => s.isLoading);
  const error = useOrderStore((s) => s.error);
  const fetchOrder = useOrderStore((s) => s.fetchOrder);
  const cancelOrder = useOrderStore((s) => s.cancelOrder);
  const user = useAuthStore((s) => s.user);

  const [order, setOrder] = useState<Order | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id, fetchOrder]);

  // Enrich with product details once fetched
  useEffect(() => {
    if (!storeOrder) { setOrder(null); return; }
    setEnriching(true);
    enrichOrderItems(storeOrder).then((enriched) => {
      setOrder(enriched);
      setEnriching(false);
    });
  }, [storeOrder]);

  async function handleCancel() {
    if (!order) return;
    setCancelling(true);
    await cancelOrder(order.id);
    await fetchOrder(id);
    setCancelling(false);
  }

  if (isLoading || enriching) return <Loader />;

  if (error) {
    return (
      <main className="fc-page-wrap py-16 text-center">
        <div className="fc-card inline-block p-8">
          <p className="text-red-500">{error}</p>
          <Link href={ROUTES.ORDERS} className="mt-4 inline-block text-[var(--primary)] hover:underline">
            ← Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  if (!order) return null;

  const canCancel = order.status === "pending" && user?.id === order.user_id;

  return (
    <main className="fc-page-wrap py-10">
      {/* Back */}
      <Link
        href={ROUTES.ORDERS}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to My Orders
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left / Main column ── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Status Tracker */}
          <div className="fc-card fc-reveal p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="fc-display text-2xl text-[var(--text)]">Order #{order.id}</h1>
                <p className="text-sm text-[var(--muted)] mt-0.5">Placed on {formatDate(order.created_at)}</p>
              </div>
              {canCancel && (
                <Button variant="outline" size="sm" onClick={handleCancel} loading={cancelling}
                  className="border-red-300 text-red-600 hover:bg-red-50">
                  Cancel Order
                </Button>
              )}
            </div>
            <StatusTracker status={order.status} />
          </div>

          {/* Items */}
          <div className="fc-card fc-reveal p-6">
            <h2 className="font-semibold text-[var(--text)] mb-2">
              Items ({order.items.length})
            </h2>
            <div>
              {order.items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right / Summary column ── */}
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="fc-card fc-reveal p-6">
            <h2 className="font-semibold text-[var(--text)] mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-[var(--muted)]">
                  <span className="line-clamp-1 pr-2">
                    {item.product_name ?? `Product #${item.product_id}`} × {item.quantity}
                  </span>
                  <span className="flex-shrink-0">{formatCurrency(item.price_at_purchase * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-[var(--card-border)] pt-4 flex justify-between items-center">
              <span className="text-sm font-medium text-[var(--muted)]">Total</span>
              <span className="text-2xl font-bold text-[var(--primary)]">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>

          {/* Order Info */}
          <div className="fc-card fc-reveal p-6">
            <h2 className="font-semibold text-[var(--text)] mb-4">Order Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Order ID</span>
                <span className="font-medium text-[var(--text)]">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Date Placed</span>
                <span className="font-medium text-[var(--text)]">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Status</span>
                <span className={`font-semibold capitalize ${
                  order.status === "delivered" ? "text-emerald-600" :
                  order.status === "cancelled" ? "text-red-500" :
                  order.status === "shipped" ? "text-blue-600" : "text-amber-600"
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Items</span>
                <span className="font-medium text-[var(--text)]">{order.items.length}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="fc-card fc-reveal p-6">
            <h2 className="font-semibold text-[var(--text)] mb-4">Shipping</h2>
            <div className="flex items-start gap-3 text-sm text-[var(--muted)]">
              <svg className="mt-0.5 flex-shrink-0 text-[var(--primary)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--text)]">Standard Delivery</p>
                {order.shipping_address ? (
                  <p className="mt-1 break-words">{order.shipping_address}</p>
                ) : (
                  <p className="mt-0.5">
                    {order.status === "delivered"
                      ? "Your order has been delivered."
                      : order.status === "shipped"
                      ? "Your order is on the way!"
                      : order.status === "cancelled"
                      ? "Order was cancelled."
                      : "Estimated 3–5 business days after dispatch."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderDetailPage() {
  return (
    <AuthGuard>
      <OrderDetailContent />
    </AuthGuard>
  );
}
