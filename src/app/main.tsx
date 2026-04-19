import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/shared/store/store";
import GlobalModal from "@/shared/components/common-modal";
import LoadingOverlay from "@/shared/components/loading-screen";
import { LanguageProvider } from "@/shared/i18n/language-context";
import { QuerySyncProvider } from "@/shared/events/query-sync";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <QuerySyncProvider>
            <BrowserRouter>
              <App />
              <GlobalModal />
              <LoadingOverlay />
            </BrowserRouter>
          </QuerySyncProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
);
