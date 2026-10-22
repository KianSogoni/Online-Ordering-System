import { NextRequest } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  const user = await getSessionUser();
  if (!user) return Response.json({ notifications: [] });
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.id))
    .limit(50);
  return Response.json({ notifications: rows });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return Response.json({ ok: true });
  await req.json().catch(() => ({}));
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, user.id));
  return Response.json({ ok: true });
}