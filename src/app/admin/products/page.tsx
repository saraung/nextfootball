"use client";

import { useEffect, useState } from "react";
import { getProductsAPI, createProductAPI, updateProductAPI, deleteProductAPI } from "@/features/products/api";
import type { Product, ProductCreate } from "@/types/product";
import { formatCurrency, formatDateShort } from "@/lib/utils/format";
import AuthGuard from "@/lib/auth/auth-guard";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Loader from "@/components/ui/loader";
import { getErrorMessage } from "@/lib/utils/helpers";

function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await getProductsAPI(0, 100);
      setProducts(data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setImageUrl("");
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setName(p.name);
    setDescription(p.description ?? "");
    setPrice(String(p.price));
    setStock(String(p.stock_quantity));
    setImageUrl(p.image_url ?? "");
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    setFormError(null);
    if (!name || !price || !stock) {
      setFormError("Name, price, and stock are required");
      return;
    }
    setSaving(true);
    try {
      const body: ProductCreate = {
        name,
        description: description || null,
        price: Number(price),
        stock_quantity: Number(stock),
        image_url: imageUrl || null,
      };
      if (editing) {
        await updateProductAPI(editing.id, body);
      } else {
        await createProductAPI(body);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteProductAPI(deleting.id);
      setDeleting(null);
      load();
    } catch { /* ignore */ }
  }

  if (loading) return <Loader />;

  return (
    <main className="fc-page-wrap py-10">
      <div className="flex items-center justify-between fc-reveal">
        <h1 className="fc-display text-4xl text-[var(--primary)]">
          MANAGE PRODUCTS
        </h1>
        <Button onClick={openCreate}>+ New Product</Button>
      </div>

      {/* Table */}
      <div className="fc-card mt-6 overflow-x-auto fc-reveal">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Active</th>
              <th className="p-4 font-medium">Created</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[var(--card-border)] hover:bg-[var(--bg-accent)] transition-colors">
                <td className="p-4 text-[var(--text)]">{p.id}</td>
                <td className="p-4 font-semibold text-[var(--text)]">{p.name}</td>
                <td className="p-4 text-[var(--primary)]">{formatCurrency(p.price)}</td>
                <td className="p-4">{p.stock_quantity}</td>
                <td className="p-4">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-red-400"}`} />
                </td>
                <td className="p-4 text-[var(--muted)]">{formatDateShort(p.created_at)}</td>
                <td className="p-4 text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleting(p)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Product" : "New Product"}
      >
        {formError && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}
        <div className="space-y-3">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <Input label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>
          <Input label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>
            {editing ? "Update" : "Create"}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Product"
      >
        <p className="text-[var(--muted)]">
          Are you sure you want to delete <strong>{deleting?.name}</strong>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </main>
  );
}

export default function AdminProductsPage() {
  return (
    <AuthGuard requireSuperuser>
      <AdminProductsContent />
    </AuthGuard>
  );
}
