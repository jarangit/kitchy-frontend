import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateOrder from "./pages/create-order.tsx";
import Layout from "./ui-system/components/layout/layout.tsx";

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
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
