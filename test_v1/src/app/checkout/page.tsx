"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, Smartphone, MapPin, CheckCircle2 } from "lucide-react";
import { useStore, peso } from "@/lib/store";

function FakeQR() {
  // deterministic dummy QR pattern
  const cells: boolean[] = [];
  let seed = 42;
  for (let i = 0; i < 21 * 21; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    cells.push(seed % 100 < 46);
  }
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} fill="#111" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="#111" />
    </g>
  );
  const inFinder = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8);
  return (
    <svg viewBox="-1 -1 23 23" className="w-44 h-44 bg-white rounded-xl p-1">
      {cells.map((on, i) => {
        const r = Math.floor(i / 21);
        const c = i % 21;
        if (inFinder(r, c) || !on) return null;
        return <rect key={i} x={c} y={r} width={1} height={1} fill="#111" />;
      })}
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
    </svg>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, cart, cartTotal, deliveryFee, clearCart, toast, refreshSettings } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [payment, setPayment] = useState<"cod" | "gcash">("cod");
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  useEffect(() => {
    if (user)
      setForm({ name: user.name, phone: user.phone, address: user.address });
  }, [user]);

  const placeOrder = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          payment,
          items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hindi na-place ang order.");
      try {
        sessionStorage.setItem(`paso_order_${data.order.id}`, JSON.stringify(data.order));
      } catch {}
      clearCart();
      toast(`🎉 Order ${data.order.number} received! Salamat!`);
      router.push(`/order/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "May problema.");
      setBusy(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-7xl mb-4">🧺</p>
        <h1 className="font-display text-3xl font-bold">Walang ihahain — empty ang cart!</h1>
        <Link href="/menu" className="btn btn-brand px-9 py-4 mt-6 text-lg">
          Balik sa Menu
        </Link>
      </main>
    );
  }

  const canPlace =
    form.name.trim() && form.address.trim() && (payment === "cod" || paid);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl sm:text-5xl font-bold">💳 Checkout</h1>
      <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
        Konti na lang, kakain na tayo.
      </p>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 mt-8 items-start">
        <div className="space-y-6">
          {/* Address */}
          <section className="card p-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <MapPin size={20} style={{ color: "var(--brand)" }} /> Saan ihahatid?
            </h2>
            {!user && (
              <p className="text-sm font-bold rounded-xl px-4 py-3 mt-3" style={{ background: "var(--surface2)", color: "var(--muted)" }}>
                Guest ka! Ilagay ang delivery details sa baba, o{" "}
                <Link href="/auth" className="underline" style={{ color: "var(--brand)" }}>
                  mag-sign in
                </Link>{" "}
                para ma-track ang order mo.
              </p>
            )}
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <input
                className="input"
                placeholder="Pangalan ng tatanggap"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                className="input sm:col-span-2 min-h-24"
                placeholder="Kumpletong address (Bahay, Kalye, Brgy., Lungsod)"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </section>

          {/* Payment */}
          <section className="card p-6">
            <h2 className="font-display text-xl font-bold">Paano ang bayad?</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => setPayment("cod")}
                className="rounded-2xl p-5 text-left transition-all"
                style={{
                  border: `3px solid ${payment === "cod" ? "var(--brand)" : "var(--line)"}`,
                  background: payment === "cod" ? "var(--brand-soft)" : "var(--surface)",
                }}
              >
                <Banknote size={26} style={{ color: "var(--leaf)" }} />
                <p className="font-display font-bold text-lg mt-2">COD</p>
                <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                  Cash on Delivery — bayad pag dating ng rider.
                </p>
              </button>
              <button
                onClick={() => setPayment("gcash")}
                className="rounded-2xl p-5 text-left transition-all"
                style={{
                  border: `3px solid ${payment === "gcash" ? "var(--brand)" : "var(--line)"}`,
                  background: payment === "gcash" ? "var(--brand-soft)" : "var(--surface)",
                }}
              >
                <Smartphone size={26} style={{ color: "#007dfe" }} />
                <p className="font-display font-bold text-lg mt-2">GCash</p>
                <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                  I-scan ang QR, tapos confirm sa baba.
                </p>
              </button>
            </div>
            {payment === "gcash" && (
              <div className="pop-in mt-5 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6" style={{ background: "#007dfe15", border: "2px dashed #007dfe" }}>
                <FakeQR />
                <div className="text-center sm:text-left">
                  <p className="font-display text-xl font-bold" style={{ color: "#007dfe" }}>
                    GCash — PASO Kitchen
                  </p>
                  <p className="font-bold text-sm mt-1">0917 ••• 4567</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: "var(--muted)" }}>
                    Halaga: {peso(cartTotal + deliveryFee)} (kasama na ang shipping)
                  </p>
                  <button
                    className={`btn mt-4 px-7 py-3 ${paid ? "btn-leaf" : "btn-brand"}`}
                    onClick={() => {
                      setPaid(true);
                      toast("✅ GCash payment confirmed (simulated). Salamat!");
                    }}
                    disabled={paid}
                  >
                    {paid ? (
                      <>
                        <CheckCircle2 size={18} /> Bayad na!
                      </>
                    ) : (
                      "I have paid ✓"
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="card p-6 space-y-3 sticky top-24">
          <h2 className="font-display text-xl font-bold">Ang Order Mo</h2>
          {cart.map((i) => (
            <div key={i.id} className="flex justify-between text-sm font-bold gap-2">
              <span className="truncate">
                {i.qty}× {i.name}
              </span>
              <span className="shrink-0">{peso(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="h-px" style={{ background: "var(--line)" }} />
          <div className="flex justify-between text-sm font-bold" style={{ color: "var(--muted)" }}>
            <span>Subtotal</span>
            <span>{peso(cartTotal)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold" style={{ color: "var(--muted)" }}>
            <span>Shipping fee 🛵</span>
            <span>{peso(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-display text-2xl font-bold">
            <span>Kabuuan</span>
            <span>{peso(cartTotal + deliveryFee)}</span>
          </div>
          {error && (
            <p className="text-sm font-bold rounded-xl px-4 py-2.5" style={{ background: "#fde8e4", color: "#b3341f" }}>
              {error}
            </p>
          )}
          <button
            className="btn btn-brand w-full py-5 text-xl"
            disabled={!canPlace || busy}
            onClick={placeOrder}
          >
            {busy ? "Inihahain…" : "Ihain ang Order! 🍲"}
          </button>
          {payment === "gcash" && !paid && (
            <p className="text-xs font-bold text-center" style={{ color: "var(--muted)" }}>
              I-click muna ang &ldquo;I have paid&rdquo; sa GCash QR.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}