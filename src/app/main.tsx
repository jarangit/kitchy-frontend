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
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Falls back to an empty string when unconfigured. The provider still
// mounts so `useGoogleLogin` imports don't crash — buttons themselves
// guard against the empty ID and render a disabled state.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <QuerySyncProvider>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <BrowserRouter>
                <App />
                <GlobalModal />
                <LoadingOverlay />
              </BrowserRouter>
            </GoogleOAuthProvider>
          </QuerySyncProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
);
