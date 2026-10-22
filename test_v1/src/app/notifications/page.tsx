"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellRing } from "lucide-react";
import { useStore, type Notif } from "@/lib/store";

export default function NotificationsPage() {
  const { user, authLoaded, refreshNotifs } = useStore();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoaded(true);
      return;
    }
    (async () => {
      try {
        const d = await fetch("/api/notifications").then((r) => r.json());
        setNotifs(d.notifications || []);
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "read-all" }),
        });
        refreshNotifs();
      } catch {
      } finally {
        setLoaded(true);
      }
    })();
  }, [user, refreshNotifs]);

  if (authLoaded && !user)
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-7xl mb-4">🔔</p>
        <h1 className="font-display text-3xl font-bold">Sign in para sa mga abiso.</h1>
        <Link href="/auth" className="btn btn-brand px-9 py-4 mt-6 text-lg">Sign In</Link>
      </main>
    );

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <p className="chip" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
        abiso
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3">
        Notifications <BellRing className="inline" size={34} style={{ color: "var(--amber)" }} />
      </h1>
      {!loaded ? (
        <div className="card p-10 mt-8 animate-pulse h-40" style={{ background: "var(--surface2)" }} />
      ) : notifs.length === 0 ? (
        <div className="card p-14 text-center mt-8">
          <p className="text-6xl mb-4">🕊️</p>
          <p className="font-display text-2xl font-bold">Tahimik pa ang mga abiso.</p>
          <p className="font-semibold mt-2" style={{ color: "var(--muted)" }}>
            Kapag gumalaw ang order mo, dito ka namin kukalabugin.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mt-8">
          {notifs.map((n) => (
            <div
              key={n.id}
              className="card p-5 flex gap-4 items-start"
              style={{ border: n.read ? "2px solid transparent" : "2px solid var(--amber)" }}
            >
              <span
                className="p-2.5 rounded-xl shrink-0"
                style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}
              >
                <BellRing size={18} />
              </span>
              <div className="flex-1">
                <p className="font-bold text-sm leading-relaxed">{n.message}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: "var(--muted)" }}>
                  {new Date(n.createdAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                  {n.orderId && (
                    <>
                      {" · "}
                      <Link href={`/order/${n.orderId}`} className="underline" style={{ color: "var(--brand)" }}>
                        Tingnan ang order
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}