"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";

export default function ProfilePage() {
  const { user, setUser, authLoaded, logout, toast } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone, address: user.address });
  }, [user]);

  if (authLoaded && !user)
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-7xl mb-4">🪪</p>
        <h1 className="font-display text-3xl font-bold">Sign in para sa profile mo.</h1>
        <Link href="/auth" className="btn btn-brand px-9 py-4 mt-6 text-lg">Sign In</Link>
      </main>
    );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-profile", ...form }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setUser(d.user);
      toast("✅ Na-update ang profile mo!");
    } catch {
      toast("May problema sa pag-save. Subukan ulit.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <p className="chip" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
        ang iyong kwento
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3">Profile 🪪</h1>
      {user && (
        <div className="card p-7 mt-8">
          <div className="flex items-center gap-4">
            <span className="p-4 rounded-full" style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}>
              <UserRound size={30} />
            </span>
            <div>
              <p className="font-display text-2xl font-bold">{user.name}</p>
              <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                {user.email} · miyembro ng PASO 🌿
              </p>
            </div>
          </div>
          <form onSubmit={save} className="space-y-3 mt-6">
            <label className="block text-sm font-bold">Pangalan</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="block text-sm font-bold">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <label className="block text-sm font-bold">Default delivery address</label>
            <textarea className="input min-h-24" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <button className="btn btn-brand w-full py-3.5" disabled={busy}>
              {busy ? "Sine-save…" : "I-save ang Changes"}
            </button>
          </form>
          <button
            className="btn btn-outline w-full py-3.5 mt-3"
            onClick={async () => {
              await logout();
              router.push("/auth");
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </main>
  );
}