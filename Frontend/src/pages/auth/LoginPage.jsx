import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import useAuthStore from "../../store/useAuthStore";
import { authAPI } from "../../services/api";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Connect to actual backend API
    try {
      if (!formData.email || !formData.password) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
      }

      const response = await authAPI.login(formData);
      // The response expects a token and user data
      // For now we assume the structure is something like { token: string, user: {...} } or { access_token: string }
      // FastAPI usually returns: { "access_token": "...", "token_type": "bearer" } for OAuth2. And then we fetch user?
      // Wait, API.md says `/api/auth/login` returns `{ token, user_id }` maybe we will fetch me inside checkAuth. We can just pass token.

      const token =
        response.data?.token || response.token || response.access_token;
      const user = response.data?.user || response.user;

      // Call store login with real user data
      login(user, token);

      Swal.fire({
        title: "Đăng nhập thành công!",
        text: "Chào mừng bạn trở lại với Moodify.",
        icon: "success",
        background: "#1D1D1D",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/"); // Redirect to dashboard
    } catch (err) {
      toast.error(
        err.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại Email hoặc Mật khẩu.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Chào mừng trở lại
        </h1>
        <p className="text-gray-400">
          Hãy vào Moodify để nghe thư viện nhạc của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          label="Email của bạn"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div>
          <Input
            id="password"
            type="password"
            label="Mật khẩu"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
            >
              Quên mật khẩu ?
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
          Đăng nhập
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="font-medium text-white hover:text-green-400 transition-colors"
        >
          Đăng ký miễn phí
        </Link>
      </div>
    </div>
  );
}
