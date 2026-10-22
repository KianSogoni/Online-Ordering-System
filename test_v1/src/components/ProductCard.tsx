"use client";

import { Plus, Flame } from "lucide-react";
import { useStore, pesoShort, type Product } from "@/lib/store";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const out = product.soldOut || product.stock <= 0;
  return (
    <div className="food-card card relative p-5 flex flex-col">
      {product.bestSeller && !out && (
        <span
          className="chip absolute top-4 left-4 z-10"
          style={{ background: "var(--amber)", color: "#4a2c07" }}
        >
          <Flame size={12} /> Best Seller
        </span>
      )}
      {out && (
        <span
          className="chip absolute top-4 left-4 z-10"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          Ubos na 😢
        </span>
      )}
      <div
        className="rounded-3xl overflow-hidden flex items-center justify-center aspect-square"
        style={{ background: "var(--surface2)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className={`food-img w-full h-full object-cover ${out ? "grayscale opacity-60" : ""}`}
        />
      </div>
      <div className="mt-4 flex-1">
        <h3 className="font-display text-xl font-bold leading-tight">
          {product.name}
        </h3>
        <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--muted)" }}>
          {product.tagline}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="font-display text-2xl font-bold" style={{ color: "var(--brand)" }}>
          {pesoShort(product.price)}
        </span>
        <button
          className="btn btn-brand px-5 py-2.5"
          disabled={out}
          onClick={() => addToCart(product)}
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Nutshell popup — Steam-style hover */}
      {!out && (
        <div className="nutshell absolute inset-x-2 bottom-2 z-20 card p-4" style={{ border: "2px solid var(--brand)", boxShadow: "0 18px 44px -10px rgba(0,0,0,0.35)" }}>
          <p className="font-display font-bold text-lg leading-tight">
            {product.name} <span style={{ color: "var(--brand)" }}>· {pesoShort(product.price)}</span>
          </p>
          <p className="text-xs font-semibold mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="chip" style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}>
              🔥 {product.stock} left sa kalan
            </span>
            <button
              className="btn btn-brand px-4 py-2 text-sm"
              onClick={() => addToCart(product)}
            >
              <Plus size={14} /> Quick Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}