"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useOrderStore } from "@/features/orders/store";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { ROUTES } from "@/config/routes";
import AuthGuard from "@/lib/auth/auth-guard";
import Loader from "@/components/ui/loader";
import Button from "@/components/ui/button";

function OrderDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const order = useOrderStore((s) => s.currentOrder);
  const isLoading = useOrderStore((s) => s.isLoading);
  const error = useOrderStore((s) => s.error);
  const fetchOrder = useOrderStore((s) => s.fetchOrder);

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id, fetchOrder]);

  if (isLoading) return <Loader />;

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

  return (
    <main className="fc-page-wrap py-10">
      <Link
        href={ROUTES.ORDERS}
        className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </Link>

      <div className="fc-card fc-reveal p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="fc-display text-3xl text-[var(--text)]">
              ORDER #{order.id}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-wider ${
              order.status === "delivered"
                ? "bg-emerald-50 text-emerald-700"
                : order.status === "cancelled"
                  ? "bg-red-50 text-red-600"
                  : "bg-amber-50 text-amber-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Items Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
                <th className="pb-3 font-medium">Product ID</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium text-right">Price</th>
                <th className="pb-3 font-medium text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--card-border)]">
                  <td className="py-3 text-[var(--text)]">#{item.product_id}</td>
                  <td className="py-3 text-[var(--text)]">{item.quantity}</td>
                  <td className="py-3 text-right text-[var(--muted)]">
                    {formatCurrency(item.price_at_purchase)}
                  </td>
                  <td className="py-3 text-right font-semibold text-[var(--text)]">
                    {formatCurrency(item.price_at_purchase * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <p className="text-sm text-[var(--muted)]">Total Amount</p>
            <p className="text-3xl font-bold text-[var(--primary)]">
              {formatCurrency(order.total_amount)}
            </p>
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
