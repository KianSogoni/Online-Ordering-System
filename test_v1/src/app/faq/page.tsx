"use client";

import { useState } from "react";
import { Bot, ChevronDown } from "lucide-react";
import { useStore, pesoShort } from "@/lib/store";

export default function FaqPage() {
  const { setBotOpen, deliveryFee } = useStore();
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: "Ano ang ibig sabihin ng pilikart at PASO?",
      a: "Ang pilikart ay 'pumili ka + cart' — pumili ka, ilagay sa cart, kami na ang bahala! Ang PASO naman ay ode sa indigenous na pagluluto at Calambeño heritage: ang kalan (clay stove) at banga (clay pot) na pinagmulan ng lutong-bahay namin.",
    },
    {
      q: "Magkano ang delivery fee at saan kayo naghahatid?",
      a: `Flat na ${pesoShort(deliveryFee)} ang shipping fee within Calamba, Laguna. Karaniwang 30–60 minuto lang ang dating — mainit pa mula sa banga!`,
    },
    {
      q: "Ano ang mga paraan ng bayad?",
      a: "Cash on Delivery (COD) o GCash. Sa GCash, may QR code sa checkout — i-scan, magbayad, at i-click ang 'I have paid'.",
    },
    {
      q: "Paano gamitin ang Budget Mode?",
      a: "Sa Menu page, ilagay ang budget mo (hal. ₱200). Awtomatikong itatago namin ang mga item na lampas sa natitira mong budget, at may live counter ng 'Natitirang budget'. Sa cart, may progress bar — pula kapag lampas ka na!",
    },
    {
      q: "Pwede ba akong umorder bilang guest?",
      a: "Oo naman! Browse at order ka lang — ilagay mo lang ang pangalan at address sa checkout. Pero mas maganda kung mag-aaccount ka para ma-track ang orders at makatanggap ng abiso.",
    },
    {
      q: "Ano ang Sunset Mode?",
      a: "Kapag lampas 6PM na, kusang lumilipat ang buong site sa twilight ambers at dark greens — dapit-hapon vibes habang umoorder. Pwede mo rin itong i-toggle anumang oras sa side menu. 🌇",
    },
    {
      q: "Paano ko ma-track ang order ko?",
      a: "Pumunta sa My Orders (Aking Order). Makikita mo ang timeline: Pending → Preparing → Out for Delivery → Delivered. May notification ka rin sa bawat update mula sa kitchen!",
    },
    {
      q: "Totoo bang solar-powered ang kitchen ninyo?",
      a: "Oo! Ang bahay kubo namin ay may solar panels sa bubong. Tradisyunal ang kalan at banga, moderno at malinis ang enerhiya. Solarpunk ang tawag diyan — tradisyon + kinabukasan. ☀️",
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center">
        <p className="chip" style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}>
          mga tanong
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-bold mt-3">FAQ 🙋</h1>
        <p className="font-semibold mt-3" style={{ color: "var(--muted)" }}>
          Mga madalas itanong sa tindahan.
        </p>
      </div>

      <div className="space-y-3 mt-10">
        {faqs.map((f, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              className="w-full flex items-center gap-4 px-6 py-5 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-display text-lg font-bold flex-1">{f.q}</span>
              <ChevronDown
                size={22}
                className="shrink-0 transition-transform duration-300"
                style={{ transform: open === i ? "rotate(180deg)" : "none", color: "var(--brand)" }}
              />
            </button>
            {open === i && (
              <p className="px-6 pb-6 font-semibold leading-relaxed pop-in" style={{ color: "var(--muted)" }}>
                {f.a}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="card p-8 mt-10 text-center" style={{ border: "2px dashed var(--leaf)" }}>
        <p className="font-display text-2xl font-bold">Hindi mo nahanap ang sagot?</p>
        <button className="btn btn-leaf px-8 py-3.5 mt-4" onClick={() => setBotOpen(true)}>
          <Bot size={18} /> Itanong kay PiliBot
        </button>
      </div>
    </main>
  );
}