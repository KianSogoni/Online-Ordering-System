import { NextRequest } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  const rows = await db.select().from(products).orderBy(products.id);
  return Response.json({ products: rows });
}

export async function PATCH(req: NextRequest) {
  await ensureSeed();
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Admins only." }, { status: 403 });
  }
  const body = await req.json();
  const id = Number(body.id);
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (typeof body.soldOut === "boolean") patch.soldOut = body.soldOut;
  if (typeof body.stock === "number") patch.stock = Math.max(0, body.stock);
  if (typeof body.price === "number") patch.price = Math.max(1, body.price);
  const [row] = await db
    .update(products)
    .set(patch)
    .where(eq(products.id, id))
    .returning();
  return Response.json({ product: row });
}