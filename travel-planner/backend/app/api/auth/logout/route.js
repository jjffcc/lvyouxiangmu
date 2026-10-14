import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  expiredSessionCookieOptions,
  revokeSession,
  SESSION_COOKIE_NAME,
} from "../../../../lib/auth.js";

export async function POST() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  let response;

  try {
    await revokeSession(token);
    response = NextResponse.json({ message: "已退出登录。" });
  } catch {
    response = NextResponse.json(
      { message: "退出服务暂时不可用，请稍后重试。" },
      { status: 503 },
    );
  }

  response.cookies.set(SESSION_COOKIE_NAME, "", expiredSessionCookieOptions());
  response.headers.set("Cache-Control", "no-store");
  return response;
}
