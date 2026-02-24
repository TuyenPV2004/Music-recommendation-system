import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { MailCheck } from "lucide-react";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // TODO: Implement actual API call to /api/auth/forgot-password
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      toast.success("Đã gửi liên kết khôi phục. Vui lòng kiểm tra email.");
    } catch (err) {
      toast.error(
        "Đã có lỗi xảy ra. Hãy chắc chắn email của bạn đúng và thử lại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <MailCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Kiểm tra email của bạn
        </h2>
        <p className="text-gray-400 mb-8">
          Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến email{" "}
          <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến (và thư mục
          rác) của bạn.
        </p>
        <Link to="/login">
          <Button variant="secondary" fullWidth>
            Quay lại trang Đăng nhập
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Quên mật khẩu</h1>
        <p className="text-gray-400">
          Nhập email đăng ký của bạn, chúng tôi sẽ gửi liên kết khôi phục mật
          khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          label="Email đã đăng ký"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          Gửi liên kết khôi phục
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link
          to="/login"
          className="font-medium text-gray-400 hover:text-white transition-colors"
        >
          Quay lại trang đăng nhập
        </Link>
      </div>
    </div>
  );
}
