import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import HomePage from "./pages/home/HomePage";
import MoodRecommendationPage from "./pages/mood/MoodRecommendationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PlaylistsPage from "./pages/playlists/PlaylistsPage";
import PlaylistDetailPage from "./pages/playlists/PlaylistDetailPage";
import SongDetailPage from "./pages/song/SongDetailPage";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import GenreManagementPage from "./pages/admin/GenreManagementPage";
import MoodManagementPage from "./pages/admin/MoodManagementPage";
import SongManagementPage from "./pages/admin/SongManagementPage";
import PlaylistManagementPage from "./pages/admin/PlaylistManagementPage";
import InteractionsManagementPage from "./pages/admin/InteractionsManagementPage";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Main Authenticated Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* Real Pages */}
          <Route
            path="/mood-recommendation"
            element={<MoodRecommendationPage />}
          />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          <Route path="/songs/:id" element={<SongDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          {/* Placeholder admin routes */}
          {/* Admin routes */}
          <Route path="users" element={<UserManagementPage />} />
          <Route path="songs" element={<SongManagementPage />} />
          <Route path="genres" element={<GenreManagementPage />} />
          <Route path="moods" element={<MoodManagementPage />} />
          <Route path="playlists" element={<PlaylistManagementPage />} />
          <Route path="interactions" element={<InteractionsManagementPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
