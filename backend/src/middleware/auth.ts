import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ResponseError } from "../errors/response";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new ResponseError(401, "Unauthorized");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch {
    throw new ResponseError(401, "Invalid or expired token");
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "ADMIN") throw new ResponseError(403, "Forbidden");
  next();
};
