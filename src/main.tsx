import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateOrder from "./pages/create-order.tsx";
import Layout from "./components/ui-system/components/layout/layout.tsx";
import KitchenMonitor from "./pages/kitchen-monitor.tsx";
import TogoPage from "./pages/togo.tsx";
import ServerDineInPage from "./pages/server-deinin.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <App />
            </Layout>
          }
        />
        <Route
          path="/create-order"
          element={
            <Layout>
              <CreateOrder />
            </Layout>
          }
        />
        <Route
          path="/kitchen-monitor"
          element={
            <Layout>
              <KitchenMonitor />
            </Layout>
          }
        />
        <Route
          path="/front-desk"
          element={
            <Layout>
              <TogoPage />
            </Layout>
          }
        />
        <Route
          path="/server"
          element={
            <Layout>
              <ServerDineInPage />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <App />
            </Layout>
          }
        />{" "}
        {/* fallback */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
