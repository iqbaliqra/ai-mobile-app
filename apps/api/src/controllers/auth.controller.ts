import { Request, Response } from "express";
import { login } from "../services/auth.service";

export function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = login(email, password);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to log in";

    if (message === "Invalid email or password") {
      return res.status(401).json({
        success: false,
        message,
      });
    }

    if (message.includes("JWT_SECRET")) {
      return res.status(503).json({
        success: false,
        message,
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to log in",
    });
  }
}

export function getMe(req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
}
