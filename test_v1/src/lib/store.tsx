"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

export type Product = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  soldOut: boolean;
  bestSeller: boolean;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: number;
  number: string;
  userId: number | null;
  customerName: string;
  phone: string;
  address: string;
  payment: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export type Notif = {
  id: number;
  orderId: number | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export type Toast = { id: number; message: string };

type Store = {
  user: User | null;
  authLoaded: boolean;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  budget: number | null;
  setBudget: (v: number | null) => void;
  deliveryFee: number;
  refreshSettings: () => Promise<void>;
  toasts: Toast[];
  toast: (msg: string) => void;
  sunset: boolean;
  toggleSunset: () => void;
  unread: number;
  refreshNotifs: () => Promise<void>;
  botOpen: boolean;
  setBotOpen: (v: boolean) => void;
};

const Ctx = createContext<Store | null>(null);

export const peso = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const pesoShort = (n: number) => "₱" + n.toLocaleString("en-PH");

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [budget, setBudgetState] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(50);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sunset, setSunset] = useState(false);
  const [unread, setUnread] = useState(0);
  const [botOpen, setBotOpen] = useState(false);
  const toastId = useRef(0);
  const loaded = useRef(false);

  const toast = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  // hydrate from localStorage + server
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const c = localStorage.getItem("paso_cart");
      if (c) setCart(JSON.parse(c));
      const b = localStorage.getItem("paso_budget");
      if (b) setBudgetState(Number(b));
      const pref = localStorage.getItem("paso_sunset");
      const hour = new Date().getHours();
      const auto = hour >= 18 || hour < 6;
      const on = pref !== null ? pref === "1" : auto;
      setSunset(on);
      if (on && !sessionStorage.getItem("paso_sunset_toast")) {
        sessionStorage.setItem("paso_sunset_toast", "1");
        setTimeout(
          () => toast("🌇 Lumulubog na ang araw. Sunset Mode activated."),
          1200
        );
      }
    } catch {
      /* ignore */
    }
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {})
      .finally(() => setAuthLoaded(true));
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setDeliveryFee(Number(d.settings?.delivery_fee || 50)))
      .catch(() => {});
  }, [toast]);

  useEffect(() => {
    document.documentElement.dataset.theme = sunset ? "sunset" : "day";
  }, [sunset]);

  useEffect(() => {
    try {
      localStorage.setItem("paso_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const setBudget = useCallback((v: number | null) => {
    setBudgetState(v);
    try {
      if (v === null) localStorage.removeItem("paso_budget");
      else localStorage.setItem("paso_budget", String(v));
    } catch {}
  }, []);

  const toggleSunset = useCallback(() => {
    setSunset((s) => {
      const next = !s;
      try {
        localStorage.setItem("paso_sunset", next ? "1" : "0");
      } catch {}
      toast(next ? "🌇 Sunset Mode activated. Ang lambing ng dapit-hapon." : "☀️ Balik-araw! Day Mode activated.");
      return next;
    });
  }, [toast]);

  const addToCart = useCallback(
    (p: Product, qty = 1) => {
      setCart((c) => {
        const found = c.find((i) => i.id === p.id);
        if (found)
          return c.map((i) =>
            i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, p.stock) } : i
          );
        return [
          ...c,
          { id: p.id, name: p.name, price: p.price, image: p.image, qty },
        ];
      });
      toast(`🧺 Nadagdag sa cart: ${p.name}`);
    },
    [toast]
  );

  const setQty = useCallback((id: number, qty: number) => {
    setCart((c) =>
      qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const logout = useCallback(async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setUser(null);
    setUnread(0);
    toast("Paalam! Balik ka agad, ha? 👋");
  }, [toast]);

  const refreshSettings = useCallback(async () => {
    const d = await fetch("/api/settings").then((r) => r.json());
    setDeliveryFee(Number(d.settings?.delivery_fee || 50));
  }, []);

  const refreshNotifs = useCallback(async () => {
    try {
      const d = await fetch("/api/notifications").then((r) => r.json());
      setUnread(
        (d.notifications || []).filter((n: Notif) => !n.read).length
      );
    } catch {}
  }, []);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }
    refreshNotifs();
    const t = setInterval(refreshNotifs, 12000);
    return () => clearInterval(t);
  }, [user, refreshNotifs]);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider
      value={{
        user,
        authLoaded,
        setUser,
        logout,
        cart,
        addToCart,
        setQty,
        clearCart,
        cartTotal,
        cartCount,
        cartOpen,
        setCartOpen,
        navOpen,
        setNavOpen,
        budget,
        setBudget,
        deliveryFee,
        refreshSettings,
        toasts,
        toast,
        sunset,
        toggleSunset,
        unread,
        refreshNotifs,
        botOpen,
        setBotOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}