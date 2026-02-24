import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import useAuthStore from "../../store/useAuthStore";

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

    // TODO: Implement actual API call to /api/auth/login
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (formData.email && formData.password) {
        // Success
        login({ email: formData.email, name: "User" }); // Set basic mock user data
        console.log("Login attempt:", formData);
        navigate("/"); // Redirect to dashboard
      } else {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
      }
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
