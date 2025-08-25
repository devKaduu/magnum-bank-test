import { BrowserRouter, Route, Routes } from "react-router-dom";
import History from "../../pages/History";
import { Home } from "../../pages/Home";
import { Login } from "../../pages/Login";
import { Register } from "../../pages/Register";
import { Transaction } from "../../pages/Transactions";
import Layout from "../Layouts/layout";
import { LoggedLayout } from "../Layouts/loggedLayout";

import { AuthProvider } from "../../context/AuthProvider";
import { ProtectedRoute } from "../../routes/ProtectedRoute";
import { PublicOnlyRoute } from "../../routes/PublicOnlyRoute";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* públicas: só se deslogado */}
          <Route element={<PublicOnlyRoute />}>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>

          {/* privadas: exigem login */}
          <Route element={<ProtectedRoute />}>
            <Route element={<LoggedLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/transactions" element={<Transaction />} />
              <Route path="/history" element={<History />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
