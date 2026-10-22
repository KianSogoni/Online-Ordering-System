import { db } from "@/db";
import { users, products, settings } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { sql } from "drizzle-orm";

const seedProducts = [
  {
    name: "Chicken Adobo",
    tagline: "Ang classic ng bawat tahanan",
    description:
      "Slow-braised chicken sa toyo, suka, bawang at laurel — niluto sa banga hanggang lumapot ang sarsa. Comfort in every subo.",
    price: 145,
    category: "pagkain",
    image: "/images/adobo.png",
    stock: 18,
    bestSeller: true,
  },
  {
    name: "Sinigang na Baboy",
    tagline: "Asim na gising na gising",
    description:
      "Malinamnam na sabaw ng sampalok with tender pork, kangkong, labanos at kamatis. Mainit pa mula sa kalan.",
    price: 165,
    category: "pagkain",
    image: "/images/sinigang.png",
    stock: 12,
    bestSeller: false,
  },
  {
    name: "Lumpiang Shanghai",
    tagline: "Krispy, walang katapusang kagat",
    description:
      "Golden crispy rolls ng giniling na baboy at gulay, with sweet chili sawsawan. Isang order? Hindi kakasya.",
    price: 95,
    category: "pagkain",
    image: "/images/lumpia.png",
    stock: 30,
    bestSeller: true,
  },
  {
    name: "Kare-Kare",
    tagline: "Pista sa bawat sandok",
    description:
      "Rich peanut stew with oxtail, talong, sitaw at pechay. May kasamang bagoong — alam na namin ang trip mo.",
    price: 185,
    category: "pagkain",
    image: "/images/karekare.png",
    stock: 8,
    bestSeller: false,
  },
  {
    name: "Halo-Halo Espesyal",
    tagline: "Haluin mo, enjoy-in mo",
    description:
      "Bundok ng yelo, ube ice cream, leche flan, saging, beans at jelly. Ang pambansang dessert ng tag-init.",
    price: 120,
    category: "panghimagas",
    image: "/images/halohalo.png",
    stock: 15,
    bestSeller: true,
  },
  {
    name: "Leche Flan",
    tagline: "Kutong karamelo, malasutlang sarap",
    description:
      "Silky steamed custard with deep amber caramel. Ginawa sa banga, gaya ng sa lola.",
    price: 90,
    category: "panghimagas",
    image: "/images/lecheflan.png",
    stock: 20,
    bestSeller: false,
  },
  {
    name: "Bibingka",
    tagline: "Usok ng kalan, tamis ng Pasko",
    description:
      "Clay-oven rice cake sa dahon ng saging, topped with itlog na maalat, keso at niyog. Calamba heritage on a plate.",
    price: 75,
    category: "panghimagas",
    image: "/images/bibingka.png",
    stock: 25,
    bestSeller: false,
  },
  {
    name: "Buko Pandan Shake",
    tagline: "Presko mula sa puno",
    description:
      "Creamy buko shake with pandan jelly at malalambot na strips ng young coconut. Zero waste — buo ang buko, gamit lahat.",
    price: 85,
    category: "inumin",
    image: "/images/bukopandan.png",
    stock: 22,
    bestSeller: false,
  },
  {
    name: "Calamansi Cooler",
    tagline: "Kiliti ng asim, lunok ng sarap",
    description:
      "Fresh-squeezed calamansi over ice with a hint of honey. Solar-chilled, tulad ng lahat ng drinks namin.",
    price: 65,
    category: "inumin",
    image: "/images/calamansi.png",
    stock: 40,
    bestSeller: false,
  },
];

let seedPromise: Promise<void> | null = null;

export function ensureSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products);
      if (count === 0) {
        await db.insert(products).values(seedProducts);
      }
      await db
        .insert(settings)
        .values({ key: "delivery_fee", value: "50" })
        .onConflictDoNothing();
      const existingUsers = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users);
      if (existingUsers[0].count === 0) {
        await db.insert(users).values([
          {
            name: "Tindahan Owner",
            email: "admin@pilikart.ph",
            phone: "09171234567",
            address: "PASO Kitchen, Brgy. Uno, Calamba, Laguna",
            passwordHash: hashPassword("admin123"),
            role: "admin",
          },
          {
            name: "Maria Santos",
            email: "maria@example.com",
            phone: "09189876543",
            address: "123 Rizal St., Brgy. Real, Calamba, Laguna",
            passwordHash: hashPassword("demo1234"),
            role: "customer",
          },
        ]);
      }
    })().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}