import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const securityCode = process.env.AMAP_SECURITY_JS_CODE;
  if (!securityCode) {
    return NextResponse.json({ message: "高德地图服务尚未配置安全密钥。" }, { status: 503 });
  }

  const { path = [] } = await params;
  const servicePath = path.join("/");
  if (!/^v3\/[a-zA-Z0-9_/-]+$/.test(servicePath) && servicePath !== "v4/map/styles") {
    return NextResponse.json({ message: "不支持的高德服务路径。" }, { status: 404 });
  }

  const upstreamHost = servicePath === "v4/map/styles" ? "https://webapi.amap.com" : "https://sg-restapi.opnavi.com";
  const upstreamUrl = new URL(`/${servicePath}`, upstreamHost);
  const incomingUrl = new URL(request.url);
  incomingUrl.searchParams.forEach((value, key) => {
    if (key.toLowerCase() !== "jscode") upstreamUrl.searchParams.append(key, value);
  });
  upstreamUrl.searchParams.set("jscode", securityCode);

  try {
    const upstream = await fetch(upstreamUrl, { cache: "no-store" });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "高德地图服务暂时不可用。" }, { status: 502 });
  }
}
