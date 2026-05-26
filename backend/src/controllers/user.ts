import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ResponseError } from "../errors/response";
import { prisma } from "../lib/prisma";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
  });
  res.json({ status: "success", data: users });
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, role: true, createdAt: true },
  });
  if (!user) throw new ResponseError(404, "User not found");
  res.json({ status: "success", data: user });
};

export const createUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (!username || !password)
    throw new ResponseError(400, "Username and password are required");

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) throw new ResponseError(409, "Username already taken");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashed, role: role ?? "USER" },
    select: { id: true, username: true, role: true, createdAt: true },
  });
  res.status(201).json({ status: "success", data: user });
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { username, password, role } = req.body;

  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) throw new ResponseError(404, "User not found");

  const data: Record<string, unknown> = {};
  if (username) data.username = username;
  if (password) data.password = await bcrypt.hash(password, 10);
  if (role) data.role = role;

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, username: true, role: true, createdAt: true },
  });
  res.json({ status: "success", data: user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) throw new ResponseError(404, "User not found");

  await prisma.user.delete({ where: { id } });
  res.json({ status: "success", message: "User deleted" });
};
