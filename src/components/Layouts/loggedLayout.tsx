import { Outlet } from "react-router-dom";
import { Header } from "../Header";

export function LoggedLayout() {
  return (
    <main>
      <Header />

      <Outlet />
    </main>
  );
}
