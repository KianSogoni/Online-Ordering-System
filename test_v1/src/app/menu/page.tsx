"use client";

import { useEffect, useMemo, useState } from "react";
import { Wallet, EyeOff, MousePointer2 } from "lucide-react";
import { useStore, pesoShort, type Product } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

const CATS = [
  { key: "all", label: "Lahat", emoji: "🧺" },
  { key: "pagkain", label: "Pagkain", emoji: "🍲" },
  { key: "inumin", label: "Inumin", emoji: "🥤" },
  { key: "panghimagas", label: "Panghimagas", emoji: "🍮" },
];

export default function MenuPage() {
  const { budget, setBudget, cartTotal } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [cat, setCat] = useState("all");
  const [budgetInput, setBudgetInput] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (budget !== null) setBudgetInput(String(budget));
  }, [budget]);

  const remaining = budget !== null ? budget - cartTotal : null;

  const { visible, hidden } = useMemo(() => {
    const inCat = products.filter((p) => cat === "all" || p.category === cat);
    if (budget === null || budget <= 0) return { visible: inCat, hidden: 0 };
    const v = inCat.filter(
      (p) => p.price <= (remaining as number) || p.soldOut === true
    );
    return { visible: v, hidden: inCat.length - v.length };
  }, [products, cat, budget, remaining]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center">
        <p className="chip" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
          ang lutuan
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-bold mt-3">
          Ano ang luto namin today? 🍲
        </h1>
        <p
          className="mt-3 font-semibold inline-flex items-center gap-2"
          style={{ color: "var(--muted)" }}
        >
          <MousePointer2 size={15} /> I-hover ang pagkain para sa &ldquo;nutshell&rdquo; — detalye, stock, quick add.
        </p>
      </div>

      {/* Budget Mode */}
      <div
        className="card max-w-2xl mx-auto mt-8 p-6"
        style={{ border: "2px solid var(--amber)" }}
      >
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl" style={{ background: "var(--amber)", color: "#4a2c07" }}>
            <Wallet size={22} />
          </span>
          <div className="flex-1">
            <p className="font-display text-xl font-bold leading-tight">Budget Mode</p>
            <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
              Magkano ang budget mo ngayon?
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-lg" style={{ color: "var(--muted)" }}>
              ₱
            </span>
            <input
              className="input !pl-9 text-lg font-display font-bold"
              type="number"
              min={0}
              placeholder="hal. 200"
              value={budgetInput}
              onChange={(e) => {
                const v = e.target.value;
                setBudgetInput(v);
                setBudget(v === "" ? null : Math.max(0, Number(v)));
              }}
            />
          </div>
          {budget !== null && (
            <button
              className="btn btn-ghost px-5"
              onClick={() => {
                setBudget(null);
                setBudgetInput("");
              }}
            >
              Clear
            </button>
          )}
        </div>
        {budget !== null && budget > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className="chip text-sm"
              style={{
                background: (remaining as number) >= 0 ? "var(--leaf-soft)" : "#fde8e4",
                color: (remaining as number) >= 0 ? "var(--leaf)" : "#b3341f",
              }}
            >
              💰 Natitirang budget: {pesoShort(Math.max(0, remaining as number))}
            </span>
            {hidden > 0 && (
              <span className="chip text-sm" style={{ background: "var(--surface2)", color: "var(--muted)" }}>
                <EyeOff size={13} /> {hidden} item ang nakatago (lampas sa budget)
              </span>
            )}
            {(remaining as number) < 0 && (
              <span className="text-sm font-bold" style={{ color: "#b3341f" }}>
                ⚠️ Lampas na ang cart mo sa budget!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex justify-center gap-2 flex-wrap mt-10">
        {CATS.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className="btn px-6 py-2.5"
            style={
              cat === c.key
                ? { background: "var(--ink)", color: "var(--bg)" }
                : { background: "var(--surface)", color: "var(--ink)", boxShadow: "var(--shadow)" }
            }
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {visible.length === 0 && products.length > 0 && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🫙</p>
          <p className="font-display text-2xl font-bold">
            Wala nang kasya sa budget na &lsquo;yan, kaibigan!
          </p>
          <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
            Taasan ang budget o bawasan ang laman ng cart.
          </p>
        </div>
      )}
    </main>
  );
}