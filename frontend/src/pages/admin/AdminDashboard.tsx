import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";

import {
  BookOpen,
  Users,
  Tag,
  Package,
  Wallet,
  AlertTriangle,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  totalCategories: number;
  totalOrders: number;
  revenue: number;
  lowStockBooks: {
    id: string;
    title: string;
    stock: number;
  }[];
  recentOrders: {
    id: string;
    total: number;
    createdAt: string;
    user: {
      username: string;
    };
  }[];
}

const cards = [
  {
    label: "Manage Books",
    icon: BookOpen,
    to: "/admin/books",
    desc: "Add, edit, or remove books",
  },
  {
    label: "Manage Categories",
    icon: Tag,
    to: "/admin/categories",
    desc: "Organize book categories",
  },
  {
    label: "Manage Users",
    icon: Users,
    to: "/admin/users",
    desc: "View and manage user accounts",
  },
  {
    label: "All Orders",
    icon: Package,
    to: "/admin/orders",
    desc: "Browse all customer orders",
  },
];

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [usersRes, booksRes, categoriesRes, ordersRes] =
          await Promise.all([
            api.get("/users"),
            api.get("/books"),
            api.get("/categories"),
            api.get("/orders"),
          ]);

        const users = usersRes.data.data;

        const books = booksRes.data.data;

        const categories = categoriesRes.data.data;

        const orders = ordersRes.data.data;

        const revenue = orders.reduce(
          (acc: number, order: any) => acc + order.total,
          0,
        );

        const lowStockBooks = books
          .filter((book: any) => book.stock <= 5)
          .slice(0, 5);

        const recentOrders = orders.slice(0, 5);

        setStats({
          totalUsers: users.length,
          totalBooks: books.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          revenue,
          lowStockBooks,
          recentOrders,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1
          className="text-4xl font-bold text-white mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Admin Dashboard
        </h1>

        <p className="text-slate-400">Manage your bookstore</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-10">
        {[
          {
            label: "Users",
            value: stats.totalUsers,
            icon: Users,
          },
          {
            label: "Books",
            value: stats.totalBooks,
            icon: BookOpen,
          },
          {
            label: "Categories",
            value: stats.totalCategories,
            icon: Tag,
          },
          {
            label: "Orders",
            value: stats.totalOrders,
            icon: Package,
          },
          {
            label: "Revenue",
            value: `Rp ${stats.revenue.toLocaleString("id-ID")}`,
            icon: Wallet,
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

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-white text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map(({ label, icon: Icon, to, desc }) => (
            <Link
              key={to}
              to={to}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex gap-4 items-start hover:border-amber-800 transition-colors group"
            >
              <div className="p-2.5 bg-amber-500/10 rounded-lg">
                <Icon className="w-5 h-5 text-amber-400" />
              </div>

              <div>
                <p className="text-white font-semibold group-hover:text-amber-400 transition-colors">
                  {label}
                </p>

                <p className="text-slate-500 text-sm mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />

            <h2 className="text-white text-xl font-semibold">
              Low Stock Books
            </h2>
          </div>

          <div className="space-y-4">
            {stats.lowStockBooks.length === 0 ? (
              <p className="text-slate-500 text-sm">No low stock books</p>
            ) : (
              stats.lowStockBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0"
                >
                  <p className="text-slate-200">{book.title}</p>

                  <span className="text-red-400 text-sm">
                    {book.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Package className="w-5 h-5 text-amber-400" />

            <h2 className="text-white text-xl font-semibold">Recent Orders</h2>
          </div>

          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-slate-500 text-sm">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-b border-slate-800 pb-3 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-slate-200 font-medium">
                      {order.user.username}
                    </p>

                    <span className="text-amber-400 text-sm font-medium">
                      Rp {order.total.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
