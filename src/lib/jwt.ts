import * as jose from "jose";
import { env } from "./env";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export type JwtPayload = {
  userId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
};

export const signToken = async (payload: JwtPayload, expiresIn = "7d") => {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
  return jwt;
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const { payload } = await jose.jwtVerify(token, JWT_SECRET);
  return payload as JwtPayload;
};
