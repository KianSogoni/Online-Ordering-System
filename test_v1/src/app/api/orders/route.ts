import { NextRequest } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products, notifications, settings } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

const STATUSES = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

export function orderNumber(id: number) {
  return `PSO-${1023 + id}`;
}

async function withItems(rows: (typeof orders.$inferSelect)[]) {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const items = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, ids));
  return rows.map((o) => ({
    ...o,
    number: orderNumber(o.id),
    items: items.filter((i) => i.orderId === o.id),
  }));
}

export async function GET(req: NextRequest) {
  await ensureSeed();
  const user = await getSessionUser();
  const all = req.nextUrl.searchParams.get("all") === "1";
  if (all) {
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Admins only." }, { status: 403 });
    }
    const rows = await db.select().from(orders).orderBy(desc(orders.id));
    return Response.json({ orders: await withItems(rows) });
  }
  if (!user) return Response.json({ orders: [] });
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.id));
  return Response.json({ orders: await withItems(rows) });
}

export async function POST(req: NextRequest) {
  await ensureSeed();
  const user = await getSessionUser();
  const body = await req.json();
  const items: { productId: number; qty: number }[] = Array.isArray(body.items)
    ? body.items
    : [];
  const name = String(body.name || user?.name || "").trim();
  const phone = String(body.phone || user?.phone || "").trim();
  const address = String(body.address || user?.address || "").trim();
  const payment = body.payment === "gcash" ? "gcash" : "cod";

  if (items.length === 0)
    return Response.json({ error: "Walang laman ang cart mo!" }, { status: 400 });
  if (!name || !address)
    return Response.json(
      { error: "Kailangan ang pangalan at delivery address." },
      { status: 400 }
    );

  const ids = items.map((i) => Number(i.productId));
  const prods = await db.select().from(products).where(inArray(products.id, ids));
  let subtotal = 0;
  const lineItems: { productId: number; name: string; price: number; qty: number }[] =
    [];
  for (const item of items) {
    const p = prods.find((x) => x.id === Number(item.productId));
    const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
    if (!p)
      return Response.json({ error: "May item na hindi na available." }, { status: 400 });
    if (p.soldOut || p.stock < qty)
      return Response.json(
        { error: `Ubos na o kulang ang stock ng ${p.name}.` },
        { status: 400 }
      );
    subtotal += p.price * qty;
    lineItems.push({ productId: p.id, name: p.name, price: p.price, qty });
  }

  const feeRow = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "delivery_fee"))
    .limit(1);
  const deliveryFee = Number(feeRow[0]?.value || 50);

  const [order] = await db
    .insert(orders)
    .values({
      userId: user?.id ?? null,
      customerName: name,
      phone,
      address,
      payment,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    })
    .returning();

  await db.insert(orderItems).values(
    lineItems.map((li) => ({ ...li, orderId: order.id }))
  );

  for (const li of lineItems) {
    const p = prods.find((x) => x.id === li.productId)!;
    const newStock = p.stock - li.qty;
    await db
      .update(products)
      .set({ stock: newStock, soldOut: newStock <= 0 ? true : p.soldOut })
      .where(eq(products.id, p.id));
  }

  if (user) {
    await db.insert(notifications).values({
      userId: user.id,
      orderId: order.id,
      message: `Natanggap na namin ang order mo na ${orderNumber(order.id)}! Abangan ang mainit na pagkain. 🍲`,
    });
  }

  return Response.json({ order: { ...order, number: orderNumber(order.id) } });
}

export async function PATCH(req: NextRequest) {
  await ensureSeed();
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Admins only." }, { status: 403 });
  }
  const body = await req.json();
  const id = Number(body.id);
  const status = String(body.status || "");
  if (!id || !STATUSES.includes(status)) {
    return Response.json({ error: "Invalid order o status." }, { status: 400 });
  }
  const [order] = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, id))
    .returning();
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

  if (order.userId) {
    const msgs: Record<string, string> = {
      Preparing: `Nasa kalan na ang order mo na ${orderNumber(order.id)}! Niluluto na namin ito sa banga. 🔥`,
      "Out for Delivery": `Palapit na! On the way na ang rider ng ${orderNumber(order.id)}. 🛵`,
      Delivered: `Naihain na ang ${orderNumber(order.id)}. Kain na, at salamat sa pag-order sa PASO! 💚`,
      Pending: `Binalik sa Pending ang order mo na ${orderNumber(order.id)}.`,
    };
    await db.insert(notifications).values({
      userId: order.userId,
      orderId: order.id,
      message: msgs[status] || `Update sa order ${orderNumber(order.id)}: ${status}`,
    });
  }
  return Response.json({ order: { ...order, number: orderNumber(order.id) } });
}