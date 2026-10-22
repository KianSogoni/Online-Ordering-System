"use client";

import { Clock, CookingPot, Bike, PartyPopper } from "lucide-react";

export const STEPS = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
const TL = ["Natanggap", "Niluluto sa Banga", "Palapit Na!", "Naihain Na!"];
const ICONS = [Clock, CookingPot, Bike, PartyPopper];

export default function StatusTimeline({ status }: { status: string }) {
  const idx = Math.max(0, STEPS.indexOf(status));
  return (
    <div className="flex items-start">
      {STEPS.map((s, i) => {
        const Icon = ICONS[i];
        const done = i <= idx;
        const active = i === idx;
        return (
          <div key={s} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div
                className="absolute top-6 right-1/2 w-full h-1.5 -z-0 rounded-full transition-colors duration-500"
                style={{ background: done ? "var(--leaf)" : "var(--line)" }}
              />
            )}
            <div
              className={`relative z-10 p-3 rounded-full transition-all duration-500 ${active ? "scale-110" : ""}`}
              style={{
                background: done ? "var(--leaf)" : "var(--surface2)",
                color: done ? "#fff" : "var(--muted)",
                boxShadow: active ? "0 0 0 8px var(--leaf-soft)" : "none",
              }}
            >
              <Icon size={22} />
            </div>
            <p className="font-display font-bold text-xs sm:text-sm mt-2.5 text-center leading-tight">
              {s}
            </p>
            <p className="text-[10px] sm:text-xs font-semibold text-center" style={{ color: "var(--muted)" }}>
              {TL[i]}
            </p>
          </div>
        );
      })}
    </div>
  );
}