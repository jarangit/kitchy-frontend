import { Route, Routes } from "react-router-dom";
import LoginPage from "@/features/auth/pages/login";
import UserDashboardPage from "@/features/restaurant/pages/user-dashboard";
import RestaurantDashboardPage from "@/features/restaurant/pages/restaurant-dashboard";
import { AuthProvider } from "@/features/auth/context/authContext";
import { ProtectedRoute } from "@/shared/components/protected-route";
import HomePage from "@/features/landing/pages/home";
import RestaurantManagementPage from "@/features/restaurant/pages/management";
import SettingRestaurantPage from "@/features/restaurant/pages/setting";
import CreateOrderPage from "@/features/order/pages/create-order";
import StationPage from "@/features/station/pages/[station]";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant-dashboard/:id"
          element={
            <ProtectedRoute>
              <RestaurantDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/:id/management"
          element={
            <ProtectedRoute>
              <RestaurantManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/:id/setting"
          element={
            <ProtectedRoute>
              <SettingRestaurantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/:id/create-order"
          element={
            <ProtectedRoute>
              <CreateOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/station/:id"
          element={
            <ProtectedRoute>
              <StationPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
