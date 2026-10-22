"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { useStore, pesoShort } from "@/lib/store";

type Msg = { from: "bot" | "user"; text: string };

export default function PiliBot() {
  const { botOpen, setBotOpen, deliveryFee, user } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "bot",
      text: "Mabuhay! Ako si PiliBot  — ang tindero-bot ng PASO. Ano ang maitutulong ko sa'yo today?",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, botOpen]);

  const answer = (q: string): string => {
    const s = q.toLowerCase();
    if (/(oras|open|hours|schedule|anong oras)/.test(s))
      return "Bukas ang PASO kitchen araw-araw, 8AM hanggang 9PM. Past 6PM? Mag-a-activate ang Sunset Mode — dapit-hapon habang umoorder. 🌇";
    if (/(deliver|ship|fee|padala|gaano katagal)/.test(s))
      return `Delivery fee namin ay ${pesoShort(deliveryFee)} flat within Calamba, Laguna. Karaniwang 30–60 minutes lang, mainit pa mula sa kalan! 🛵`;
    if (/(gcash|bayad|payment|cod|cash)/.test(s))
      return "Tumatanggap kami ng GCash (may QR sa checkout) at Cash on Delivery. Pili ka lang sa checkout page! 💳";
    if (/(budget|pera|mahal|tipid)/.test(s))
      return "Gamitin ang Budget Mode sa Menu page! Ilagay mo lang ang budget mo (hal. ₱200) at itatago namin ang mga item na lampas dito. Makikita mo rin ang natitirang budget mo habang nag-oorder. 💰";
    if (/(saan|location|address|calamba|laguna)/.test(s))
      return "Nasa Calamba, Laguna ang aming solar-powered na bahay kubo kitchen — Brgy. Uno. Dito namin niluluto sa tradisyunal na kalan at banga! 🏡";
    if (/(order|track|status|nasaan)/.test(s))
      return "Puntahan mo ang 'My Orders' (Aking Order) sa side menu para makita ang status: Pending → Preparing → Out for Delivery → Delivered. May abiso ka rin kada update! 📦";
    if (/(paso|pilikart|brand|ibig sabihin)/.test(s))
      return "Ang pilikart = 'pumili ka + cart' 🧺. Ang PASO naman ay ode sa indigenous na pagluluto — ang kalan (stove) at banga (clay pot) na pamana ng mga Calambeño.";
    if (/(sunset|gabi|dilim|dark)/.test(s))
      return "Kapag lumampas na ng 6PM, kusa kaming lumilipat sa Sunset Mode — deep twilight ambers at dark greens. Pwede mo rin i-toggle sa side menu! 🌙";
    if (/(recommend|best|popular|ano ang masarap|bestseller)/.test(s))
      return "Best sellers namin: Chicken Adobo, Lumpiang Shanghai, at Halo-Halo Espesyal! Pero kung maulan, walang tatalo sa Sinigang na Baboy. 🍲";
    if (/(recipe|resipi|luto)/.test(s))
      return "Nasa Recipe Box (Mga Resipi) ang mga paboritong resipi ng PASO kitchen — kumpleto sa mga hakbang mula sa banga. Libre, kasi sharing ang lutong-bahay! 📖";
    if (/(salamat|thank)/.test(s))
      return "Walang anuman, kaibigan! Kain na habang mainit. 💚";
    if (/(hello|hi|mabuhay|kamusta)/.test(s))
      return `Mabuhay${user ? ", " + user.name.split(" ")[0] : ""}! 👋 Gutom ka na ba? Tanong mo lang sa akin ang tungkol sa menu, delivery, budget mode, o bayad.`;
    return "Hmm, hindi ko pa alam 'yan — pero subukan mong itanong ang tungkol sa: delivery, GCash, budget mode, oras ng tindahan, o best sellers! 🌿";
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTimeout(
      () => setMsgs((m) => [...m, { from: "bot", text: answer(t) }]),
      500
    );
  };

  const chips = ["Delivery fee?", "GCash ba?", "Best sellers?", "Budget mode?"];

  return (
    <>
      <button
        onClick={() => setBotOpen(!botOpen)}
        className="fixed bottom-6 right-6 z-[60] btn btn-leaf p-4 shadow-2xl"
        aria-label="Buksan si PiliBot"
        title="May tanong ka? Kay PiliBot!"
      >
        {botOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
      {botOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100%-2rem)] max-w-sm card pop-in flex flex-col overflow-hidden"
          style={{ height: "min(520px, 70vh)", border: "2px solid var(--leaf)" }}
        >
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: "var(--leaf)", color: "#fff" }}>
            <span className="text-2xl">🌿</span>
            <div>
              <p className="font-display font-bold leading-none text-lg">PiliBot</p>
              <p className="text-xs opacity-85 font-semibold">Tindero-bot ng PASO • online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-semibold ${
                  m.from === "user" ? "ml-auto rounded-br-md" : "rounded-bl-md"
                }`}
                style={{
                  background: m.from === "user" ? "var(--brand)" : "var(--surface2)",
                  color: m.from === "user" ? "#fff" : "var(--ink)",
                }}
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="text-xs font-bold rounded-full px-3 py-1.5 transition-transform hover:scale-105"
                style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}
              >
                {c}
              </button>
            ))}
          </div>
          <form
            className="p-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              className="input flex-1 !py-2.5"
              placeholder="Itanong mo kay PiliBot…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-leaf p-3" aria-label="Ipadala">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}