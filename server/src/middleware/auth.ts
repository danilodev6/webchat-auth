// server/src/middleware/auth.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, SessionData } from "../types/session.ts";

declare module "express-serve-static-core" {
  interface Request {
    session?: SessionData;
  }
}

export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  req.session = { user: null };

  const token = req.cookies?.access_token;

  // Early return if no token - DON'T try to verify
  if (!token) {
    return next();
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined");
    return next();
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.session.user = { id: decoded.id, email: decoded.email };
  } catch (err) {
    console.error("Token verification failed:", err instanceof Error ? err.message : err);
  }

  next();
}

// export interface JwtPayload {
//   id: string;
//   email: string;
// }
//
// export interface SessionData {
//   user: JwtPayload | null;
// }
