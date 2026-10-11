import { randomUUID } from "node:crypto";
import { pool } from "../../../../lib/db.js";
import { hashPassword, normalizeAccountIdentifier } from "../../../../lib/auth.js";

function registrationErrors({ identity, password, confirmPassword }) {
  const errors = {};
  const normalizedIdentity = normalizeAccountIdentifier(identity);

  if (!normalizedIdentity) {
    errors.identity = "请输入有效邮箱或 11 位中国大陆手机号。";
  }
  const passwordLength = typeof password === "string" ? Array.from(password).length : 0;
  if (passwordLength < 8 || passwordLength > 64) {
    errors.password = "密码长度需为 8–64 个字符。";
  }
  if (typeof confirmPassword !== "string" || password !== confirmPassword) {
    errors.confirmPassword = "两次输入的密码不一致。";
  }

  return {
    errors,
    identity: normalizedIdentity,
  };
}

export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return Response.json({ message: "注册信息格式无效。" }, { status: 400 });
  }

  const { errors, identity } = registrationErrors(input && typeof input === "object" ? input : {});
  if (Object.keys(errors).length) {
    return Response.json({ fieldErrors: errors }, { status: 400 });
  }

  const passwordHash = await hashPassword(input.password);
  try {
    const id = randomUUID();
    await pool.query(
      "INSERT INTO accounts (id, identifier, password_hash) VALUES ($1, $2, $3)",
      [id, identity, passwordHash],
    );
    return Response.json({ message: "账户已创建，请使用注册信息登录。" }, { status: 201 });
  } catch (error) {
    if (error.code === "23505") {
      return Response.json(
        { fieldErrors: { identity: "该邮箱或手机号已注册。" } },
        { status: 409 },
      );
    }
    return Response.json(
      { message: "注册服务暂时不可用，请稍后重试。" },
      { status: 503 },
    );
  }
}
