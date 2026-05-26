import { Request, Response } from "express";
import { ResponseError } from "../errors/response";
import { prisma } from "../lib/prisma";

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.json({ status: "success", data: categories });
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new ResponseError(404, "Category not found");
  res.json({ status: "success", data: category });
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) throw new ResponseError(400, "Name is required");

  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) throw new ResponseError(409, "Category already exists");

  const category = await prisma.category.create({ data: { name } });
  res.status(201).json({ status: "success", data: category });
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name } = req.body;

  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) throw new ResponseError(404, "Category not found");

  const category = await prisma.category.update({
    where: { id },
    data: { name },
  });
  res.json({ status: "success", data: category });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) throw new ResponseError(404, "Category not found");

  await prisma.category.delete({ where: { id } });
  res.json({ status: "success", message: "Category deleted" });
};
