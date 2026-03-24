import { Navigate } from "react-router-dom";
import { getAuth } from "../lib/auth";

export default function ProtectedRoute({ allow, children }) {
  const auth = getAuth();

  if (!auth?.token) return <Navigate to="/login" replace />;

  if (allow && !allow.includes(auth.user.role)) {
    // logged in, but wrong role
    const role = auth.user.role;
    const to = role === "admin" ? "/admin" : role === "staff" ? "/staff" : "/member";
    return <Navigate to={to} replace />;
  }

  return children;
}