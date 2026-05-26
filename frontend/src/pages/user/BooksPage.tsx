import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Book, Category } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search } from "lucide-react";
import { toast } from "sonner";

export const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/books", {
        params: {
          search: search || undefined,
          categoryId: categoryId || undefined,
        },
      });
      setBooks(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.data));
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search, categoryId]);

  const addToCart = async (bookId: string) => {
    try {
      await api.post("/cart", { bookId, quantity: 1 });
      toast.success("Added to cart");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1
        className="text-4xl font-bold text-white mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Browse Books
      </h1>
      <p className="text-slate-400 mb-8">Discover your next read</p>

      {/* Filters */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-700 text-white w-64"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={categoryId === "" ? "default" : "secondary"}
            onClick={() => setCategoryId("")}
            className={
              categoryId === ""
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-slate-950 transition-colors"
                : "border-slate-600 bg-slate-800 text-slate-100 hover:text-white hover:bg-slate-700"
            }
          >
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={categoryId === c.id ? "default" : "secondary"}
              onClick={() => setCategoryId(c.id)}
              className={
                categoryId === c.id
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-slate-950 transition-colors"
                  : "border-slate-600 bg-slate-800 text-slate-100 hover:text-white hover:bg-slate-700"
              }
            >
              {c.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3 hover:border-amber-900/50 transition-colors"
            >
              <div>
                <Badge
                  variant="outline"
                  className="border-amber-800 text-amber-500 text-xs mb-2"
                >
                  {book.category.name}
                </Badge>
                <h3
                  className="text-white font-semibold text-lg leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {book.title}
                </h3>
                <p className="text-slate-400 text-sm mt-0.5">{book.author}</p>
              </div>
              <p className="text-slate-500 text-sm line-clamp-2">
                {book.description}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <div>
                  <p className="text-amber-400 font-bold text-lg">
                    Rp {book.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {book.stock} in stock
                  </p>
                </div>
                <Button
                  size="sm"
                  disabled={book.stock === 0}
                  onClick={() => addToCart(book.id)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
