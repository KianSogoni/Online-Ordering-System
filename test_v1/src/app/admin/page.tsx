"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  Settings,
  LogOut,
  PhilippinePeso,
  ShoppingBag,
  Hourglass,
  RefreshCw,
  Store,
} from "lucide-react";
import { useStore, peso, pesoShort, type Product, type Order } from "@/lib/store";

const STATUSES = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
type Tab = "overview" | "products" | "orders" | "settings";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, authLoaded, logout, toast, deliveryFee, refreshSettings } = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feeInput, setFeeInput] = useState("");

  const load = useCallback(async () => {
    try {
      const [p, o] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/orders?all=1").then((r) => r.json()),
      ]);
      setProducts(p.products || []);
      setOrders(o.orders || []);
    } catch {}
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      load();
      const t = setInterval(load, 10000);
      return () => clearInterval(t);
    }
  }, [user, load]);

  useEffect(() => setFeeInput(String(deliveryFee)), [deliveryFee]);

  if (authLoaded && (!user || user.role !== "admin"))
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-12 text-center max-w-md">
          <p className="text-6xl mb-4">👑</p>
          <h1 className="font-display text-3xl font-bold">Store Owners lang dito.</h1>
          <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
            Mag-login gamit ang admin account sa owner portal.
          </p>
          <Link href="/auth" className="btn btn-brand px-8 py-3.5 mt-6">Owner Login</Link>
        </div>
      </main>
    );

  const sales = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "Pending").length;

  const toggleSoldOut = async (p: Product) => {
    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, soldOut: !p.soldOut }),
    });
    if (res.ok) {
      toast(!p.soldOut ? `🚫 ${p.name} — Sold Out na sa menu.` : `✅ ${p.name} — available ulit!`);
      load();
    }
  };

  const setStatus = async (o: Order, status: string) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: o.id, status }),
    });
    if (res.ok) {
      toast(`📦 ${o.number} → ${status}. Naabisuhan ang customer!`);
      load();
    }
  };

  const saveFee = async () => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryFee: Number(feeInput) }),
    });
    if (res.ok) {
      await refreshSettings();
      toast(`🛵 Delivery fee updated: ${pesoShort(Number(feeInput))}. Live na sa checkout!`);
    }
  };

  const tabs: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "Dashboard", icon: LayoutDashboard },
    { key: "products", label: "Products", icon: UtensilsCrossed },
    { key: "orders", label: "Orders", icon: Package },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen">
      <header className="wood">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center gap-4 flex-wrap">
          <div className="mr-auto">
            <p className="font-display text-2xl font-bold lowercase leading-none">pilikart 👑</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">PASO Owner Dashboard</p>
          </div>
          <Link href="/home" className="btn px-4 py-2 text-sm" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
            <Store size={15} /> Tingnan ang Store
          </Link>
          <button
            className="btn px-4 py-2 text-sm"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
            onClick={async () => {
              await logout();
              router.push("/auth");
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="btn px-5 py-2.5"
              style={
                tab === t.key
                  ? { background: "var(--brand)", color: "#fff" }
                  : { background: "var(--surface)", color: "var(--ink)", boxShadow: "var(--shadow)" }
              }
            >
              <t.icon size={16} /> {t.label}
              {t.key === "orders" && pending > 0 && (
                <span className="text-xs rounded-full px-2 py-0.5" style={{ background: tab === t.key ? "#fff" : "var(--brand)", color: tab === t.key ? "var(--brand)" : "#fff" }}>
                  {pending}
                </span>
              )}
            </button>
          ))}
          <button className="btn btn-ghost px-4 py-2.5 ml-auto" onClick={load}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {tab === "overview" && (
          <div className="mt-8 space-y-8">
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { label: "Total Sales", value: peso(sales), icon: PhilippinePeso, bg: "var(--leaf)", note: "lahat ng orders" },
                { label: "Total Orders", value: String(orders.length), icon: ShoppingBag, bg: "var(--brand)", note: "mula pa noong umpisa" },
                { label: "Pending Orders", value: String(pending), icon: Hourglass, bg: "var(--amber)", note: "naghihintay sa kalan" },
              ].map((s) => (
                <div key={s.label} className="card p-6 flex items-center gap-4">
                  <span className="p-4 rounded-2xl text-white" style={{ background: s.bg }}>
                    <s.icon size={26} />
                  </span>
                  <div>
                    <p className="font-display text-3xl font-bold leading-none">{s.value}</p>
                    <p className="font-bold text-sm mt-1">{s.label}</p>
                    <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold mb-4">🔥 Pinakabagong Orders</h2>
              {orders.length === 0 ? (
                <p className="font-semibold text-sm" style={{ color: "var(--muted)" }}>Wala pang orders — amoy adobo pa lang ang meron.</p>
              ) : (
                orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-3 py-3 flex-wrap" style={{ borderBottom: "1px solid var(--line)" }}>
                    <div>
                      <p className="font-display font-bold">{o.number} · {o.customerName}</p>
                      <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                        {(o.items || []).map((i) => `${i.qty}× ${i.name}`).join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{peso(o.total)}</span>
                      <span className="chip" style={{ background: "var(--surface2)", color: "var(--muted)" }}>{o.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="card p-6 mt-8 overflow-x-auto">
            <h2 className="font-display text-xl font-bold mb-4">🍲 Product Management</h2>
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left font-display" style={{ color: "var(--muted)" }}>
                  <th className="py-2 pr-3">Item</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Price</th>
                  <th className="py-2 pr-3">Stock</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid var(--line)" }}>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover" style={{ background: "var(--surface2)" }} />
                        <span className="font-bold">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 font-semibold capitalize">{p.category}</td>
                    <td className="py-3 pr-3 font-bold">{pesoShort(p.price)}</td>
                    <td className="py-3 pr-3 font-bold">{p.stock}</td>
                    <td className="py-3">
                      <button
                        className={`btn px-4 py-2 text-xs ${p.soldOut ? "btn-leaf" : ""}`}
                        style={!p.soldOut ? { background: "#fde8e4", color: "#b3341f" } : undefined}
                        onClick={() => toggleSoldOut(p)}
                      >
                        {p.soldOut ? "✓ Ibalik sa Menu" : "✕ Mark Sold Out"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "orders" && (
          <div className="mt-8 space-y-4">
            {orders.length === 0 && (
              <div className="card p-12 text-center">
                <p className="text-5xl mb-3">📭</p>
                <p className="font-display text-xl font-bold">Wala pang papasok na orders.</p>
              </div>
            )}
            {orders.map((o) => (
              <div key={o.id} className="card p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-display text-xl font-bold" style={{ color: "var(--brand)" }}>
                      {o.number} <span className="text-[var(--ink)]">· {o.customerName}</span>
                    </p>
                    <p className="text-xs font-semibold mt-1" style={{ color: "var(--muted)" }}>
                      {new Date(o.createdAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                      {" · "}{o.payment === "gcash" ? "GCash (paid)" : "COD"}
                      {o.phone ? ` · ${o.phone}` : ""}
                    </p>
                    <p className="text-sm font-semibold mt-2">📍 {o.address}</p>
                    <p className="text-sm font-bold mt-2" style={{ color: "var(--muted)" }}>
                      {(o.items || []).map((i) => `${i.qty}× ${i.name}`).join(" · ")}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-display text-2xl font-bold">{peso(o.total)}</p>
                    <select
                      className="input !w-auto !py-2 font-bold cursor-pointer"
                      value={o.status}
                      onChange={(e) => setStatus(o, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "settings" && (
          <div className="card p-8 mt-8 max-w-lg">
            <h2 className="font-display text-xl font-bold">🛵 Delivery Settings</h2>
            <p className="text-sm font-semibold mt-1" style={{ color: "var(--muted)" }}>
              Ang bagong fee ay agad na makikita sa checkout ng customers.
            </p>
            <label className="block font-bold text-sm mt-5 mb-2">Delivery fee (₱)</label>
            <div className="flex gap-3">
              <input
                className="input font-display font-bold text-lg"
                type="number"
                min={0}
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
              />
              <button className="btn btn-brand px-7" onClick={saveFee}>I-save</button>
            </div>
            <p className="text-sm font-bold mt-4" style={{ color: "var(--leaf)" }}>
              Kasalukuyang fee: {pesoShort(deliveryFee)}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}