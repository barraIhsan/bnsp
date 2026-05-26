import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ResponseError } from "../errors/response";
import { prisma } from "../lib/prisma";

export const getCart = async (req: AuthRequest, res: Response) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user!.id },
    include: {
      book: { include: { category: { select: { id: true, name: true } } } },
    },
  });
  res.json({ status: "success", data: items });
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  const { bookId, quantity } = req.body;
  if (!bookId) throw new ResponseError(400, "bookId is required");

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new ResponseError(404, "Book not found");

  const qty = quantity ?? 1;
  if (book.stock < qty) throw new ResponseError(400, "Insufficient stock");

  const item = await prisma.cartItem.upsert({
    where: { userId_bookId: { userId: req.user!.id, bookId } },
    update: { quantity: { increment: qty } },
    create: { userId: req.user!.id, bookId, quantity: qty },
    include: { book: true },
  });
  res.status(201).json({ status: "success", data: item });
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { quantity } = req.body;
  if (!quantity || quantity < 1)
    throw new ResponseError(400, "Quantity must be at least 1");

  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item || item.userId !== req.user!.id)
    throw new ResponseError(404, "Cart item not found");

  const book = await prisma.book.findUnique({ where: { id: item.bookId } });
  if (book && book.stock < quantity)
    throw new ResponseError(400, "Insufficient stock");

  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
    include: { book: true },
  });
  res.json({ status: "success", data: updated });
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item || item.userId !== req.user!.id)
    throw new ResponseError(404, "Cart item not found");

  await prisma.cartItem.delete({ where: { id } });
  res.json({ status: "success", message: "Item removed from cart" });
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user!.id } });
  res.json({ status: "success", message: "Cart cleared" });
};
