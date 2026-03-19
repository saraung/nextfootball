"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";
import { useOrderStore } from "@/features/orders/store";
import { formatCurrency, formatDateShort } from "@/lib/utils/format";
import { ROUTES } from "@/config/routes";
import AuthGuard from "@/lib/auth/auth-guard";
import Loader from "@/components/ui/loader";

function OrdersContent() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const isLoading = useOrderStore((s) => s.isLoading);
  const fetchUserOrders = useOrderStore((s) => s.fetchUserOrders);

  useEffect(() => {
    if (user) fetchUserOrders(user.id);
  }, [user, fetchUserOrders]);

  if (isLoading) return <Loader />;

  return (
    <main className="fc-page-wrap py-10">
      <h1 className="fc-display text-4xl text-[var(--primary)] fc-reveal">
        YOUR ORDERS
      </h1>

      {orders.length === 0 ? (
        <div className="fc-card fc-reveal mt-8 p-10 text-center">
          <p className="text-[var(--muted)]">You haven&apos;t placed any orders yet.</p>
          <Link
            href={ROUTES.PRODUCTS}
            className="mt-4 inline-block font-semibold text-[var(--primary)] hover:underline"
          >
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={ROUTES.ORDER_DETAIL(order.id)}>
              <div className="fc-card fc-reveal p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform cursor-pointer">
                <div>
                  <p className="font-semibold text-[var(--text)]">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-0.5">
                    {formatDateShort(order.created_at)} · {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--primary)]">
                    {formatCurrency(order.total_amount)}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
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
              </div>
            </Link>
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
