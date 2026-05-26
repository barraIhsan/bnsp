import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

import { BooksPage } from "./pages/user/BooksPage";
import { CartPage } from "./pages/user/CartPage";
import { OrdersPage } from "./pages/user/OrdersPage";
import { UserDashboard } from "./pages/user/UserDashboard";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ManageBooks } from "./pages/admin/ManageBooks";
import { ManageCategories } from "./pages/admin/ManageCategories";
import { ManageUsers } from "./pages/admin/ManageUsers";
import { AdminOrders } from "./pages/admin/AdminOrders";

const HomeRedirect = () => {
  const { token, isAdmin } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  return isAdmin ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950">
          <Navbar />

          <Routes>
            {/* AUTH */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* REDIRECT */}
            <Route path="/" element={<HomeRedirect />} />

            {/* USER */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute userOnly>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books"
              element={
                <ProtectedRoute userOnly>
                  <BooksPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute userOnly>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute userOnly>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/books"
              element={
                <ProtectedRoute adminOnly>
                  <ManageBooks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute adminOnly>
                  <ManageCategories />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster theme="dark" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
