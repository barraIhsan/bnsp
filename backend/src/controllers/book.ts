import { Request, Response } from "express";
import { ResponseError } from "../errors/response";
import { prisma } from "../lib/prisma";

export const getBooks = async (req: Request, res: Response) => {
  const { categoryId, search } = req.query;

  const books = await prisma.book.findMany({
    where: {
      ...(categoryId ? { categoryId: String(categoryId) } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: String(search), mode: "insensitive" } },
              { author: { contains: String(search), mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: { select: { id: true, name: true } } },
  });
  res.json({ status: "success", data: books });
};

export const getBookById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const book = await prisma.book.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true } } },
  });
  if (!book) throw new ResponseError(404, "Book not found");
  res.json({ status: "success", data: book });
};

export const createBook = async (req: Request, res: Response) => {
  const { title, author, description, price, stock, categoryId } = req.body;
  if (!title || !author || !description || price == null || stock == null)
    throw new ResponseError(400, "All fields are required");

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new ResponseError(404, "Category not found");
  }

  const book = await prisma.book.create({
    data: {
      title,
      author,
      description,
      price,
      stock,
      categoryId: categoryId ?? null,
    },
    include: { category: { select: { id: true, name: true } } },
  });
  res.status(201).json({ status: "success", data: book });
};

export const updateBook = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, author, description, price, stock, categoryId } = req.body;

  const exists = await prisma.book.findUnique({ where: { id } });
  if (!exists) throw new ResponseError(404, "Book not found");

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new ResponseError(404, "Category not found");
  }

  const book = await prisma.book.update({
    where: { id },
    data: {
      title,
      author,
      description,
      price,
      stock,
      categoryId: categoryId ?? null,
    },
    include: { category: { select: { id: true, name: true } } },
  });
  res.json({ status: "success", data: book });
};

export const deleteBook = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const exists = await prisma.book.findUnique({ where: { id } });
  if (!exists) throw new ResponseError(404, "Book not found");

  await prisma.book.delete({ where: { id } });
  res.json({ status: "success", message: "Book deleted" });
};
