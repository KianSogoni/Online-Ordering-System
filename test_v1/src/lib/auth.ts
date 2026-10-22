import { cookies } from "next/headers";
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET || "paso-kalan-at-banga-secret";
const COOKIE = "paso_session";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function setSession(userId: number) {
  const value = String(userId);
  const token = `${value}.${sign(value)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const [value, sig] = token.split(".");
  if (!value || !sig || sign(value) !== sig) return null;
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(value)))
    .limit(1);
  const u = rows[0];
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    address: u.address,
    role: u.role,
  };
}