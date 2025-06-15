import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateOrder from "./pages/create-order.tsx";
import Layout from "./components/ui-system/components/layout/layout.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import Clarity from "@microsoft/clarity";
import SettingPage from "./pages/setting.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const projectId = "rhunceryu0";
// Clarity.init(projectId);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
