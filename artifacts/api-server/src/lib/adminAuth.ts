import { Request, Response, NextFunction } from "express";
import { db, adminSessionsTable } from "@workspace/db";
import { eq, gt } from "drizzle-orm";
import { randomBytes } from "crypto";
import { logger } from "./logger";

const ADMIN_USERNAME = "btadmin";
const ADMIN_PASSWORD = "#btadminpass26#";
const SESSION_HOURS = 24;

export async function createAdminSession(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await db.insert(adminSessionsTable).values({ token, expiresAt });
  return token;
}

export async function validateAdminSession(token: string): Promise<boolean> {
  const sessions = await db
    .select()
    .from(adminSessionsTable)
    .where(eq(adminSessionsTable.token, token))
    .limit(1);
  if (!sessions.length) return false;
  const session = sessions[0];
  if (new Date() > session.expiresAt) {
    await db.delete(adminSessionsTable).where(eq(adminSessionsTable.token, token));
    return false;
  }
  return true;
}

export async function deleteAdminSession(token: string): Promise<void> {
  await db.delete(adminSessionsTable).where(eq(adminSessionsTable.token, token));
}

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  const valid = await validateAdminSession(token);
  if (!valid) {
    res.status(401).json({ error: "Session expired or invalid" });
    return;
  }
  next();
}
