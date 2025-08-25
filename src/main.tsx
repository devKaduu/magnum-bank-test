import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MSW === "true") {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      serviceWorker: { url: "/mockServiceWorker.js" },
      onUnhandledRequest: "bypass",
    });
  }

  createRoot(document.getElementById("root")!).render(
    <>
      <App />
    </>
  );
}

bootstrap();
