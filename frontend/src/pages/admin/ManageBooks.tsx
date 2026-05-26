import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Book, Category } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useZodForm } from "../../hooks/useZodForm";
import { bookSchema } from "../../lib/validations";

const empty = {
  title: "",
  author: "",
  description: "",
  price: "" as unknown as number,
  stock: "" as unknown as number,
  categoryId: "",
};

export const ManageBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const { values, errors, setValue, validate, reset } = useZodForm(
    bookSchema,
    empty,
  );

  const fetchAll = async () => {
    const [b, c] = await Promise.all([
      api.get("/books"),
      api.get("/categories"),
    ]);
    setBooks(b.data.data);
    setCategories(c.data.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset();
    setOpen(true);
  };
  const openEdit = (book: Book) => {
    setEditing(book);
    reset({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      stock: book.stock,
      categoryId: book.categoryId,
    });
    setOpen(true);
  };

  const save = async () => {
    const data = validate();
    if (!data) return;
    try {
      if (editing) {
        await api.put(`/books/${editing.id}`, data);
        toast.success("Book updated");
      } else {
        await api.post("/books", data);
        toast.success("Book created");
      }
      setOpen(false);
      fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/books/${id}`);
      fetchAll();
      toast.success("Book deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-4xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Books
        </h1>
        <Button
          onClick={openCreate}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Book
        </Button>
      </div>

      <div className="space-y-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4 items-start"
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-white font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {book.title}
              </p>
              <p className="text-slate-400 text-sm">
                {book.author} · {book.category.name}
              </p>
              <p className="text-slate-500 text-sm line-clamp-1 mt-1">
                {book.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-amber-400 font-semibold">
                Rp {book.price.toLocaleString("id-ID")}
              </p>
              <p className="text-slate-500 text-xs">{book.stock} stock</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-amber-400"
                onClick={() => openEdit(book)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-red-400"
                onClick={() => remove(book.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }}>
              {editing ? "Edit Book" : "Add Book"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {(["title", "author"] as const).map((k) => (
              <div key={k} className="space-y-1">
                <Label className="text-slate-300 capitalize">{k}</Label>
                <Input
                  value={values[k]}
                  onChange={(e) => setValue(k, e.target.value)}
                  className={`bg-slate-800 border-slate-700 text-white focus:border-amber-500 ${errors[k] ? "border-red-500" : ""}`}
                />
                {errors[k] && (
                  <p className="text-red-400 text-xs">{errors[k]}</p>
                )}
              </div>
            ))}

            <div className="space-y-1">
              <Label className="text-slate-300">Description</Label>
              <textarea
                value={values.description}
                onChange={(e) => setValue("description", e.target.value)}
                rows={3}
                className={`w-full bg-slate-800 border text-white rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-amber-500 ${errors.description ? "border-red-500" : "border-slate-700"}`}
              />
              {errors.description && (
                <p className="text-red-400 text-xs">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(["price", "stock"] as const).map((k) => (
                <div key={k} className="space-y-1">
                  <Label className="text-slate-300 capitalize">
                    {k === "price" ? "Price (Rp)" : "Stock"}
                  </Label>
                  <Input
                    type="number"
                    value={values[k]}
                    onChange={(e) => setValue(k, e.target.value)}
                    className={`bg-slate-800 border-slate-700 text-white focus:border-amber-500 ${errors[k] ? "border-red-500" : ""}`}
                  />
                  {errors[k] && (
                    <p className="text-red-400 text-xs">{errors[k]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <Label className="text-slate-300">Category</Label>
              <select
                value={values.categoryId}
                onChange={(e) => setValue("categoryId", e.target.value)}
                className={`w-full bg-slate-800 border text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500 ${errors.categoryId ? "border-red-500" : "border-slate-700"}`}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-400 text-xs">{errors.categoryId}</p>
              )}
            </div>

            <Button
              onClick={save}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold mt-2"
            >
              {editing ? "Save Changes" : "Create Book"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
