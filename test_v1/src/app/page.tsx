"use client";

import Link from "next/link";

export default function Landing() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero.jpg"
        alt="Bahay kubo na may solar panels, sariwang lutong Filipino sa mesa"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,17,8,0.55) 0%, rgba(30,17,8,0.25) 45%, rgba(30,17,8,0.72) 100%)",
        }}
      />
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-8 text-white">
        <div className="fade-up">
          <p className="font-display text-3xl sm:text-4xl font-bold lowercase drop-shadow-lg">
            pilikart
          </p>
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase opacity-90">
            pumili ka + cart
          </p>
        </div>
        <div className="chip fade-up" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
          ☀️ solar-powered kitchen
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 text-white">
        <p
          className="font-display font-bold tracking-[0.5em] uppercase text-sm sm:text-base fade-up"
          style={{ animationDelay: "0.15s", color: "#ffd9a8" }}
        >
          P · A · S · O
        </p>
        <h1
          className="font-display text-4xl sm:text-6xl font-bold max-w-3xl leading-tight mt-4 fade-up drop-shadow-xl"
          style={{ animationDelay: "0.3s" }}
        >
          Ang kalan at banga ng Calamba,
          <br />
          <span style={{ color: "#ffc386" }}>buhay na buay sa hapag mo.</span>
        </h1>
        <p
          className="mt-4 max-w-xl font-semibold text-white/85 fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          Sariwang lutong Filipino, niluto sa tradisyunal na paraan — dala ng
          lakas ng araw, inihatid nang may ngiti.
        </p>
        <Link
          href="/auth"
          className="btn btn-brand pulse-pill px-12 sm:px-16 py-5 sm:py-6 text-xl sm:text-2xl mt-10 fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          🍲 Pumasok sa Tindahan
        </Link>
        <div className="steam mt-6 text-2xl opacity-80" aria-hidden>
          <span>~</span> <span>~</span> <span>~</span>
        </div>
      </div>

      <div className="relative z-10 pb-8 text-center text-white/70 text-xs font-bold tracking-widest uppercase">
        PASO — an ode to indigenous cooking & Calambeño heritage
      </div>
    </main>
  );
}