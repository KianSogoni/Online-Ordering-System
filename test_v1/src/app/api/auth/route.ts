import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  setSession,
  clearSession,
  getSessionUser,
} from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  const user = await getSessionUser();
  return Response.json({ user });
}

export async function POST(req: NextRequest) {
  await ensureSeed();
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "logout") {
    await clearSession();
    return Response.json({ ok: true });
  }

  if (action === "login") {
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const u = rows[0];
    if (!u || !verifyPassword(password, u.passwordHash)) {
      return Response.json(
        { error: "Mali ang email o password. Subukan ulit!" },
        { status: 401 }
      );
    }
    if (body.adminOnly && u.role !== "admin") {
      return Response.json(
        { error: "Hindi admin account ang email na ito." },
        { status: 403 }
      );
    }
    await setSession(u.id);
    return Response.json({
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        address: u.address,
        role: u.role,
      },
    });
  }

  if (action === "register") {
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();
    const password = String(body.password || "");
    if (!name || !email || !password || !address) {
      return Response.json(
        { error: "Kumpletuhin ang pangalan, email, address at password." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return Response.json(
        { error: "Password dapat ay 6 characters pataas." },
        { status: 400 }
      );
    }
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existing.length > 0) {
      return Response.json(
        { error: "May account na ang email na ito. Mag-sign in na lang!" },
        { status: 409 }
      );
    }
    const [u] = await db
      .insert(users)
      .values({
        name,
        email,
        phone,
        address,
        passwordHash: hashPassword(password),
      })
      .returning();
    await setSession(u.id);
    return Response.json({
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        address: u.address,
        role: u.role,
      },
    });
  }

  if (action === "update-profile") {
    const user = await getSessionUser();
    if (!user)
      return Response.json({ error: "Hindi ka naka-login." }, { status: 401 });
    const [u] = await db
      .update(users)
      .set({
        name: String(body.name || user.name),
        phone: String(body.phone ?? user.phone),
        address: String(body.address ?? user.address),
      })
      .where(eq(users.id, user.id))
      .returning();
    return Response.json({
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        address: u.address,
        role: u.role,
      },
    });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}