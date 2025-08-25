import { SignJWT, jwtVerify } from "jose";

const secretText = import.meta.env.VITE_JWT_SECRET ?? "dev_secret_change_me";
const secret = new TextEncoder().encode(secretText);

export async function signToken(payload: object, exp: string = "1d") {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyToken<T>(token?: string): Promise<T | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);

    return payload as T;
  } catch {
    return null;
  }
}

export function readBearer(req: Request) {
  const h = req.headers.get?.("Authorization") as string | undefined;

  if (!h?.startsWith("Bearer ")) return undefined;

  return h.slice(7);
}
