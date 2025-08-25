import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute() {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const loading = auth?.loading;
  const location = useLocation();

  if (loading) return <div className="p-6 text-gray-600">Carregando…</div>;

  const hasSession = !!api.getToken() && !!user;

  if (!hasSession) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
