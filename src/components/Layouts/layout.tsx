import { Outlet } from "react-router-dom";
import { AuthBanner } from "../AuthBanner";

export default function Layout() {
  return (
    <main className="min-h-screen flex">
      <AuthBanner />

      <Outlet />
    </main>
  );
}
