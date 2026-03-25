"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Order } from "@/types/order";
import { formatCurrency, formatDateShort } from "@/lib/utils/format";
import AuthGuard from "@/lib/auth/auth-guard";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils/helpers";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
  shipped: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  pending: "bg-amber-50 text-amber-700",
};

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      // No global GET /orders/ endpoint exists — fetch all users first,
      // then get each user's orders in parallel and combine.
      const { data: users } = await api.get<{ id: number }[]>("/users/", {
        params: { skip: 0, limit: 200 },
      });
      const perUser = await Promise.all(
        users.map((u) =>
          api
            .get<Order[]>(`/orders/user/${u.id}`, { params: { skip: 0, limit: 100 } })
            .then((r) => r.data)
            .catch(() => [] as Order[]),
        ),
      );
      const all = perUser.flat().sort((a, b) => b.id - a.id);
      setOrders(all);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openOrder(order: Order) {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setError(null);
  }

  async function handleUpdateStatus() {
    if (!selectedOrder) return;
    setSaving(true);
    setError(null);
    try {
      await api.patch(ENDPOINTS.ORDER(selectedOrder.id), { status: newStatus });
      setSelectedOrder(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setSaving(false);
  }

  if (loading) return <Loader />;

  return (
    <main className="fc-page-wrap py-10">
      <div className="flex items-center justify-between fc-reveal">
        <h1 className="fc-display text-4xl text-[var(--primary)]">
          MANAGE ORDERS
        </h1>
        <span className="text-sm text-[var(--muted)]">{orders.length} orders total</span>
      </div>

      <div className="fc-card mt-6 overflow-x-auto fc-reveal">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[var(--card-border)] hover:bg-[var(--bg-accent)] transition-colors"
              >
                <td className="p-4 text-[var(--text)]">#{order.id}</td>
                <td className="p-4 text-[var(--muted)]">{order.user_id}</td>
                <td className="p-4">{order.items.length}</td>
                <td className="p-4 font-semibold text-[var(--primary)]">
                  {formatCurrency(order.total_amount)}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                      STATUS_STYLES[order.status] ?? "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-[var(--muted)]">
                  {formatDateShort(order.created_at)}
                </td>
                <td className="p-4 text-right">
                  <Button size="sm" variant="outline" onClick={() => openOrder(order)}>
                    Update Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="py-12 text-center text-[var(--muted)]">No orders found.</p>
        )}
      </div>

      {/* Update Status Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.id}`}
      >
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[var(--muted)]">
              User ID: <span className="font-semibold text-[var(--text)]">{selectedOrder?.user_id}</span>
            </p>
            <p className="text-sm text-[var(--muted)] mt-1">
              Total: <span className="font-semibold text-[var(--primary)]">{selectedOrder && formatCurrency(selectedOrder.total_amount)}</span>
            </p>
            <p className="text-sm text-[var(--muted)] mt-1">
              Items: <span className="font-semibold text-[var(--text)]">{selectedOrder?.items.length}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1">
              Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSelectedOrder(null)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} loading={saving}>Update</Button>
        </div>
      </Modal>
    </main>
  );
}

export default function AdminOrdersPage() {
  return (
    <AuthGuard requireSuperuser>
      <AdminOrdersContent />
    </AuthGuard>
  );
}
