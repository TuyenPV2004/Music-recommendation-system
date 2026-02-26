import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Music,
  ListMusic,
  Smile,
  Disc,
  Activity,
  LogOut,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    {
      name: "Tổng quan",
      path: "/admin",
      icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" />,
    },
    {
      name: "Người dùng",
      path: "/admin/users",
      icon: <Users className="w-5 h-5 flex-shrink-0" />,
    },
    {
      name: "Bài hát",
      path: "/admin/songs",
      icon: <Music className="w-5 h-5 flex-shrink-0" />,
    },
    {
      name: "Thể loại",
      path: "/admin/genres",
      icon: <Disc className="w-5 h-5 flex-shrink-0" />,
    },
    {
      name: "Cảm xúc",
      path: "/admin/moods",
      icon: <Smile className="w-5 h-5 flex-shrink-0" />,
    },
    {
      name: "Danh sách phát",
      path: "/admin/playlists",
      icon: <ListMusic className="w-5 h-5 flex-shrink-0" />,
    },
    {
      name: "Hệ thống AI",
      path: "/admin/interactions",
      icon: <Activity className="w-5 h-5 flex-shrink-0" />,
    },
  ];

  return (
    <div
      className={`bg-gray-900 rounded-2xl m-2 h-[calc(100%-16px)] flex flex-col hidden md:flex transition-all duration-300 ${
        isExpanded ? "w-56" : "w-20"
      }`}
    >
      {/* Brand & Toggle */}
      <div
        className={`flex items-center ${
          isExpanded ? "px-6" : "justify-center"
        } py-6 border-b border-gray-800`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 bg-[#2DC275] rounded-full flex items-center justify-center shadow-lg shadow-[#2DC275]/20 flex-shrink-0 hover:bg-[#25a863] transition-colors cursor-pointer"
          title={isExpanded ? "Thu gọn" : "Mở rộng"}
        >
          <Music className="w-5 h-5 text-white" />
        </button>
        {isExpanded && (
          <Link
            to="/admin"
            className="flex items-center gap-0 group overflow-hidden ml-3"
          >
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-[#2DC275] transition-colors truncate">
                Moodify
              </h1>
              <p className="text-xs text-[#2DC275] font-medium uppercase tracking-wider truncate">
                Admin Panel
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <div
        className={`flex-1 overflow-y-auto ${
          isExpanded ? "px-4" : "px-2"
        } py-6 space-y-2 custom-scrollbar`}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            title={!isExpanded ? item.name : ""}
            className={({ isActive }) =>
              `flex items-center ${
                isExpanded ? "gap-3 px-4" : "justify-center"
              } py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#2DC275]/10 text-[#2DC275] border border-[#2DC275]/20"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-transparent"
              }`
            }
          >
            {item.icon}
            {isExpanded && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Footer / Account */}
      <div
        className={`p-4 border-t border-gray-800 ${!isExpanded && "flex flex-col items-center"}`}
      >
        {isExpanded ? (
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border border-gray-600 flex-shrink-0">
              <span className="text-sm font-bold text-white">AD</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                Administrator
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@moodify.com
              </p>
            </div>
          </div>
        ) : (
          <div
            className="w-10 h-10 mb-4 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border border-gray-600 flex-shrink-0 cursor-pointer"
            title="Administrator (admin@moodify.com)"
          >
            <span className="text-sm font-bold text-white">AD</span>
          </div>
        )}

        <button
          onClick={async () => {
            const result = await Swal.fire({
              title: "Đăng xuất?",
              text: "Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Đăng xuất",
              cancelButtonText: "Hủy",
              background: "#1D1D1D",
              color: "#fff",
            });

            if (result.isConfirmed) {
              Swal.fire({
                title: "Đã đăng xuất!",
                text: "Bạn đã đăng xuất thành công.",
                icon: "success",
                background: "#1D1D1D",
                color: "#fff",
                timer: 1500,
                showConfirmButton: false,
              });
              navigate("/login");
            }
          }}
          title={!isExpanded ? "Đăng xuất" : ""}
          className={`flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-400 bg-gray-800 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 ${
            isExpanded ? "w-full px-4 py-2" : "p-3"
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-red-500 group-hover:text-red-400" />
          {isExpanded && <span className="truncate">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}
