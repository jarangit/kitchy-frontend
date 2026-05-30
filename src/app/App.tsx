import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/authContext";
import { ProtectedRoute } from "@/shared/components/protected-route";
import NotFoundPage from "@/shared/pages/not-found";

import { PosLayout } from "@/features/pos/components/pos-layout";

// Layout
import Layout from "@/shared/components/layout/layout";
import { ReadyToServeNotifier } from "@/features/kds/components/ready-to-serve-notifier";
import { ToastProvider } from "@/shared/components/ui/toast/toast-provider";
import { Spinner } from "@/shared/components/ui/spinner";

const LoginPage = lazy(() => import("@/features/auth/pages/login"));
const RegisterPage = lazy(() => import("@/features/auth/pages/register"));
const UserDashboardPage = lazy(() => import("@/features/store/pages/user-dashboard"));
const StoreDashboardPage = lazy(() => import("@/features/store/pages/store-dashboard"));
const PosHomePage = lazy(() => import("@/features/pos/pages/pos-home"));
const PaymentPage = lazy(() => import("@/features/pos/pages/payment"));
const PaymentSuccessPage = lazy(() => import("@/features/pos/pages/payment-success"));
const TransactionListPage = lazy(() => import("@/features/transaction/pages/transaction-list"));
const TransactionDetailPage = lazy(() => import("@/features/transaction/pages/transaction-detail"));
const KdsBoardPage = lazy(() => import("@/features/kds/pages/kds-board"));
const ReportPage = lazy(() => import("@/features/report/pages/report-page"));
const SettingsPage = lazy(() => import("@/features/store/pages/settings"));
const SettingsProductsPage = lazy(() => import("@/features/store/pages/settings-products"));
const SettingsShopPage = lazy(() => import("@/features/store/pages/settings-shop"));
const SettingsDeliveryPage = lazy(() => import("@/features/store/pages/settings-delivery"));
const SettingsQuickNotesPage = lazy(() => import("@/features/store/pages/settings-quick-notes"));
const SettingsStationsPage = lazy(() => import("@/features/station/pages/settings-stations"));
const SettingsCategoriesPage = lazy(() => import("@/features/category/pages/settings-categories"));
const StationPage = lazy(() => import("@/features/station/pages/[station]"));
const OnboardingWizardPage = lazy(() => import("@/features/onboarding/pages/onboarding-wizard"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-bg">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider />
      <ReadyToServeNotifier />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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
          path="/store/:id/kds"
          element={
            <ProtectedRoute>
              <Layout>
                <KdsBoardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Report */}
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

        {/* Settings — full-screen shell (no global Layout) */}
        <Route
          path="/store/:id/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/settings/products"
          element={
            <ProtectedRoute>
              <SettingsProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/settings/stations"
          element={
            <ProtectedRoute>
              <SettingsStationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/settings/categories"
          element={
            <ProtectedRoute>
              <SettingsCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/settings/shop"
          element={
            <ProtectedRoute>
              <SettingsShopPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/settings/delivery"
          element={
            <ProtectedRoute>
              <SettingsDeliveryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/settings/quick-notes"
          element={
            <ProtectedRoute>
              <SettingsQuickNotesPage />
            </ProtectedRoute>
          }
        />
        {/* Control Panel section router — must come AFTER specific legacy routes */}
        <Route
          path="/store/:id/settings/:section"
          element={
            <ProtectedRoute>
              <SettingsPage />
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
