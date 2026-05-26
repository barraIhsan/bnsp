import { useEffect, useState } from "react";

import api from "../../api/axios";

import {
  ShoppingCart,
  Package,
  Wallet,
  BookOpen,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface Order {
  id: string;
  total: number;
  createdAt: string;
}

interface CartItem {
  id: string;
}

interface Book {
  id: string;
}

export const UserDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, cartRes, booksRes] = await Promise.all([
          api.get("/orders/my"),
          api.get("/cart"),
          api.get("/books"),
        ]);

        setOrders(ordersRes.data.data);

        setCartItems(cartRes.data.data);

        setBooks(booksRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1
          className="text-4xl font-bold text-white mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Reader Dashboard
        </h1>

        <p className="text-slate-400">Welcome to the bookstore</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          {
            label: "Books Available",
            value: books.length,
            icon: BookOpen,
          },
          {
            label: "My Orders",
            value: orders.length,
            icon: Package,
          },
          {
            label: "Cart Items",
            value: cartItems.length,
            icon: ShoppingCart,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-amber-500/10 rounded-lg">
                <Icon className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <p className="text-slate-400 text-sm">{label}</p>

            <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Wallet className="w-5 h-5 text-amber-400" />

            <h2 className="text-white text-xl font-semibold">Recent Orders</h2>
          </div>

          {orders.length === 0 ? (
            <p className="text-slate-500 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0"
                >
                  <div>
                    <p className="text-white font-medium">
                      Order #{order.id.slice(0, 8)}
                    </p>

                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-amber-400 font-semibold">
                    Rp {order.total.toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-slate-400 text-sm">Total Spent</p>

            <h3 className="text-2xl font-bold text-white mt-1">
              Rp {totalSpent.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* About */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4">About Us</h2>

            <p className="text-slate-400 text-sm leading-relaxed">
              Our bookstore provides carefully selected books from various
              genres — fiction, technology, history, education, and more.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-white text-xl font-semibold mb-4">
              Contact Us
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3 items-start">
                <Mail className="w-4 h-4 text-amber-400 mt-0.5" />

                <p className="text-slate-300">support@bookstore.com</p>
              </div>

              <div className="flex gap-3 items-start">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5" />

                <p className="text-slate-300">+62 812 3456 7890</p>
              </div>

              <div className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5" />

                <p className="text-slate-300">Palembang, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
