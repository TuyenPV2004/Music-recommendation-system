import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const rawToken = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    token: rawToken,
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

    if (!formData.token) {
      toast.error(
        "Thiếu mã xác nhận (Token). Vui lòng kiểm tra lại liên kết từ email.",
      );
      setIsLoading(false);
      return;
    }

    // TODO: Implement actual API call to /api/auth/reset-password
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      toast.success("Mật khẩu đã được cập nhật thành công!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(
        "Khôi phục mật khẩu thất bại. Mã xác nhận có thể đã hết hạn.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Đổi mật khẩu thành công!
        </h2>
        <p className="text-gray-400 mb-8">
          Mật khẩu của bạn đã được cập nhật an toàn. Bạn sẽ được chuyển hướng về
          trang đăng nhập trong giây lát...
        </p>
        <Link to="/login">
          <Button variant="outline" fullWidth>
            Đăng nhập ngay
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Tạo Mật khẩu mới</h1>
        <p className="text-gray-400">
          Vui lòng nhập mật khẩu mới của bạn bên dưới.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hidden token field for manual entry if needed, but normally filled by URL param */}
        {!rawToken && (
          <Input
            id="token"
            type="text"
            label="Mã xác nhận (Token)"
            placeholder="Nhập mã xác nhận từ email"
            value={formData.token}
            onChange={handleChange}
            required
          />
        )}

        <Input
          id="password"
          type="password"
          label="Mật khẩu mới"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Xác nhận mật khẩu mới"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          Cập nhật mật khẩu
        </Button>
      </form>
    </div>
  );
}
