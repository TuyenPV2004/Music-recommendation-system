import React, { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import {
  User,
  Mail,
  Calendar,
  Camera,
  Globe,
  Users,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import useAuthStore from "../../store/useAuthStore";
import { userAPI } from "../../services/api";

export default function ProfilePage() {
  const { user, checkAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birth_date: "",
    country: "",
    gender: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        birth_date: user.birth_date
          ? new Date(user.birth_date).toISOString().split("T")[0]
          : "",
        country: user.country || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userAPI.update({
        name: formData.name,
        birth_date: formData.birth_date || null,
        country: formData.country || null,
        gender: formData.gender || null,
      });

      await checkAuth();

      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const genderLabel = (g) => {
    if (g === "male") return "Nam";
    if (g === "female") return "Nữ";
    if (g === "other") return "Khác";
    return "Chưa cập nhật";
  };

  const formatCreatedAt = (dt) => {
    if (!dt) return "Không rõ";
    return new Date(dt).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col p-6 lg:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          Hồ sơ cá nhân
        </h1>
        <p className="text-gray-400">
          Xem và chỉnh sửa thông tin tài khoản của bạn.
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        {/* Background purely aesthetic */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-600/20 to-blue-600/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 shadow-lg border-4 border-gray-900 flex items-center justify-center overflow-hidden">
                <span className="text-5xl font-bold text-white mix-blend-overlay">
                  {formData?.name?.charAt(0) || "U"}
                </span>

                {/* Overlay for hovering/editing */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
            {isEditing && (
              <p className="text-xs text-gray-400 text-center">
                Nhấp vào ảnh để thay đổi
              </p>
            )}

            {/* Created At - shown below avatar */}
            {user?.created_at && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Tham gia: {formatCreatedAt(user.created_at)}</span>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-xl font-semibold text-white">
                Thông tin chi tiết 
              </h2>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Họ và tên
                  </div>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-black/50"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/50 rounded-lg text-white border border-gray-800">
                      {formData.name || "Chưa cập nhật"}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-white border border-gray-800 cursor-not-allowed">
                    {formData.email || "Chưa cập nhật"}
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Ngày sinh
                  </div>
                  {isEditing ? (
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      className="bg-black/50 [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/50 rounded-lg text-white border border-gray-800">
                      {formData.birth_date
                        ? new Date(formData.birth_date).toLocaleDateString(
                            "vi-VN",
                          )
                        : "Chưa cập nhật"}
                    </div>
                  )}
                </div>

                {/* Country */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    Quốc gia
                  </div>
                  {isEditing ? (
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Ví dụ: Vietnam"
                      className="bg-black/50"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/50 rounded-lg text-white border border-gray-800">
                      {formData.country || "Chưa cập nhật"}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    Giới tính
                  </div>
                  {isEditing ? (
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-3 bg-black/50 rounded-lg text-white border border-gray-700 focus:border-[#2DC275] focus:outline-none transition-colors"
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-800/50 rounded-lg text-white border border-gray-800">
                      {genderLabel(formData.gender)}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex items-center gap-2"
                  >
                    Lưu thông tin
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
