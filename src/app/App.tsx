import { Route, Routes } from "react-router-dom";
import LoginPage from "@/features/auth/pages/login";
import UserDashboardPage from "@/features/store/pages/user-dashboard";
import StoreDashboardPage from "@/features/store/pages/store-dashboard";
import { AuthProvider } from "@/features/auth/context/authContext";
import { ProtectedRoute } from "@/shared/components/protected-route";
import HomePage from "@/features/landing/pages/home";
import StoreManagementPage from "@/features/store/pages/management";
import SettingStorePage from "@/features/store/pages/setting";
import CreateOrderPage from "@/features/order/pages/create-order";
import StationPage from "@/features/station/pages/[station]";
import NotFoundPage from "@/shared/pages/not-found";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id"
          element={
            <ProtectedRoute>
              <StoreDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/management"
          element={
            <ProtectedRoute>
              <StoreManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/setting"
          element={
            <ProtectedRoute>
              <SettingStorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:id/create-order"
          element={
            <ProtectedRoute>
              <CreateOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/:storeId/station/:id"
          element={
            <ProtectedRoute>
              <StationPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
