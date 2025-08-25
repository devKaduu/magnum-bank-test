import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export function PublicOnlyRoute() {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const loading = auth?.loading;

  if (loading) return <div className="p-6 text-gray-600">Carregando…</div>;

  if (api.getToken() && user) return <Navigate to="/" replace />;

  return <Outlet />;
}
