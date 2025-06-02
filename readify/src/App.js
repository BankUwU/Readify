import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Achievement from "./routes/achievement";
import AddReview from "./routes/addreview";
import CheckEmail from "./routes/checkemail";
import EditProfile from "./routes/edit-profile";
import Favorite from "./routes/favorites";
import { default as Forget, default as Forgetpass } from "./routes/forgetpass";
import Home from "./routes/home";
import Login from "./routes/login";
import MyReading from "./routes/myreading";
import Myreviews from "./routes/myreviews";
import Profile from "./routes/profile";
import Register from "./routes/register";
import Review from "./routes/review";
import Bookinformation from "./routes/bookinformation";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminRoute from "./routes/admin/AdminRoute";
import AdminPage from "./routes/admin/AdminPage";
import AdminAchievements from "./routes/admin/AdminAchievements";
import RequireAdmin from "./components/admin/RequireAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<Forget />} />
        <Route path="/forgot-password" element={<Forgetpass />} />
        <Route path="/check-email" element={<CheckEmail />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
              <Home />
          }
        />
        <Route
          path="/favorite"
          element={
            <ProtectedRoute>
              <Favorite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute>
              <Myreviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-review"
          element={
            <ProtectedRoute>
              <AddReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review-page"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reading"
          element={
            <ProtectedRoute>
              <MyReading />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-information"
          element={
            <ProtectedRoute>
              <Bookinformation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/achievements"
          element={
            <RequireAdmin>
              <AdminAchievements />
            </RequireAdmin>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
