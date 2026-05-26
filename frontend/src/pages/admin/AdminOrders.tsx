import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Order } from "../../types";
import { Package } from "lucide-react";

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders")
      .then(({ data }) => setOrders(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1
        className="text-4xl font-bold text-white mb-8"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        All Orders
      </h1>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-slate-300 text-sm font-medium">
                    {order.user?.username}
                  </p>
                  <p className="text-slate-500 text-xs font-mono mt-0.5">
                    {order.id}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-amber-400 font-bold text-lg">
                  Rp {order.total.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="space-y-1.5 border-t border-slate-800 pt-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {item.book.title}{" "}
                      <span className="text-slate-500">×{item.quantity}</span>
                    </span>
                    <span className="text-slate-400">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
