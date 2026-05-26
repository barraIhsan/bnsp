export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  username: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category: { id: string; name: string };
  createdAt: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  bookId: string;
  book: Book;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  book: { id: string; title: string; author: string };
}

export interface Order {
  id: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}
