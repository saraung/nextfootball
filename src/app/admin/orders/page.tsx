"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { ROUTES } from "@/config/routes";
import type { Order, OrderItem } from "@/types/order";
import type { Product } from "@/types/product";
import { formatCurrency, formatDate, formatDateShort } from "@/lib/utils/format";
import { useOrderStore } from "@/features/orders/store";
import AuthGuard from "@/lib/auth/auth-guard";
import Loader from "@/components/ui/loader";
import Button from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils/helpers";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  delivered:  { pill: "bg-emerald-50 text-emerald-700",  dot: "bg-emerald-500" },
  cancelled:  { pill: "bg-red-50 text-red-600",          dot: "bg-red-500" },
  shipped:    { pill: "bg-blue-50 text-blue-700",        dot: "bg-blue-500" },
  processing: { pill: "bg-purple-50 text-purple-700",   dot: "bg-purple-500" },
  pending:    { pill: "bg-amber-50 text-amber-700",      dot: "bg-amber-400" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function enrichOrderItems(order: Order): Promise<Order> {
  const results = await Promise.allSettled(
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
    items: results.map((r, i) => (r.status === "fulfilled" ? r.value : order.items[i])),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function ItemRow({ item }: { item: OrderItem }) {
  const name = item.product_name ?? `Product #${item.product_id}`;
  const subtotal = item.price_at_purchase * item.quantity;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--card-border)] last:border-0">
      {/* Thumbnail */}
      {item.product_image_url ? (
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--card-border)]">
          <Image src={item.product_image_url} alt={name} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--bg-accent)] text-[var(--muted)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <p className="font-medium text-[var(--text)] text-sm truncate">{name}</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {formatCurrency(item.price_at_purchase)} × {item.quantity}
          </p>
          <Link
            href={ROUTES.PRODUCT_DETAIL(item.product_id)}
            target="_blank"
            className="text-xs text-[var(--primary)] hover:underline"
          >
            View product →
          </Link>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-[var(--muted)]">Subtotal</p>
          <p className="font-semibold text-sm text-[var(--text)]">{formatCurrency(subtotal)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Panel (slide-over) ────────────────────────────────────────────────

interface DetailPanelProps {
  order: Order | null;
  enrichedOrder: Order | null;
  enriching: boolean;
  newStatus: string;
  saving: boolean;
  error: string | null;
  onStatusChange: (s: string) => void;
  onSave: () => void;
  onClose: () => void;
}

function DetailPanel({
  order,
  enrichedOrder,
  enriching,
  newStatus,
  saving,
  error,
  onStatusChange,
  onSave,
  onClose,
}: DetailPanelProps) {
  if (!order) return null;

  const displayOrder = enrichedOrder ?? order;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-[var(--card)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] px-6 py-4">
          <div>
            <h2 className="fc-display text-xl text-[var(--text)]">Order #{order.id}</h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Placed on {formatDate(order.created_at)}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--bg-accent)] hover:text-[var(--text)] transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Order meta */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--bg-accent)] p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Customer (User ID)</span>
              <span className="font-semibold text-[var(--text)]">{order.user_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Order date</span>
              <span className="font-medium text-[var(--text)]">{formatDateShort(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Last updated</span>
              <span className="font-medium text-[var(--text)]">{formatDateShort(order.updated_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Current status</span>
              <StatusPill status={order.status} />
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
              Items ({displayOrder.items.length})
            </h3>
            {enriching ? (
              <div className="flex items-center justify-center py-8 text-[var(--muted)]">
                <svg className="h-5 w-5 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading product details…
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4">
                {displayOrder.items.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Order total */}
          <div className="rounded-xl border border-[var(--card-border)] p-4">
            <div className="space-y-1.5 text-sm">
              {displayOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between text-[var(--muted)]">
                  <span className="truncate pr-2">
                    {item.product_name ?? `Product #${item.product_id}`} × {item.quantity}
                  </span>
                  <span className="flex-shrink-0">{formatCurrency(item.price_at_purchase * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[var(--card-border)] pt-3">
              <span className="text-sm font-medium text-[var(--muted)]">Order Total</span>
              <span className="text-xl font-bold text-[var(--primary)]">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {/* Update status */}
          <div className="rounded-xl border border-[var(--card-border)] p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text)]">Update Status</h3>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
            <select
              value={newStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <Button className="w-full" onClick={onSave} loading={saving} disabled={newStatus === order.status}>
              {newStatus === order.status ? "No changes" : `Set to ${newStatus}`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main admin content ────────────────────────────────────────────────────────

function AdminOrdersContent() {
  const orders = useOrderStore((s) => s.orders);
  const loading = useOrderStore((s) => s.isLoading);
  const fetchAllOrders = useOrderStore((s) => s.fetchAllOrders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [enrichedOrder, setEnrichedOrder] = useState<Order | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter/search state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAllOrders(0, 200);
  }, [fetchAllOrders]);

  // Enrich items when an order is selected
  useEffect(() => {
    if (!selectedOrder) { setEnrichedOrder(null); return; }
    setEnriching(true);
    enrichOrderItems(selectedOrder).then((enriched) => {
      setEnrichedOrder(enriched);
      setEnriching(false);
    });
  }, [selectedOrder]);

  function openOrder(order: Order) {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setError(null);
  }

  function closePanel() {
    setSelectedOrder(null);
    setEnrichedOrder(null);
    setError(null);
  }

  const handleUpdateStatus = useCallback(async () => {
    if (!selectedOrder) return;
    setSaving(true);
    setError(null);
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      // Update local selected order so panel reflects new status immediately
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setSaving(false);
  }, [selectedOrder, newStatus, updateOrderStatus]);

  // Filtered orders
  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search ||
      String(o.id).includes(search) ||
      String(o.user_id).includes(search);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && orders.length === 0) return <Loader />;

  return (
    <main className="fc-page-wrap py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 fc-reveal">
        <div>
          <h1 className="fc-display text-4xl text-[var(--primary)]">MANAGE ORDERS</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{orders.length} total orders</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => fetchAllOrders(0, 200)} loading={loading}>
          ↻ Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3 fc-reveal">
        <input
          type="text"
          placeholder="Search by order ID or user ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="fc-card mt-4 overflow-x-auto fc-reveal">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-xs text-[var(--muted)] uppercase tracking-wider">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">User ID</th>
              <th className="p-4 font-medium">Items</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[var(--card-border)] hover:bg-[var(--bg-accent)] transition-colors cursor-pointer"
                onClick={() => openOrder(order)}
              >
                <td className="p-4 font-semibold text-[var(--text)]">#{order.id}</td>
                <td className="p-4 text-[var(--muted)]">{order.user_id}</td>
                <td className="p-4 text-[var(--muted)]">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                <td className="p-4 font-semibold text-[var(--primary)]">
                  {formatCurrency(order.total_amount)}
                </td>
                <td className="p-4">
                  <StatusPill status={order.status} />
                </td>
                <td className="p-4 text-[var(--muted)]">{formatDateShort(order.created_at)}</td>
                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="outline" onClick={() => openOrder(order)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-[var(--muted)]">
            {orders.length === 0 ? "No orders found." : "No orders match your filters."}
          </p>
        )}
      </div>

      {/* Detail Panel */}
      <DetailPanel
        order={selectedOrder}
        enrichedOrder={enrichedOrder}
        enriching={enriching}
        newStatus={newStatus}
        saving={saving}
        error={error}
        onStatusChange={setNewStatus}
        onSave={handleUpdateStatus}
        onClose={closePanel}
      />
    </main>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  return (
    <AuthGuard requireSuperuser>
      <AdminOrdersContent />
    </AuthGuard>
  );
}
