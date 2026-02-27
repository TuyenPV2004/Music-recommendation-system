import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import NoSidebarLayout from "./layouts/NoSidebarLayout";
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
import GenresPage from "./pages/genres/GenresPage";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import GenreManagementPage from "./pages/admin/GenreManagementPage";
import MoodManagementPage from "./pages/admin/MoodManagementPage";
import SongManagementPage from "./pages/admin/SongManagementPage";
import PlaylistManagementPage from "./pages/admin/PlaylistManagementPage";
import InteractionsManagementPage from "./pages/admin/InteractionsManagementPage";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();

    // Fallback an toàn: Nếu backend không phản hồi sau 5 giây thì cho qua
    const timeout = setTimeout(() => {
      if (useAuthStore.getState().isCheckingAuth) {
        console.warn("[Auth] Hết thời gian chờ, tự động bỏ qua Loading...");
        useAuthStore.setState({
          isCheckingAuth: false,
          isAuthenticated: false,
        });
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white space-y-4">
        <div className="text-xl font-semibold">Đang kiểm tra đăng nhập...</div>
        <div className="text-sm text-gray-500">
          Vui lòng chờ trong giây lát (tối đa 5s)
        </div>
        <button
          onClick={() => useAuthStore.setState({ isCheckingAuth: false })}
          className="mt-4 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm"
        >
          Bỏ qua
        </button>
      </div>
    );
  }

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
          <Route path="/genres" element={<GenresPage />} />
          {/* Real Pages */}
          <Route
            path="/mood-recommendation"
            element={<MoodRecommendationPage />}
          />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Pages Without Sidebar */}
        <Route element={<NoSidebarLayout />}>
          <Route path="/songs/:id" element={<SongDetailPage />} />
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
