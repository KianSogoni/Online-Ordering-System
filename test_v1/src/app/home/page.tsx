"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Sun, Leaf, Flame } from "lucide-react";
import { useStore, type Product } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

const QUOTE =
  "“Ang hindi marunong lumingon sa pinanggalingan ay hindi makararating sa paroroonan. Ngunit ang hindi marunong magluto ng adobo… ay kailangang umorder na lang.”";

export default function HomePage() {
  const { user, setBotOpen } = useStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  const best = products.filter((p) => p.bestSeller).slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 sm:pt-16 pb-8 grid lg:grid-cols-2 gap-10 items-center">
        <div className="fade-up">
          <span className="chip" style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}>
            <Leaf size={13} /> fresh today • luto sa banga
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05] mt-5">
            Mabuhay{user ? `, ${user.name.split(" ")[0]}` : ""}! 👋
            <span className="block mt-3 text-2xl sm:text-3xl" style={{ color: "var(--brand)" }}>
              Sariwang luto, mula sa aming kawa, papunta sa inyong mesa.
            </span>
          </h1>
          <p className="mt-5 font-semibold text-lg" style={{ color: "var(--muted)" }}>
            Ang lutong-bahay ng Calamba — niluto sa kalan at banga, pinalakas ng
            araw, inihatid habang umuusok pa.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/menu" className="btn btn-brand px-9 py-4 text-lg">
              Order Now <ArrowRight size={20} />
            </Link>
            <Link href="/recipes" className="btn btn-outline px-9 py-4 text-lg">
              Recipe Box 📖
            </Link>
          </div>
        </div>
        <div className="relative fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="card overflow-hidden rounded-[2.5rem] rotate-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero.jpg"
              alt="Solar-powered bahay kubo kitchen ng PASO"
              className="w-full h-80 sm:h-[420px] object-cover"
            />
          </div>
          <div
            className="card absolute -bottom-5 -left-3 sm:-left-6 px-5 py-3 -rotate-2"
            style={{ border: "2px solid var(--amber)" }}
          >
            <p className="font-display font-bold text-sm">
              ☀️ 100% solar-powered cooking
            </p>
          </div>
        </div>
      </section>

      {/* Moving quote */}
      <section className="wood py-4 overflow-hidden my-10" aria-label="Quote">
        <div className="marquee-track font-display font-bold text-lg">
          {[0, 1].map((i) => (
            <span key={i} className="px-8">
              {QUOTE} &nbsp;🍲&nbsp; {QUOTE} &nbsp;🍲&nbsp;
            </span>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="chip" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
              <Flame size={13} /> today&apos;s available
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold mt-3">
              Best Sellers ng Tindahan
            </h2>
          </div>
          <Link href="/menu" className="btn btn-ghost px-6 py-3">
            Buong Menu <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {best.length === 0
            ? [1, 2, 3].map((i) => (
                <div key={i} className="card aspect-[3/4] animate-pulse" style={{ background: "var(--surface2)" }} />
              ))
            : best.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Mission — wooden veranda */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="wood rounded-[2.5rem] p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 text-[10rem] opacity-15 select-none" aria-hidden>
            🏡
          </div>
          <p className="chip" style={{ background: "rgba(255,255,255,0.16)" }}>
            ang layunin namin
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-4 max-w-2xl">
            Tradisyon sa kalan. Teknolohiya sa bubong.
          </h2>
          <p className="mt-4 max-w-2xl font-semibold text-white/85 text-lg leading-relaxed">
            We combine the warmth of traditional Filipino cooking with
            sustainable, modern ordering. Fresh ingredients, zero waste,
            delivered with a smile — mula sa bahay kubong may solar panels,
            para sa bawat hapag-kainan.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: <Sun size={22} />, t: "Solar-Powered", d: "Ang kalan namin, pinapagana ng araw — malinis na lutong-bahay." },
              { icon: <Leaf size={22} />, t: "Zero Waste", d: "Buo ang sangkap na ginagamit — ang buko, ang dahon, lahat may silbi." },
              { icon: <Flame size={22} />, t: "Kalan at Banga", d: "Mabagal na pagluluto sa palayok, gaya ng pamana ng mga Calambeño." },
            ].map((f) => (
              <div key={f.t} className="rounded-3xl p-5" style={{ background: "rgba(0,0,0,0.22)" }}>
                <span className="inline-flex p-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.15)" }}>
                  {f.icon}
                </span>
                <p className="font-display text-xl font-bold mt-3">{f.t}</p>
                <p className="text-sm font-semibold opacity-80 mt-1">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PiliBot & FAQ anchor */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div
          className="card p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
          style={{ border: "2px dashed var(--leaf)" }}
        >
          <span className="text-6xl">🌿</span>
          <div className="flex-1">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              May tanong ka ba?
            </h3>
            <p className="font-semibold mt-1" style={{ color: "var(--muted)" }}>
              Si PiliBot ang bahala — delivery, bayad, budget mode, kahit ano!
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-leaf px-7 py-3.5" onClick={() => setBotOpen(true)}>
              <Bot size={18} /> Kay PiliBot!
            </button>
            <Link href="/faq" className="btn btn-outline px-7 py-3.5">
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}