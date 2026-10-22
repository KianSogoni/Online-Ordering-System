"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { useStore, peso, type Order } from "@/lib/store";
import StatusTimeline from "@/components/StatusTimeline";

const STATUS_COLOR: Record<string, { bg: string; fg: string }> = {
  Pending: { bg: "var(--surface2)", fg: "var(--muted)" },
  Preparing: { bg: "#fff0d6", fg: "#9a6a10" },
  "Out for Delivery": { bg: "#e0efff", fg: "#1b5faa" },
  Delivered: { bg: "var(--leaf-soft)", fg: "var(--leaf)" },
};

export default function MyOrders() {
  const { user, authLoaded, toast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = async (manual = false) => {
    try {
      const d = await fetch("/api/orders").then((r) => r.json());
      setOrders(d.orders || []);
      if (manual) toast("🔄 Na-refresh ang mga order mo!");
    } catch {
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoaded(true);
      return;
    }
    load();
    const t = setInterval(() => load(), 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (authLoaded && !user)
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-7xl mb-4">🔐</p>
        <h1 className="font-display text-3xl font-bold">Sign in para makita ang orders mo.</h1>
        <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
          Dito mo ma-track mula Pending hanggang Delivered.
        </p>
        <Link href="/auth" className="btn btn-brand px-9 py-4 mt-6 text-lg">Sign In</Link>
      </main>
    );

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="chip" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
            aking order
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3">My Orders 📦</h1>
        </div>
        <button className="btn btn-ghost px-5 py-2.5" onClick={() => load(true)}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {!loaded ? (
        <div className="card p-10 mt-8 animate-pulse h-48" style={{ background: "var(--surface2)" }} />
      ) : orders.length === 0 ? (
        <div className="card p-14 text-center mt-8">
          <p className="text-7xl mb-4">🍽️</p>
          <p className="font-display text-2xl font-bold">Wala ka pang order.</p>
          <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
            Ang banga, umuusok na. Ikaw na lang ang hinihintay.
          </p>
          <Link href="/menu" className="btn btn-brand px-9 py-4 mt-6 text-lg">Order Now</Link>
        </div>
      ) : (
        <div className="space-y-6 mt-8">
          {orders.map((o) => {
            const c = STATUS_COLOR[o.status] || STATUS_COLOR.Pending;
            return (
              <div key={o.id} className="card p-6 sm:p-7">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <Link
                      href={`/order/${o.id}`}
                      className="font-display text-2xl font-bold underline-offset-4 hover:underline"
                      style={{ color: "var(--brand)" }}
                    >
                      #{o.number}
                    </Link>
                    <p className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                      {new Date(o.createdAt).toLocaleString("en-PH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}{" "}
                      · {o.payment === "gcash" ? "GCash" : "COD"}
                    </p>
                  </div>
                  <span className="chip" style={{ background: c.bg, color: c.fg }}>
                    {o.status}
                  </span>
                </div>
                <div className="mt-6">
                  <StatusTimeline status={o.status} />
                </div>
                <div className="mt-5 pt-4 flex justify-between items-center flex-wrap gap-2" style={{ borderTop: "2px solid var(--line)" }}>
                  <p className="text-sm font-bold" style={{ color: "var(--muted)" }}>
                    {(o.items || []).map((i) => `${i.qty}× ${i.name}`).join(" · ")}
                  </p>
                  <p className="font-display text-xl font-bold">{peso(o.total)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}