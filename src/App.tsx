import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import UserDashboardPage from "./pages/user-dashborad";
import RestaurantDashboardPage from "./pages/restaurant-dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={"ladding page"} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-dashboard" element={<UserDashboardPage />} />
        <Route path="/restaurant-dashboard/:id" element={<RestaurantDashboardPage />} />
      </Routes>
    </>
  );
}

export default App;
