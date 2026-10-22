import { NextRequest } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  const rows = await db.select().from(settings);
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return Response.json({ settings: map });
}

export async function PUT(req: NextRequest) {
  await ensureSeed();
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return Response.json({ error: "Admins only." }, { status: 403 });
  }
  const body = await req.json();
  if (body.deliveryFee !== undefined) {
    const fee = Math.max(0, Math.floor(Number(body.deliveryFee) || 0));
    await db
      .insert(settings)
      .values({ key: "delivery_fee", value: String(fee) })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: String(fee) },
      });
  }
  return Response.json({ ok: true });
}