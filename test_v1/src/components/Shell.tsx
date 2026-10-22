"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBasket,
  Bell,
  Sun,
  Moon,
  Minus,
  Plus,
  Trash2,
  UtensilsCrossed,
  Package,
  BookOpen,
  UserRound,
  CircleHelp,
  LogOut,
  LogIn,
  Leaf,
} from "lucide-react";
import { useStore, peso, pesoShort } from "@/lib/store";
import PiliBot from "@/components/PiliBot";

function BudgetBar() {
  const { budget, cartTotal } = useStore();
  if (!budget || budget <= 0) return null;
  const pct = Math.min(100, (cartTotal / budget) * 100);
  const over = cartTotal > budget;
  const left = budget - cartTotal;
  return (
    <div
      className="rounded-2xl p-3 text-sm font-bold"
      style={{ background: "var(--surface2)" }}
    >
      <div className="flex justify-between mb-1.5">
        <span>
          Gastos: {pesoShort(cartTotal)} / Budget: {pesoShort(budget)}
        </span>
        <span style={{ color: over ? "#d33" : "var(--leaf)" }}>
          {over ? `Lampas ng ${pesoShort(-left)}!` : `${pesoShort(left)} pa!`}
        </span>
      </div>
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ background: "var(--line)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: over
              ? "linear-gradient(90deg,#e05545,#c22)"
              : "linear-gradient(90deg,var(--leaf),var(--amber))",
          }}
        />
      </div>
      {over && (
        <p className="mt-1.5 text-xs" style={{ color: "#d33" }}>
          ⚠️ Lampas ka na sa budget, kaibigan. Bawasan natin?
        </p>
      )}
    </div>
  );
}

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    setQty,
    cartTotal,
    deliveryFee,
  } = useStore();
  const router = useRouter();
  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/45"
        onClick={() => setCartOpen(false)}
      />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md flex flex-col pop-in"
        style={{ background: "var(--bg)" }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "2px solid var(--line)" }}
        >
          <h2 className="font-display text-2xl font-bold">
            🧺 Ang Cart Mo
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="btn btn-ghost p-2.5"
            aria-label="Isara ang cart"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <BudgetBar />
          {cart.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍃</div>
              <p className="font-display text-xl font-bold">Walang laman!</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                Pumili ka na sa ang lutuan.
              </p>
              <button
                className="btn btn-brand px-8 py-3 mt-6"
                onClick={() => {
                  setCartOpen(false);
                  router.push("/menu");
                }}
              >
                Tingnan ang Menu
              </button>
            </div>
          )}
          {cart.map((i) => (
            <div key={i.id} className="card flex items-center gap-3 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={i.image}
                alt={i.name}
                className="w-16 h-16 rounded-2xl object-cover"
                style={{ background: "var(--surface2)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold leading-tight truncate">
                  {i.name}
                </p>
                <p className="text-sm font-bold" style={{ color: "var(--brand)" }}>
                  {peso(i.price * i.qty)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  className="btn btn-ghost p-1.5"
                  onClick={() => setQty(i.id, i.qty - 1)}
                  aria-label="Bawasan"
                >
                  {i.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                </button>
                <span className="font-display font-bold w-6 text-center">
                  {i.qty}
                </span>
                <button
                  className="btn btn-ghost p-1.5"
                  onClick={() => setQty(i.id, i.qty + 1)}
                  aria-label="Dagdagan"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div
            className="px-6 py-5 space-y-3"
            style={{ borderTop: "2px solid var(--line)" }}
          >
            <div className="flex justify-between font-bold text-sm" style={{ color: "var(--muted)" }}>
              <span>Subtotal</span>
              <span>{peso(cartTotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm" style={{ color: "var(--muted)" }}>
              <span>Shipping fee</span>
              <span>{peso(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-display text-xl font-bold">
              <span>Kabuuan</span>
              <span>{peso(cartTotal + deliveryFee)}</span>
            </div>
            <button
              className="btn btn-brand w-full py-4 text-lg"
              onClick={() => {
                setCartOpen(false);
                router.push("/checkout");
              }}
            >
              Checkout Na →
            </button>
            <Link
              href="/cart"
              onClick={() => setCartOpen(false)}
              className="block text-center text-sm font-bold underline"
              style={{ color: "var(--muted)" }}
            >
              Buksan ang buong cart page
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

function SideNav() {
  const { navOpen, setNavOpen, user, logout, unread, sunset, toggleSunset } =
    useStore();
  const router = useRouter();
  if (!navOpen) return null;
  const links = [
    { href: "/menu", en: "Menu", tl: "Ang Lutuan", icon: UtensilsCrossed },
    { href: "/orders", en: "My Orders", tl: "Aking Order", icon: Package },
    { href: "/recipes", en: "Recipe Box", tl: "Mga Resipi", icon: BookOpen },
    { href: "/notifications", en: "Notifications", tl: "Abiso", icon: Bell, badge: unread },
    { href: "/profile", en: "Profile", tl: "Ang Iyong Kwento", icon: UserRound },
    { href: "/faq", en: "FAQ", tl: "Mga Tanong", icon: CircleHelp },
  ];
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/45"
        onClick={() => setNavOpen(false)}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-sm bamboo flex flex-col pop-in overflow-y-auto">
        <div className="flex items-center justify-between px-7 pt-7">
          <div>
            <p className="font-display text-3xl font-bold lowercase">pilikart</p>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--leaf)" }}>
              PASO • kalan at banga
            </p>
          </div>
          <button
            onClick={() => setNavOpen(false)}
            className="btn btn-ghost p-2.5"
            aria-label="Isara ang menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-7 py-8 space-y-1.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setNavOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors hover:bg-[var(--brand-soft)] group"
            >
              <span
                className="p-2.5 rounded-xl"
                style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}
              >
                <l.icon size={20} />
              </span>
              <span className="flex-1">
                <span className="font-display text-xl font-bold block leading-tight">
                  {l.en}
                </span>
                <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                  {l.tl}
                </span>
              </span>
              {!!l.badge && (
                <span
                  className="text-xs font-bold text-white rounded-full px-2 py-0.5"
                  style={{ background: "var(--brand)" }}
                >
                  {l.badge}
                </span>
              )}
            </Link>
          ))}
          <button
            onClick={toggleSunset}
            className="w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 hover:bg-[var(--brand-soft)]"
          >
            <span
              className="p-2.5 rounded-xl"
              style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
            >
              {sunset ? <Sun size={20} /> : <Moon size={20} />}
            </span>
            <span className="text-left">
              <span className="font-display text-xl font-bold block leading-tight">
                {sunset ? "Day Mode" : "Sunset Mode"}
              </span>
              <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                {sunset ? "Ibalik ang araw" : "Dapit-hapon vibes"}
              </span>
            </span>
          </button>
        </nav>
        <div className="px-7 pb-8 space-y-4">
          {user ? (
            <button
              className="btn btn-outline w-full py-3"
              onClick={async () => {
                setNavOpen(false);
                await logout();
                router.push("/auth");
              }}
            >
              <LogOut size={18} /> Logout — {user.name.split(" ")[0]}
            </button>
          ) : (
            <Link
              href="/auth"
              onClick={() => setNavOpen(false)}
              className="btn btn-brand w-full py-3"
            >
              <LogIn size={18} /> Sign In / Sign Up
            </Link>
          )}
          <p className="text-xs text-center font-semibold" style={{ color: "var(--muted)" }}>
            🌿 Mula sa kalan at banga ng Calamba — dala ng araw.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    setNavOpen,
    setCartOpen,
    cartCount,
    user,
    unread,
    toasts,
    sunset,
    toggleSunset,
  } = useStore();
  const bare = pathname === "/" || pathname === "/auth" || pathname.startsWith("/admin");
  return (
    <>
      {!bare && (
        <header
          className="sticky top-0 z-40"
          style={{
            background: "color-mix(in srgb, var(--bg) 88%, transparent)",
            backdropFilter: "blur(12px)",
            borderBottom: "2px solid var(--line)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setNavOpen(true)}
              className="btn wood p-3 shadow-lg"
              aria-label="Buksan ang navigation"
            >
              <Menu size={22} />
            </button>
            <Link href="/home" className="mr-auto leading-none">
              <span className="font-display text-2xl sm:text-3xl font-bold lowercase">
                pilikart
              </span>
              <span
                className="hidden sm:block text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ color: "var(--leaf)" }}
              >
                PASO • kalan at banga
              </span>
            </Link>
            <button
              onClick={toggleSunset}
              className="btn btn-ghost p-2.5 hidden sm:inline-flex"
              aria-label="Toggle sunset mode"
              title={sunset ? "Day Mode" : "Sunset Mode"}
            >
              {sunset ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user && (
              <Link
                href="/notifications"
                className="btn btn-ghost p-2.5 relative"
                aria-label="Mga abiso"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-[10px] font-bold text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                    style={{ background: "var(--brand)" }}
                  >
                    {unread}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="btn btn-brand px-4 py-2.5 relative"
            >
              <ShoppingBasket size={18} />
              <span className="hidden sm:inline font-display">Cart</span>
              {cartCount > 0 && (
                <span
                  className="text-xs font-bold rounded-full px-2 py-0.5"
                  style={{ background: "#fff", color: "var(--brand)" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>
      )}
      {children}
      {!bare && (
        <footer className="wood mt-20">
          <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-8">
            <div>
              <p className="font-display text-3xl font-bold lowercase">pilikart</p>
              <p className="text-sm font-semibold opacity-80 mt-1">
                pumili ka + cart. Ang tindahan ng PASO.
              </p>
            </div>
            <div className="text-sm font-semibold space-y-2">
              <p className="font-display text-lg font-bold">PASO</p>
              <p className="opacity-80">
                An ode to indigenous ways of cooking — ang kalan at banga ng
                mga Calambeño, binuhay ng lakas ng araw.
              </p>
            </div>
            <div className="text-sm font-semibold space-y-2">
              <p className="font-display text-lg font-bold">
                <Leaf className="inline mr-1" size={16} /> Solarpunk Kitchen
              </p>
              <p className="opacity-80">Calamba, Laguna • 8AM – 9PM araw-araw</p>
              <p className="opacity-80">hello@pilikart.ph</p>
            </div>
          </div>
        </footer>
      )}
      <SideNav />
      <CartDrawer />
      {!bare && <PiliBot />}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] space-y-2 w-[92%] max-w-md pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-in card px-5 py-3.5 font-bold text-sm text-center"
            style={{ border: "2px solid var(--brand)" }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}