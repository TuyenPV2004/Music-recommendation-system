import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Edit,
  Trash2,
  Shield,
  Filter,
  Loader2,
  Plus,
  EllipsisVertical,
} from "lucide-react";
import { adminAPI } from "../../services/api";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    gender: "other",
    birth_date: "",
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      country: "",
      gender: "other",
      birth_date: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: user.password || "",
      country: user.country || "",
      gender: user.gender || "other",
      birth_date: user.birth_date || "",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Typically call API here: await adminAPI.createUser(formData) ...
      toast.success(
        editingUser
          ? "Cập nhật người dùng thành công!"
          : "Thêm người dùng thành công!",
      );
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Xóa người dùng?",
      text: "Bạn có chắc chắn muốn xóa người dùng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      background: "#1D1D1D",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        // Typically call API here: await adminAPI.deleteUser(id) ...
        toast.success("Đã xóa người dùng!");
        fetchUsers();
      } catch (err) {
        toast.error("Lỗi khi xóa người dùng.");
      }
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.users({
        page,
        limit,
        search: searchQuery,
        role: filterRole,
        country: filterCountry,
      });
      setUsers(res.data || res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search: reset to page 1 on search change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterRole, filterCountry]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Quản lý người dùng
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Xem, tìm kiếm và quản lý tài khoản thành viên trong hệ thống.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row w-full gap-4 flex-1">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full lg:w-72">
              <div className="absolute top-1/2 -translate-y-1/2 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-black text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                placeholder="Tìm theo ID, tên, email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={handleOpenAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 !h-[38px] !py-0 !px-4 !text-sm whitespace-nowrap"
            >
              <span>Thêm người dùng</span>
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
            <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap hidden sm:flex">
              <Filter className="w-4 h-4 text-gray-500" /> Lọc:
            </div>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="bg-black border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2 h-[38px] outline-none"
            >
              <option value="">Tất cả quốc gia</option>
              <option value="VN">Vietnam</option>
              <option value="US">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider w-16"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Người dùng
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden sm:table-cell"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden md:table-cell"
                >
                  Vai trò
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden lg:table-cell"
                >
                  Quốc gia
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider text-center"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                      <span className="ml-3 text-gray-400">Đang tải</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 opacity-20 mb-3" />
                      <p>Không tìm thấy người dùng nào phù hợp với tìm kiếm.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                      {typeof user.id === "string"
                        ? user.id.substring(0, 8)
                        : user.id}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-[#2DC275] flex items-center justify-center text-gray-300 font-bold shadow-inner">
                            {(user.name || "?").charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-300">
                            {user.name || "Chưa đặt tên"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-300">
                        {user.email || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.role === "admin"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-gray-800 text-gray-300 border-gray-700"
                        }`}
                      >
                        {user.role === "admin" && (
                          <Shield className="w-3.5 h-3.5" />
                        )}
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">
                      {user.country || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.status === "inactive"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-[#2DC275]/15 text-[#2DC275] border-[#2DC275]/25"
                        }`}
                      >
                        {user.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                          title="Chỉnh sửa"
                          onClick={() => handleOpenEditModal(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-white transition-colors p-1"
                          title="Xem chi tiết"
                          onClick={() => setDetailUser(user)}
                        >
                          <EllipsisVertical className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-400 transition-colors p-1"
                          title="Xóa tài khoản"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-gray-950/50 px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Hiển thị{" "}
            <span className="font-medium text-white">{users.length}</span> /{" "}
            <span className="font-medium text-white">{total}</span> người dùng
            (Trang {page}/{totalPages || 1})
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </button>
            <span className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium border border-green-500 shadow-sm">
              {page}
            </span>
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>

      {/* USER FORM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        maxWidth="max-w-md"
        className="bg-white/5 backdrop-blur-xl border border-white/10"
        showCloseButton={false}
      >
        <form onSubmit={handleSaveUser} className="mt-4">
          <div className="space-y-4">
            <Input
              id="name"
              name="name"
              label="Tên"
              placeholder="Nhập tên"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              id="password"
              name="password"
              type="text"
              label="Mật khẩu"
              placeholder={
                editingUser ? "Bỏ trống để giữ nguyên" : "Nhập mật khẩu"
              }
              value={formData.password}
              onChange={handleInputChange}
              required={!editingUser}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="country"
                name="country"
                label="Quốc gia"
                placeholder="Nhập quốc gia"
                value={formData.country}
                onChange={handleInputChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              label="Ngày sinh"
              value={formData.birth_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingUser ? "Cập nhật" : "Xác nhận"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DETAIL MODAL */}
      <Modal
        isOpen={!!detailUser}
        onClose={() => setDetailUser(null)}
        title="Chi tiết người dùng"
        maxWidth="max-w-md"
        className="bg-white/5 backdrop-blur-xl border border-white/10"
      >
        {detailUser && (
          <div className="mt-4 space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
              <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-gray-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white truncate">
                  {detailUser.name || "—"}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {detailUser.email || "—"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Thống kê
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-1">ID</p>
                  <p className="text-sm text-white font-medium">
                    #{detailUser.id || detailUser.user_id}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Mật khẩu</p>
                  <p
                    className="text-sm text-white font-medium font-mono truncate"
                    title={detailUser.password}
                  >
                    {detailUser.password || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Ngày sinh</p>
                  <p className="text-sm text-white font-medium">
                    {detailUser.birth_date || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Quốc gia</p>
                  <p className="text-sm text-white font-medium">
                    {detailUser.country || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Giới tính</p>
                  <p className="text-sm text-white font-medium">
                    {detailUser.gender === "male"
                      ? "Male"
                      : detailUser.gender === "female"
                        ? "Female"
                        : "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Ngày tham gia</p>
                  <p
                    className="text-sm text-white font-medium truncate"
                    title={detailUser.created_at}
                  >
                    {detailUser.created_at || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
