"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Flame } from "lucide-react";

const RECIPES = [
  {
    name: "Adobong Manok sa Banga",
    emoji: "🍗",
    time: "1 oras",
    story:
      "Ang adobo ang pinaka-tapat na ulam ng Pilipino — toyo, suka, bawang. Sa PASO, mabagal naming niluluto sa palayok para lumapot ang sarsa nang kusa.",
    ingredients: ["1kg manok", "½ tasa toyo", "⅓ tasa suka", "1 buong bawang, dinurog", "3 dahon ng laurel", "Pamintang buo", "2 kutsara mantika"],
    steps: [
      "Ibabad ang manok sa toyo, bawang, laurel at paminta ng 30 minuto.",
      "Sa banga, igisa ang manok hanggang magkulay ginto sa gilid.",
      "Ibuhos ang pinagbabaran at ½ tasa tubig. Pakuluan, hinaan ang kalan.",
      "Idagdag ang suka — HUWAG haluin sa unang 5 minuto (respeto sa asim!).",
      "Patuloy na pakuluan nang mahina hanggang lumapot ang sarsa. Ihain sa mainit na kanin.",
    ],
  },
  {
    name: "Sinigang na Baboy",
    emoji: "🍲",
    time: "1.5 oras",
    story:
      "Ang asim ng sampalok ang yakap ng sinigang sa mga maulang hapon. Sa kalan, unti-unting lumalabas ang tamis ng gulay sa sabaw.",
    ingredients: ["1kg baboy (buto-buto)", "1 pack sampalok mix o sariwang sampalok", "Kangkong", "Labanos, hiniwa", "2 kamatis", "1 sibuyas", "Patis at siling haba"],
    steps: [
      "Pakuluan ang baboy sa tubig kasama ang kamatis at sibuyas. Tanggalin ang scum.",
      "Hinaan ang kalan, palambutin ang karne ng 45 minuto.",
      "Idagdag ang sampalok at labanos. Lutuin ng 5 minuto.",
      "Timplahan ng patis. Idagdag ang kangkong at siling haba sa huli.",
      "Patayin ang kalan habang malutong pa ang kangkong. Ihain nang umuusok!",
    ],
  },
  {
    name: "Bibingka sa Dahon ng Saging",
    emoji: "🥮",
    time: "45 minuto",
    story:
      "Pamana ng mga Calambeño: galapong na niluluto sa palayok na may uling sa ibabaw at ilalim — ang orihinal na 'oven' ng baryo.",
    ingredients: ["2 tasa galapong", "1½ tasa gata", "¾ tasa asukal", "2 itlog", "Dahon ng saging", "Itlog na maalat at keso", "Niyog at mantikilya"],
    steps: [
      "Haluin ang galapong, gata, asukal at itlog hanggang makinis.",
      "Paso-pasuhin (wilting) ang dahon ng saging sa apoy, ilapat sa palayok.",
      "Ibuhos ang mixture. Lutuin sa kalan na may uling sa takip.",
      "Kapag nag-set, idagdag ang itlog na maalat at keso. Lutuin pa ng 5 minuto.",
      "Pahid ng mantikilya, budburan ng niyog. Kainin habang mainit!",
    ],
  },
];

export default function RecipesPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center">
        <p className="chip" style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}>
          mga resipi
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-bold mt-3">
          Recipe Box 📖
        </h1>
        <p className="font-semibold mt-3 max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Mga resipi mula sa PASO kitchen — kalan at banga method. Libre, kasi
          ang lutong-bahay, ipinapamana, hindi ipinagkakait.
        </p>
      </div>

      <div className="space-y-5 mt-10">
        {RECIPES.map((r, i) => (
          <div key={r.name} className="card overflow-hidden">
            <button
              className="w-full flex items-center gap-4 p-6 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="text-5xl">{r.emoji}</span>
              <span className="flex-1">
                <span className="font-display text-2xl font-bold block leading-tight">{r.name}</span>
                <span className="chip mt-1.5" style={{ background: "var(--surface2)", color: "var(--muted)" }}>
                  <Flame size={12} /> {r.time} · banga method
                </span>
              </span>
              <ChevronDown
                size={24}
                className="transition-transform duration-300"
                style={{ transform: open === i ? "rotate(180deg)" : "none", color: "var(--brand)" }}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-7 pop-in">
                <p className="font-semibold italic border-l-4 pl-4" style={{ borderColor: "var(--amber)", color: "var(--muted)" }}>
                  {r.story}
                </p>
                <div className="grid sm:grid-cols-[240px_1fr] gap-6 mt-5">
                  <div className="rounded-2xl p-5" style={{ background: "var(--surface2)" }}>
                    <p className="font-display font-bold text-lg mb-2">🧺 Sangkap</p>
                    <ul className="space-y-1.5 text-sm font-semibold">
                      {r.ingredients.map((ing) => (
                        <li key={ing}>• {ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg mb-2">🔥 Paraan</p>
                    <ol className="space-y-3">
                      {r.steps.map((s, si) => (
                        <li key={si} className="flex gap-3 text-sm font-semibold">
                          <span
                            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-white"
                            style={{ background: "var(--brand)" }}
                          >
                            {si + 1}
                          </span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl p-4 text-center text-sm font-bold" style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}>
                  Tamad magluto today? 😌{" "}
                  <Link href="/menu" className="underline">
                    Order mo na lang sa amin
                  </Link>{" "}
                  — luto na sa banga!
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}