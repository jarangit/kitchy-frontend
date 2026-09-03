import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { lazyWithRetry } from "@/shared/utils/lazy-with-retry";
import { AuthProvider } from "@/features/auth/context/authContext";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { KdsRoute } from "@/features/kds/components/kds-route";
import NotFoundPage from "@/shared/pages/not-found";
import { IS_DEMO_MODE } from "@/shared/services/adapters/data-adapter";

import { PosLayout } from "@/features/pos/components/pos-layout";
import { KdsLayout } from "@/features/kds/components/kds-layout";
import { SettingsPinGuard } from "@/features/store/components/settings-pin-guard";

// Layout
import Layout from "@/shared/components/layout/layout";
import { ReadyToServeNotifier } from "@/features/kds/components/ready-to-serve-notifier";
import { ToastProvider } from "@/shared/components/ui/toast/toast-provider";
import { Spinner } from "@/shared/components/ui/spinner";
import { TabSoundFeedback } from "@/shared/audio/tab-sound-feedback";

const LoginPage = lazyWithRetry(() => import("@/features/auth/pages/login"));
const PairPage = lazyWithRetry(() => import("@/features/device/pages/pair"));
const DemoTrialEntryPage = lazyWithRetry(
  () => import("@/features/onboarding/pages/demo-trial-entry"),
);
const UserDashboardPage = lazyWithRetry(
  () => import("@/features/store/pages/user-dashboard"),
);
const StoreDashboardPage = lazyWithRetry(
  () => import("@/features/store/pages/store-dashboard"),
);
const PosHomePage = lazyWithRetry(
  () => import("@/features/pos/pages/pos-home"),
);
const PaymentPage = lazyWithRetry(() => import("@/features/pos/pages/payment"));
const PaymentSuccessPage = lazyWithRetry(
  () => import("@/features/pos/pages/payment-success"),
);
const TransactionListPage = lazyWithRetry(
  () => import("@/features/transaction/pages/transaction-list"),
);
const TransactionDetailPage = lazyWithRetry(
  () => import("@/features/transaction/pages/transaction-detail"),
);
const ReportPage = lazyWithRetry(
  () => import("@/features/report/pages/report"),
);
const KdsBoardPage = lazyWithRetry(
  () => import("@/features/kds/pages/kds-board"),
);
const ReadyToServePage = lazyWithRetry(
  () => import("@/features/kds/pages/ready-to-serve"),
);
const SettingsPage = lazyWithRetry(
  () => import("@/features/store/pages/settings"),
);
const SettingsProductsPage = lazyWithRetry(
  () => import("@/features/store/pages/settings-products"),
);
const SettingsShopPage = lazyWithRetry(
  () => import("@/features/store/pages/settings-shop"),
);
const SettingsDeliveryPage = lazyWithRetry(
  () => import("@/features/store/pages/settings-delivery"),
);
const SettingsQuickNotesPage = lazyWithRetry(
  () => import("@/features/store/pages/settings-quick-notes"),
);
const SettingsStationsPage = lazyWithRetry(
  () => import("@/features/station/pages/settings-stations"),
);
const SettingsCategoriesPage = lazyWithRetry(
  () => import("@/features/category/pages/settings-categories"),
);
const StationPage = lazyWithRetry(
  () => import("@/features/station/pages/[station]"),
);
const OnboardingWizardPage = lazyWithRetry(
  () => import("@/features/onboarding/pages/onboarding-wizard"),
);

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-bg">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider />
      <TabSoundFeedback />
      <ReadyToServeNotifier />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={<Navigate to={IS_DEMO_MODE ? "/try" : "/login"} replace />}
          />
          <Route
            path="/try"
            element={
              IS_DEMO_MODE ? (
                <DemoTrialEntryPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pair" element={<PairPage />} />

          {/* User Dashboard (store selection) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Onboarding wizard (first-run flow) */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingWizardPage />
              </ProtectedRoute>
            }
          />

          {/* Store Routes (with sidebar layout) */}
          <Route
            path="/store/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <StoreDashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* POS — nested routes share a single CartProvider */}
          <Route
            path="/store/:id/pos"
            element={
              <ProtectedRoute>
                <PosLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PosHomePage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="payment/success" element={<PaymentSuccessPage />} />
          </Route>

          {/* Transactions */}
          <Route
            path="/store/:id/transactions"
            element={
              <ProtectedRoute>
                <Layout>
                  <TransactionListPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/:id/transactions/:txId"
            element={
              <ProtectedRoute>
                <Layout>
                  <TransactionDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/:id/report"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/store/:id/kds"
            element={
              <KdsRoute>
                <KdsLayout>
                  <KdsBoardPage />
                </KdsLayout>
              </KdsRoute>
            }
          />
          <Route
            path="/store/:id/ready-to-serve"
            element={
              <ProtectedRoute>
                <ReadyToServePage />
              </ProtectedRoute>
            }
          />

          {/* Settings — full-screen shell (no global Layout) */}
          <Route
            path="/store/:id/settings"
            element={
              <ProtectedRoute>
                <SettingsPinGuard>
                  <SettingsPage />
                </SettingsPinGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/:id/settings/products"
            element={
              <ProtectedRoute>
                <SettingsPinGuard>
                  <SettingsProductsPage />
                </SettingsPinGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/:id/settings/stations"
            element={
              <ProtectedRoute>
                <SettingsPinGuard>
                  <SettingsStationsPage />
                </SettingsPinGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/:id/settings/categories"
            element={
              <ProtectedRoute>
                <SettingsPinGuard>
                  <SettingsCategoriesPage />
                </SettingsPinGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/:id/settings/shop"
            element={
              <ProtectedRoute>
                <SettingsPinGuard>
                  <SettingsShopPage />
                </SettingsPinGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/:id/settings/delivery"
            element={
              <ProtectedRoute>
                <SettingsPinGuard>
                  <SettingsDeliveryPage />
                </SettingsPinGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/:id/settings/quick-notes"
            element={
              <ProtectedRoute>
                <SettingsPinGuard>
                  <SettingsQuickNotesPage />
                </SettingsPinGuard>
              </ProtectedRoute>
            }
          />
          {/* Control Panel section router — must come AFTER specific legacy routes */}
          <Route
            path="/store/:id/settings/:section"
            element={
              <ProtectedRoute>
                <SettingsPinGuard>
                  <SettingsPage />
                </SettingsPinGuard>
              </ProtectedRoute>
            }
          />

          {/* Station */}
          <Route
            path="/store/:storeId/station/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <StationPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
