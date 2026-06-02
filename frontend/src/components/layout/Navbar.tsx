import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ShoppingCart,
  Package,
  LayoutDashboard,
  LogOut,
  Tag,
  Users,
  BookMarked,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { token, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  const close = () => setOpen(false);

  return (
    <nav className="border-b border-amber-900/20 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BookMarked className="w-5 h-5 text-amber-400" />
          <span
            className="font-bold text-lg tracking-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Bookstore
          </span>
        </Link>

        {/* Desktop nav */}
        {token && (
          <div className="hidden md:flex items-center gap-1">
            {isAdmin ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/60"
                >
                  <Link to="/admin">
                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                    Dashboard
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/60"
                >
                  <Link to="/admin/books">
                    <BookOpen className="w-4 h-4 mr-1.5" />
                    Books
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/60"
                >
                  <Link to="/admin/categories">
                    <Tag className="w-4 h-4 mr-1.5" />
                    Categories
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/60"
                >
                  <Link to="/admin/users">
                    <Users className="w-4 h-4 mr-1.5" />
                    Users
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/60"
                >
                  <Link to="/admin/orders">
                    <Package className="w-4 h-4 mr-1.5" />
                    Orders
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/60"
                >
                  <Link to="/books">
                    <BookOpen className="w-4 h-4 mr-1.5" />
                    Books
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/60"
                >
                  <Link to="/cart">
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    Cart
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/60"
                >
                  <Link to="/orders">
                    <Package className="w-4 h-4 mr-1.5" />
                    Orders
                  </Link>
                </Button>
              </>
            )}

            <div className="w-px h-5 bg-slate-700 mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 hover:bg-slate-800/60"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          </div>
        )}

        {/* Mobile button */}
        {token && (
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {open ? <X /> : <Menu />}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {token && open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-6 py-3 space-y-2">
          {isAdmin ? (
            <>
              <MobileLink
                to="/admin"
                icon={LayoutDashboard}
                label="Dashboard"
                onClick={close}
              />
              <MobileLink
                to="/admin/books"
                icon={BookOpen}
                label="Books"
                onClick={close}
              />
              <MobileLink
                to="/admin/categories"
                icon={Tag}
                label="Categories"
                onClick={close}
              />
              <MobileLink
                to="/admin/users"
                icon={Users}
                label="Users"
                onClick={close}
              />
              <MobileLink
                to="/admin/orders"
                icon={Package}
                label="Orders"
                onClick={close}
              />
            </>
          ) : (
            <>
              <MobileLink
                to="/books"
                icon={BookOpen}
                label="Books"
                onClick={close}
              />
              <MobileLink
                to="/cart"
                icon={ShoppingCart}
                label="Cart"
                onClick={close}
              />
              <MobileLink
                to="/orders"
                icon={Package}
                label="Orders"
                onClick={close}
              />
            </>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 w-full py-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

function MobileLink({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 text-slate-300 hover:text-amber-400 py-2"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
