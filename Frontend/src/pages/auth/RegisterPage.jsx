import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birth_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }
    try {
      // Create body mapped to match `/api/auth/register`
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        birth_date: formData.birth_date,
      };

      await authAPI.register(payload);
      Swal.fire({
        title: "Đăng ký thành công!",
        text: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
        icon: "success",
        background: "#1D1D1D",
        color: "#fff",
        confirmButtonColor: "#2DC275",
        confirmButtonText: "Đăng nhập ngay",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      toast.error(err.message || "Đăng ký thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Đăng ký tài khoản
        </h1>
        <p className="text-gray-400">
          Tạo tài khoản để trải nghiệm âm nhạc miễn phí
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          id="name"
          type="text"
          label="Họ và tên"
          placeholder="Nhập họ tên"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="password"
            type="password"
            label="Mật khẩu"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            id="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          id="birth_date"
          type="date"
          label="Ngày sinh"
          value={formData.birth_date}
          onChange={handleChange}
          required
        />

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
          Đăng ký tài khoản
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="font-medium text-white hover:text-green-400 transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
