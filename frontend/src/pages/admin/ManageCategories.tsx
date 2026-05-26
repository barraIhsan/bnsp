import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Category } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";
import { categorySchema } from "../../lib/validations";

export const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newError, setNewError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");

  const fetchCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const create = async () => {
    const result = categorySchema.safeParse({ name: newName });
    if (!result.success) {
      setNewError(result.error.errors[0].message);
      return;
    }
    try {
      await api.post("/categories", { name: result.data.name });
      setNewName("");
      setNewError("");
      fetchCategories();
      toast.success("Category created");
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const update = async (id: string) => {
    const result = categorySchema.safeParse({ name: editName });
    if (!result.success) {
      setEditError(result.error.errors[0].message);
      return;
    }
    try {
      await api.put(`/categories/${id}`, { name: result.data.name });
      setEditId(null);
      setEditError("");
      fetchCategories();
      toast.success("Category updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1
        className="text-4xl font-bold text-white mb-8"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Categories
      </h1>

      {/* Create */}
      <div className="mb-8">
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setNewError("");
            }}
            placeholder="New category name"
            className={`bg-slate-900 border-slate-700 text-white focus:border-amber-500 ${newError ? "border-red-500" : ""}`}
            onKeyDown={(e) => e.key === "Enter" && create()}
          />
          <Button
            onClick={create}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {newError && <p className="text-red-400 text-xs mt-1">{newError}</p>}
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3"
          >
            {editId === cat.id ? (
              <div>
                <div className="flex items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      setEditError("");
                    }}
                    className={`bg-slate-800 border-slate-700 text-white h-8 flex-1 focus:border-amber-500 ${editError ? "border-red-500" : ""}`}
                    onKeyDown={(e) => e.key === "Enter" && update(cat.id)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-400 shrink-0"
                    onClick={() => update(cat.id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-500 shrink-0"
                    onClick={() => {
                      setEditId(null);
                      setEditError("");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {editError && (
                  <p className="text-red-400 text-xs mt-1">{editError}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-white flex-1">{cat.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-slate-400 hover:text-amber-400"
                  onClick={() => {
                    setEditId(cat.id);
                    setEditName(cat.name);
                    setEditError("");
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-slate-400 hover:text-red-400"
                  onClick={() => remove(cat.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
