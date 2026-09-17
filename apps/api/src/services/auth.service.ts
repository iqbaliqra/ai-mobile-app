import jwt from "jsonwebtoken";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

const DEMO_USER = {
  id: "1",
  email: "demo@example.com",
  password: "password123",
  name: "Demo User",
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export function login(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail !== DEMO_USER.email ||
    password !== DEMO_USER.password
  ) {
    throw new Error("Invalid email or password");
  }

  const user: AuthUser = {
    id: DEMO_USER.id,
    email: DEMO_USER.email,
    name: DEMO_USER.name,
  };

  const token = jwt.sign(user, getJwtSecret(), { expiresIn: "7d" });

  return { token, user };
}

export function verifyToken(token: string): AuthUser {
  const payload = jwt.verify(token, getJwtSecret());

  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.id !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.name !== "string"
  ) {
    throw new Error("Invalid token");
  }

  return {
    id: payload.id,
    email: payload.email,
    name: payload.name,
  };
}
