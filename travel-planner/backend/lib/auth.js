import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { pool } from "./db.js";

const scrypt = promisify(scryptCallback);
const PASSWORD_COST = 16_384;
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_BYTES = 64;

export const SESSION_COOKIE_NAME = "trip_session";
export const SESSION_LIFETIME_SECONDS = 7 * 24 * 60 * 60;

export function normalizeAccountIdentifier(value) {
  const identifier = typeof value === "string" ? value.trim() : "";
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  const isMainlandMobile = /^1[3-9]\d{9}$/.test(identifier);

  if (!isEmail && !isMainlandMobile) return null;
  return isEmail ? identifier.toLowerCase() : identifier;
}

export async function hashPassword(password) {
  const salt = randomBytes(PASSWORD_SALT_BYTES);
  const derivedKey = await scrypt(password, salt, PASSWORD_KEY_BYTES, {
    N: PASSWORD_COST,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return `scrypt$${PASSWORD_COST}$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password, passwordHash) {
  if (typeof password !== "string") return false;
  const passwordLength = Array.from(password).length;
  if (passwordLength < 8 || passwordLength > 64) return false;

  const [scheme, cost, saltText, keyText, ...extra] = passwordHash.split("$");
  if (scheme !== "scrypt" || cost !== String(PASSWORD_COST) || !saltText || !keyText || extra.length) {
    return false;
  }

  const salt = Buffer.from(saltText, "base64url");
  const expectedKey = Buffer.from(keyText, "base64url");
  if (salt.length !== PASSWORD_SALT_BYTES || expectedKey.length !== PASSWORD_KEY_BYTES) {
    return false;
  }

  const actualKey = await scrypt(password, salt, PASSWORD_KEY_BYTES, {
    N: PASSWORD_COST,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return timingSafeEqual(actualKey, expectedKey);
}

function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(accountId) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_SECONDS * 1000);

  await pool.query("DELETE FROM auth_sessions WHERE expires_at <= now()");
  await pool.query(
    "INSERT INTO auth_sessions (token_hash, account_id, expires_at) VALUES ($1, $2, $3)",
    [hashSessionToken(token), accountId, expiresAt],
  );

  return { token, expiresAt };
}

export function sessionCookieOptions(expiresAt) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    maxAge: SESSION_LIFETIME_SECONDS,
  };
}

export function expiredSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };
}

export async function getAuthenticatedAccount() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const result = await pool.query(
    `SELECT accounts.id
     FROM auth_sessions
     JOIN accounts ON accounts.id = auth_sessions.account_id
     WHERE auth_sessions.token_hash = $1 AND auth_sessions.expires_at > now()`,
    [hashSessionToken(token)],
  );
  return result.rows[0] ?? null;
}

export async function revokeSession(token) {
  if (!token) return;
  await pool.query("DELETE FROM auth_sessions WHERE token_hash = $1", [hashSessionToken(token)]);
}
