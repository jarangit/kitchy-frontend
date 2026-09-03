import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/shared/store/store";
import GlobalModal from "@/shared/components/common-modal";
import LoadingOverlay from "@/shared/components/loading-screen";
import { LanguageProvider } from "@/shared/i18n/language-context";
import { QuerySyncProvider } from "@/shared/events/query-sync";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RealtimeProvider } from "@/shared/realtime/realtime-provider";
import { ErrorBoundary } from "@/shared/components/error-boundary";
import { registerPWA } from "@/shared/pwa/register-pwa";
import { installChunkRecoveryListeners } from "@/shared/utils/chunk-error";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Silent PWA updates: activate fresh service worker + reload automatically.
// Installed once (module scope) so StrictMode double-mount can't duplicate it.
registerPWA();
if (typeof window !== "undefined") {
  installChunkRecoveryListeners();
}

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
            <RealtimeProvider />
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <BrowserRouter>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
                <GlobalModal />
                <LoadingOverlay />
              </BrowserRouter>
            </GoogleOAuthProvider>
          </QuerySyncProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </Provider>
  </React.StrictMode>,
);
