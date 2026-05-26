import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { CartItem } from "../../types";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setItems(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id: string, quantity: number) => {
    try {
      await api.put(`/cart/${id}`, { quantity });
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const removeItem = async (id: string) => {
    try {
      await api.delete(`/cart/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const checkout = async () => {
    setCheckingOut(true);
    try {
      await api.post("/orders/checkout");
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const total = items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1
        className="text-4xl font-bold text-white mb-8"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Your Cart
      </h1>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Your cart is empty</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4 items-center"
            >
              <div className="flex-1 min-w-0">
                <p
                  className="text-white font-semibold truncate"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.book.title}
                </p>
                <p className="text-slate-400 text-sm">{item.book.author}</p>
                <p className="text-amber-400 font-medium mt-1">
                  Rp {item.book.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-slate-700"
                  onClick={() =>
                    item.quantity > 1 && updateQty(item.id, item.quantity - 1)
                  }
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-white w-6 text-center">
                  {item.quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-slate-700"
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <p className="text-white font-semibold w-28 text-right">
                Rp {(item.book.price * item.quantity).toLocaleString("id-ID")}
              </p>

              <Button
                size="icon"
                variant="ghost"
                className="text-slate-500 hover:text-red-400"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="border-t border-slate-800 pt-6 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-amber-400">
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>
            <Button
              onClick={checkout}
              disabled={checkingOut}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8"
            >
              {checkingOut ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
