import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { useZodForm } from "../../hooks/useZodForm";
import { loginSchema } from "../../lib/validations";
import type { Role } from "../../types";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { values, errors, setValue, validate } = useZodForm(loginSchema, {
    username: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const data = validate();
    if (!data) return;

    setLoading(true);
    try {
      const { data: res } = await api.post("/auth/login", data);
      login(res.data.token, res.data.role as Role);
      navigate(res.data.role === "ADMIN" ? "/admin" : "/books");
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <BookOpen className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome back
          </h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-slate-300">Username</Label>
            <Input
              value={values.username}
              onChange={(e) => setValue("username", e.target.value)}
              className={`bg-slate-900 border-slate-700 text-white focus:border-amber-500 ${errors.username ? "border-red-500" : ""}`}
              placeholder="your username"
            />
            {errors.username && (
              <p className="text-red-400 text-xs">{errors.username}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300">Password</Label>
            <Input
              type="password"
              value={values.password}
              onChange={(e) => setValue("password", e.target.value)}
              className={`bg-slate-900 border-slate-700 text-white focus:border-amber-500 ${errors.password ? "border-red-500" : ""}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password}</p>
            )}
          </div>

          {serverError && <p className="text-red-400 text-sm">{serverError}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          No account?{" "}
          <Link to="/register" className="text-amber-400 hover:text-amber-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
