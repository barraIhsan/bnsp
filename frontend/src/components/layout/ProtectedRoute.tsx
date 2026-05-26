import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({
  children,
  adminOnly = false,
  userOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
  userOnly?: boolean;
}) => {
  const { token, isAdmin } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (userOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
