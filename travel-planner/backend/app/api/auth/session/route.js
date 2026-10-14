import { NextResponse } from "next/server";
import { getAuthenticatedAccount } from "../../../../lib/auth.js";

export async function GET() {
  try {
    const account = await getAuthenticatedAccount();
    if (!account) {
      return NextResponse.json(
        { message: "未登录或登录状态已过期。" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { account },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "暂时无法验证登录状态，请稍后重试。" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
