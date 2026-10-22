"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useStore, type User } from "@/lib/store";

type Tab = "signin" | "signup" | "admin";

export default function AuthPage() {
  const router = useRouter();
  const { setUser, toast } = useStore();
  const [tab, setTab] = useState<Tab>("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const done = (u: User) => {
    setUser(u);
    toast(`Mabuhay, ${u.name.split(" ")[0]}! `);
    router.push(u.role === "admin" ? "/admin" : "/home");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const action = tab === "signup" ? "register" : "login";
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          ...form,
          adminOnly: tab === "admin",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "May problema. Subukan ulit.");
      done(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "May problema.");
    } finally {
      setBusy(false);
    }
  };

  const guest = () => {
    toast("Guest mode! Browse lang muna — log in sa checkout. 🧺");
    router.push("/home");
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background:
          "repeating-linear-gradient(90deg, rgba(63,35,14,0.14) 0 3px, transparent 3px 110px), linear-gradient(180deg,#7a4e2b,#5e3a1e)",
      }}
    >
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-white/85 hover:text-white mb-5"
        >
          <ArrowLeft size={16} /> Balik sa entrance
        </Link>
        <div className="card p-8 pop-in">
          <div className="text-center mb-6">
            <p className="font-display text-4xl font-bold lowercase">pilikart</p>
            <p className="text-xs font-bold tracking-[0.25em] uppercase mt-1" style={{ color: "var(--leaf)" }}>
              PASO • kalan at banga
            </p>
          </div>

          <div className="flex rounded-full p-1 mb-6" style={{ background: "var(--surface2)" }}>
            {(["signin", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                className="flex-1 rounded-full py-2.5 font-display font-bold transition-all"
                style={
                  tab === t
                    ? { background: "var(--brand)", color: "#fff" }
                    : { color: "var(--muted)" }
                }
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {tab === "admin" && (
            <div
              className="rounded-2xl p-3 mb-4 text-sm font-bold flex items-center gap-2"
              style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}
            >
              <ShieldCheck size={18} /> Store Owner Portal — admin credentials lang.
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            {tab === "signup" && (
              <>
                <input
                  className="input"
                  placeholder="Buong pangalan"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
                <input
                  className="input"
                  placeholder="Phone (09XX XXX XXXX)"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Delivery address (Bahay, Brgy., Lungsod)"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  required
                />
              </>
            )}
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
            />
            {error && (
              <p className="text-sm font-bold rounded-xl px-4 py-2.5" style={{ background: "#fde8e4", color: "#b3341f" }}>
                {error}
              </p>
            )}
            <button className="btn btn-brand w-full py-3.5 text-lg" disabled={busy}>
              {busy
                ? "Sandali lang…"
                : tab === "signup"
                ? "Sumali sa PASO 🌿"
                : tab === "admin"
                ? "Pumasok bilang Owner"
                : "Pasok na!"}
            </button>
          </form>

          {tab !== "admin" && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
                <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                  O KAYA
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
              </div>
              <button className="btn btn-outline w-full py-3.5" onClick={guest}>
                🧺 Continue as Guest
              </button>
              <p className="text-xs text-center mt-2 font-semibold" style={{ color: "var(--muted)" }}>
                Browse freely — sa checkout, log in o ilagay ang address mo.
              </p>
            </>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setTab(tab === "admin" ? "signin" : "admin");
                setError("");
              }}
              className="text-xs font-bold underline"
              style={{ color: "var(--muted)" }}
            >
              {tab === "admin" ? "← Customer ako, hindi owner" : "Store Owner? Log in here."}
            </button>
          </div>
        </div>

        <div
          className="rounded-2xl px-5 py-3.5 mt-4 text-xs font-bold text-center text-white/90"
          style={{ background: "rgba(0,0,0,0.25)" }}
        >
          Demo accounts — customer: maria@example.com / demo1234 · owner:
          admin@pilikart.ph / admin123
        </div>
      </div>
    </main>
  );
}