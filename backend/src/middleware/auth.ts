import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { GoogleUserSchema } from "../schemas/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.header("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ response: null, error: true, message: "Unauthenticated" });
    }
    const token = auth.slice("Bearer ".length);
    
    // Try to verify as NextAuth JWT first
    try {
      const nextAuthSecret = process.env.NEXTAUTH_SECRET;
      if (!nextAuthSecret) {
        throw new Error("NEXTAUTH_SECRET not configured");
      }
      
      const payload = jwt.verify(token, nextAuthSecret) as any;
      (req as any).user = payload;
      return next();
    } catch (nextAuthError: any) {
      // Fall back to our custom JWT
      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error("JWT_SECRET not configured");
        }
        
        const payload = jwt.verify(token, secret) as any;
        (req as any).user = payload;
        return next();
      } catch (customError: any) {
        throw customError;
      }
    }
  } catch (e: any) {
    return res
      .status(401)
      .json({
        response: null,
        error: true,
        message: "Invalid or expired token",
      });
  }
}
