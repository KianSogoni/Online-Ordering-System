"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useStore, peso, pesoShort } from "@/lib/store";

export default function CartPage() {
  const { cart, setQty, cartTotal, budget, deliveryFee, clearCart } = useStore();
  const over = budget !== null && cartTotal > budget;
  const pct = budget ? Math.min(100, (cartTotal / budget) * 100) : 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl sm:text-5xl font-bold">
        🧺 Ang Cart Mo
      </h1>
      <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
        Silipin muna bago ihain.
      </p>

      {budget !== null && budget > 0 && cart.length > 0 && (
        <div className="card p-5 mt-6" style={{ border: `2px solid ${over ? "#d33" : "var(--leaf)"}` }}>
          <div className="flex justify-between font-bold text-sm flex-wrap gap-2">
            <span>
              Gastos: {pesoShort(cartTotal)} / Budget: {pesoShort(budget)}
            </span>
            <span style={{ color: over ? "#d33" : "var(--leaf)" }}>
              {over
                ? `⚠️ Lampas ng ${pesoShort(cartTotal - budget)}!`
                : `May natitira pang ${pesoShort(budget - cartTotal)}!`}
            </span>
          </div>
          <div className="h-4 rounded-full overflow-hidden mt-3" style={{ background: "var(--line)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: over
                  ? "linear-gradient(90deg,#e05545,#c22)"
                  : "linear-gradient(90deg,var(--leaf),var(--amber))",
              }}
            />
          </div>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="card p-14 text-center mt-8">
          <p className="text-7xl mb-4">🍃</p>
          <p className="font-display text-2xl font-bold">Walang laman ang cart mo.</p>
          <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
            Amoy mo ba 'yon? Adobo sa banga. Tara na.
          </p>
          <Link href="/menu" className="btn btn-brand px-9 py-4 mt-6 text-lg">
            Pumili sa Menu <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-8 items-start">
          <div className="space-y-4">
            {cart.map((i) => (
              <div key={i.id} className="card flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={i.image}
                  alt={i.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                  style={{ background: "var(--surface2)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg font-bold leading-tight">{i.name}</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                    {peso(i.price)} bawat isa
                  </p>
                  <p className="font-display font-bold mt-0.5" style={{ color: "var(--brand)" }}>
                    {peso(i.price * i.qty)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost p-2" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Bawasan">
                    {i.qty === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                  </button>
                  <span className="font-display font-bold text-lg w-7 text-center">{i.qty}</span>
                  <button className="btn btn-ghost p-2" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Dagdagan">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button
              className="text-sm font-bold underline"
              style={{ color: "var(--muted)" }}
              onClick={clearCart}
            >
              I-clear ang buong cart
            </button>
          </div>
          <div className="card p-6 space-y-3 sticky top-24">
            <h2 className="font-display text-xl font-bold">Buod</h2>
            <div className="flex justify-between font-bold text-sm" style={{ color: "var(--muted)" }}>
              <span>Subtotal</span>
              <span>{peso(cartTotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm" style={{ color: "var(--muted)" }}>
              <span>Shipping fee</span>
              <span>{peso(deliveryFee)}</span>
            </div>
            <div className="h-px" style={{ background: "var(--line)" }} />
            <div className="flex justify-between font-display text-2xl font-bold">
              <span>Kabuuan</span>
              <span>{peso(cartTotal + deliveryFee)}</span>
            </div>
            <Link href="/checkout" className="btn btn-brand w-full py-4 text-lg">
              Checkout Na →
            </Link>
            <Link href="/menu" className="block text-center text-sm font-bold underline" style={{ color: "var(--muted)" }}>
              + Dagdag pa ng pagkain
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}