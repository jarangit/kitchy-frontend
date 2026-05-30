import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/features/auth/pages/login";
import RegisterPage from "@/features/auth/pages/register";
import UserDashboardPage from "@/features/store/pages/user-dashboard";
import StoreDashboardPage from "@/features/store/pages/store-dashboard";
import { AuthProvider } from "@/features/auth/context/authContext";
import { ProtectedRoute } from "@/shared/components/protected-route";
import NotFoundPage from "@/shared/pages/not-found";

// POS
import PosHomePage from "@/features/pos/pages/pos-home";
import PaymentPage from "@/features/pos/pages/payment";
import PaymentSuccessPage from "@/features/pos/pages/payment-success";
import { PosLayout } from "@/features/pos/components/pos-layout";

// Transaction
import TransactionListPage from "@/features/transaction/pages/transaction-list";
import TransactionDetailPage from "@/features/transaction/pages/transaction-detail";
import KdsBoardPage from "@/features/kds/pages/kds-board";

// Report
import ReportPage from "@/features/report/pages/report-page";

// Settings
import SettingsPage from "@/features/store/pages/settings";
import SettingsProductsPage from "@/features/store/pages/settings-products";
import SettingsShopPage from "@/features/store/pages/settings-shop";
import SettingsDeliveryPage from "@/features/store/pages/settings-delivery";
import SettingsQuickNotesPage from "@/features/store/pages/settings-quick-notes";
import SettingsStationsPage from "@/features/station/pages/settings-stations";
import SettingsCategoriesPage from "@/features/category/pages/settings-categories";

// Station
import StationPage from "@/features/station/pages/[station]";

// Onboarding
import OnboardingWizardPage from "@/features/onboarding/pages/onboarding-wizard";

// Layout
import Layout from "@/shared/components/layout/layout";
import { ReadyToServeNotifier } from "@/features/kds/components/ready-to-serve-notifier";
import { ToastProvider } from "@/shared/components/ui/toast/toast-provider";

function App() {
  return (
    <AuthProvider>
      <ToastProvider />
      <ReadyToServeNotifier />
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
    </AuthProvider>
  );
}

export default App;
