import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db.js";
import {
  createSession,
  normalizeAccountIdentifier,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  verifyPassword,
} from "../../../../lib/auth.js";

const invalidCredentials = () =>
  NextResponse.json(
    { message: "邮箱、手机号或密码错误。" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );

export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return invalidCredentials();
  }

  const identifier = normalizeAccountIdentifier(input?.identity);
  if (!identifier || typeof input?.password !== "string") {
    return invalidCredentials();
  }

  try {
    const result = await pool.query(
      "SELECT id, password_hash FROM accounts WHERE identifier = $1",
      [identifier],
    );
    const account = result.rows[0];
    if (!account || !(await verifyPassword(input.password, account.password_hash))) {
      return invalidCredentials();
    }

    const { token, expiresAt } = await createSession(account.id);
    const response = NextResponse.json({ account: { id: account.id } });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json(
      { message: "登录服务暂时不可用，请稍后重试。" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
