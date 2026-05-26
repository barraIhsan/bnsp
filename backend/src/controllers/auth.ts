import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ResponseError } from "../errors/response";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    throw new ResponseError(400, "Username and password are required");

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) throw new ResponseError(409, "Username already taken");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashed },
    select: { id: true, username: true, role: true, createdAt: true },
  });

  res.status(201).json({ status: "success", data: user });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    throw new ResponseError(400, "Username and password are required");

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new ResponseError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ResponseError(401, "Invalid credentials");

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ status: "success", data: { token, role: user.role } });
};
