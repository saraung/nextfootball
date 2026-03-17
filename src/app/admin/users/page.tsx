"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { User, UserUpdate } from "@/types/user";
import AuthGuard from "@/lib/auth/auth-guard";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Loader from "@/components/ui/loader";
import { getErrorMessage } from "@/lib/utils/helpers";

function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<User[]>(ENDPOINTS.USERS, {
        params: { skip: 0, limit: 100 },
      });
      setUsers(data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openEdit(u: User) {
    setEditing(u);
    setEmail(u.email);
    setIsActive(u.is_active);
    setIsSuperuser(u.is_superuser);
    setFormError(null);
  }

  async function handleSave() {
    if (!editing) return;
    setFormError(null);
    setSaving(true);
    try {
      const body: UserUpdate = { email, is_active: isActive, is_superuser: isSuperuser };
      await api.put(ENDPOINTS.USER(editing.id), body);
      setEditing(null);
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await api.delete(ENDPOINTS.USER(deleting.id));
      setDeleting(null);
      load();
    } catch { /* ignore */ }
  }

  if (loading) return <Loader />;

  return (
    <main className="fc-page-wrap py-10">
      <h1 className="fc-display text-4xl text-[var(--primary)] fc-reveal">
        MANAGE USERS
      </h1>

      <div className="fc-card mt-6 overflow-x-auto fc-reveal">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Active</th>
              <th className="p-4 font-medium">Superuser</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--card-border)] hover:bg-[var(--bg-accent)] transition-colors">
                <td className="p-4 text-[var(--text)]">{u.id}</td>
                <td className="p-4 font-semibold text-[var(--text)]">{u.email}</td>
                <td className="p-4">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-red-400"}`} />
                </td>
                <td className="p-4">
                  {u.is_superuser ? (
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">Admin</span>
                  ) : (
                    <span className="text-[var(--muted)] text-xs">User</span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleting(u)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit User">
        {formError && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}
        <div className="space-y-3">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded accent-[var(--primary)]"
            />
            <span className="text-sm text-[var(--text)]">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSuperuser}
              onChange={(e) => setIsSuperuser(e.target.checked)}
              className="h-4 w-4 rounded accent-[var(--primary)]"
            />
            <span className="text-sm text-[var(--text)]">Superuser</span>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>Update</Button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete User">
        <p className="text-[var(--muted)]">
          Are you sure you want to delete <strong>{deleting?.email}</strong>?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </main>
  );
}

export default function AdminUsersPage() {
  return (
    <AuthGuard requireSuperuser>
      <AdminUsersContent />
    </AuthGuard>
  );
}
