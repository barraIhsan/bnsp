import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ResponseError } from "../errors/response";
import { prisma } from "../lib/prisma";

export const checkout = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { note } = req.body;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { book: true },
  });

  if (cartItems.length === 0) throw new ResponseError(400, "Cart is empty");

  for (const item of cartItems) {
    if (item.book.stock < item.quantity)
      throw new ResponseError(
        400,
        `Insufficient stock for "${item.book.title}"`,
      );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        note,
        items: {
          create: cartItems.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.book.price,
          })),
        },
      },
      include: { items: { include: { book: true } } },
    });

    for (const item of cartItems) {
      await tx.book.update({
        where: { id: item.bookId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  res.status(201).json({ status: "success", data: order });
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: {
      items: {
        include: { book: { select: { id: true, title: true, author: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ status: "success", data: orders });
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { book: true } } },
  });

  if (!order) throw new ResponseError(404, "Order not found");
  if (req.user!.role !== "ADMIN" && order.userId !== req.user!.id)
    throw new ResponseError(403, "Forbidden");

  res.json({ status: "success", data: order });
};

export const getAllOrders = async (_req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, username: true } },
      items: { include: { book: { select: { id: true, title: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ status: "success", data: orders });
};
