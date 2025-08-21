import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const jwtSecret = process.env.JWT_SECRET || "your_secret_key";

interface JwtPayload {
  id: string;
}

export default async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get token from "Bearer token"

  if (!token)
    return res.status(401).json({ success: false, error: "No token provided" });

  jwt.verify(token, jwtSecret, async (err, payload) => {
    if (err)
      return res.status(403).json({ success: false, error: "Forbidden" });

    if (payload && typeof payload === "object" && "id" in payload) {
      // Type guard to ensure payload has an id property
      const user = await User.findById(payload.id);
      if (user) {
        req.user = user; // Attach user to request
        next();
      } else {
        res.status(404).json({ success: false, error: "User not found" });
      }
    } else {
      res.status(403).json({ success: false, error: "Invalid token" });
    }
  });
};
