"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore, peso, type Order } from "@/lib/store";
import StatusTimeline from "@/components/StatusTimeline";

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { user } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await fetch("/api/orders").then((r) => r.json());
      const found = (d.orders || []).find((o: Order) => o.id === Number(id));
      if (found) {
        setOrder(found);
        return;
      }
    } catch {}
    try {
      const cached = sessionStorage.getItem(`paso_order_${id}`);
      if (cached) setOrder(JSON.parse(cached));
    } catch {}
  }, [id]);

  useEffect(() => {
    load().finally(() => setLoaded(true));
  }, [load]);

  useEffect(() => {
    if (!user) return;
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [user, load]);

  if (!loaded)
    return (
      <main className="max-w-3xl mx-auto px-4 py-20">
        <div className="card p-10 animate-pulse h-64" style={{ background: "var(--surface2)" }} />
      </main>
    );

  if (!order)
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🫕</p>
        <h1 className="font-display text-3xl font-bold">Hindi mahanap ang order.</h1>
        <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
          Baka guest order ito sa ibang device. I-check ang My Orders kapag naka-login.
        </p>
        <Link href="/menu" className="btn btn-brand px-8 py-3.5 mt-6">Balik sa Menu</Link>
      </main>
    );

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center fade-up">
        <div
          className="inline-flex p-6 rounded-full pop-in"
          style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}
        >
          <span className="text-6xl"></span>
        </div>
        <div className="steam text-2xl mt-1" style={{ color: "var(--muted)" }} aria-hidden>
          <span>~</span> <span>~</span> <span>~</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3">
          Salamat! Naihain na ang order mo.
        </h1>
        <p className="font-display text-2xl font-bold mt-2" style={{ color: "var(--brand)" }}>
          Order #{order.number}
        </p>
        <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
          {order.payment === "gcash" ? "Bayad via GCash ✅" : "Cash on Delivery 💵"} ·
          Papunta sa: {order.address}
        </p>
      </div>

      <div className="card p-7 mt-8">
        <h2 className="font-display text-xl font-bold mb-6 text-center">
          Ang journey ng pagkain mo
        </h2>
        <StatusTimeline status={order.status} />
        {user && (
          <p className="text-xs font-bold text-center mt-5" style={{ color: "var(--muted)" }}>
            🔴 Live — nag-a-update kapag ginalaw ng kitchen ang status.
          </p>
        )}
      </div>

      <div className="card p-7 mt-6">
        <h2 className="font-display text-xl font-bold mb-4">Mga inihain</h2>
        {(order.items || []).map((i) => (
          <div key={i.id} className="flex justify-between font-bold text-sm py-1.5">
            <span>{i.qty}× {i.name}</span>
            <span>{peso(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="h-px my-3" style={{ background: "var(--line)" }} />
        <div className="flex justify-between text-sm font-bold" style={{ color: "var(--muted)" }}>
          <span>Shipping</span>
          <span>{peso(order.deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-display text-2xl font-bold mt-2">
          <span>Kabuuan</span>
          <span>{peso(order.total)}</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link href="/orders" className="btn btn-brand px-8 py-3.5">
          📦 I-track sa My Orders
        </Link>
        <Link href="/menu" className="btn btn-outline px-8 py-3.5">
          Order Ulit
        </Link>
      </div>
      {!user && (
        <p className="text-center text-sm font-bold mt-5" style={{ color: "var(--muted)" }}>
          Tip: <Link href="/auth" className="underline" style={{ color: "var(--brand)" }}>Gumawa ng account</Link> para
          ma-track at makatanggap ng abiso sa susunod na order!
        </p>
      )}
    </main>
  );
}