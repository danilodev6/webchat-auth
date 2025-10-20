import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, SessionData } from "../types/session.ts";

declare module "express-serve-static-core" {
  interface Request {
    session?: SessionData;
  }
}

export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token;
  req.session = { user: null };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined");
    return next();
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.session.user = { id: decoded.id, email: decoded.email };
  } catch (err) {
    console.error("Invalid or expired token:", err);
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
