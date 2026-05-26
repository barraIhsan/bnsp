import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { User } from "../../types";
import { Badge } from "@/components/ui/badge";
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
import { createUserSchema, editUserSchema } from "../../lib/validations";

type Role = "ADMIN" | "USER";
const createEmpty = { username: "", password: "", role: "USER" as Role };
const editEmpty = { username: "", password: "", role: "USER" as Role };

export const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const createForm = useZodForm(createUserSchema, createEmpty);
  const editForm = useZodForm(editUserSchema, editEmpty);

  const activeForm = editing ? editForm : createForm;

  const fetchUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    createForm.reset();
    setOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    editForm.reset({ username: user.username, password: "", role: user.role });
    setOpen(true);
  };

  const save = async () => {
    const data = activeForm.validate();
    if (!data) return;

    try {
      if (editing) {
        const payload: Record<string, string> = {
          username: data.username,
          role: data.role,
        };
        if (data.password) payload.password = data.password;
        await api.put(`/users/${editing.id}`, payload);
        toast.success("User updated");
      } else {
        await api.post("/users", data);
        toast.success("User created");
      }
      setOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
      toast.success("User deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    }
  };

  const { values, errors, setValue } = activeForm;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-4xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Users
        </h1>
        <Button
          onClick={openCreate}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950"
        >
          <Plus className="w-4 h-4 mr-1" /> Add User
        </Button>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-slate-900 border border-slate-800 rounded-lg px-5 py-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium">{user.username}</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                user.role === "ADMIN"
                  ? "border-amber-700 text-amber-400"
                  : "border-slate-700 text-slate-400"
              }
            >
              {user.role}
            </Badge>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-amber-400"
                onClick={() => openEdit(user)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-red-400"
                onClick={() => remove(user.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }}>
              {editing ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Username</Label>
              <Input
                value={values.username}
                onChange={(e) => setValue("username", e.target.value)}
                className={`bg-slate-800 border-slate-700 text-white focus:border-amber-500 ${errors.username ? "border-red-500" : ""}`}
                placeholder="username"
              />
              {errors.username && (
                <p className="text-red-400 text-xs">{errors.username}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">
                Password{" "}
                {editing && (
                  <span className="text-slate-500 font-normal">
                    (leave blank to keep current)
                  </span>
                )}
              </Label>
              <Input
                type="password"
                value={values.password}
                onChange={(e) => setValue("password", e.target.value)}
                className={`bg-slate-800 border-slate-700 text-white focus:border-amber-500 ${errors.password ? "border-red-500" : ""}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-xs">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Role</Label>
              <select
                value={values.role}
                onChange={(e) => setValue("role", e.target.value as Role)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {errors.role && (
                <p className="text-red-400 text-xs">{errors.role}</p>
              )}
            </div>

            <Button
              onClick={save}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold mt-2"
            >
              {editing ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
