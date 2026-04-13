import { Route, Routes } from "react-router-dom";
import LoginPage from "@/features/auth/pages/login";
import UserDashboardPage from "@/features/store/pages/user-dashboard";
import StoreDashboardPage from "@/features/store/pages/store-dashboard";
import { AuthProvider } from "@/features/auth/context/authContext";
import { ProtectedRoute } from "@/shared/components/protected-route";
import HomePage from "@/features/landing/pages/home";
import NotFoundPage from "@/shared/pages/not-found";

// POS
import PosHomePage from "@/features/pos/pages/pos-home";
import { PosLayout } from "@/features/pos/components/pos-layout";

// Transaction
import TransactionListPage from "@/features/transaction/pages/transaction-list";
import TransactionDetailPage from "@/features/transaction/pages/transaction-detail";

// Settings
import SettingsPage from "@/features/store/pages/settings";
import SettingsProductsPage from "@/features/store/pages/settings-products";
import SettingsCategoriesPage from "@/features/store/pages/settings-categories";
import SettingsShopPage from "@/features/store/pages/settings-shop";

// Station
import StationPage from "@/features/station/pages/[station]";

// Layout
import Layout from "@/shared/components/layout/layout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* User Dashboard (store selection) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
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

        {/* Settings */}
        <Route
          path="/store/:id/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/settings/products"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsProductsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/settings/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsCategoriesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/settings/shop"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsShopPage />
              </Layout>
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
