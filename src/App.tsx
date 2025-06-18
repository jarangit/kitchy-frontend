import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import UserDashboardPage from "./pages/user-dashborad";
import RestaurantDashboardPage from "./pages/restaurant/restaurant-dashboard";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./components/protected-route";
import HomePage from "./pages/home";
import RestaurantManagementPage from "./pages/restaurant/management";
import SettingRestaurantPage from "./pages/restaurant/setting";

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
      </Routes>
    </AuthProvider>
  );
}

export default App;
