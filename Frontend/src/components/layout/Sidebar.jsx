import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Music,
  Home,
  Sparkles,
  Library,
  User,
  LogOut,
  Disc3,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import useLayoutStore from "../../store/useLayoutStore";
import Swal from "sweetalert2";

export default function Sidebar() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const { isExpanded, toggleSidebar } = useLayoutStore();

  const navItems = [
    {
      name: "Trang chủ",
      path: "/",
      icon: <Home className="w-5 h-5 flex-shrink-0" />,
    },
    {
      name: "Khám phá thể loại",
      path: "/genres",
      icon: <Disc3 className="w-5 h-5 flex-shrink-0" />,
    },
    {
      name: "Khám phá cảm xúc",
      path: "/mood-recommendation",
      icon: <Sparkles className="w-5 h-5 flex-shrink-0" />,
    },
    {
      name: "Playlist của tôi",
      path: "/playlists",
      icon: <Library className="w-5 h-5 flex-shrink-0" />,
    },
  ];

  return (
    <div
      className={`bg-black h-full flex flex-col hidden md:flex transition-all duration-300 ${isExpanded ? "w-64" : "w-24"}`}
    >
      {/* Top block: Matches HomePage Header */}
      <div className="h-16 flex items-center pl-4 pr-2 shrink-0">
        <div
          onClick={toggleSidebar}
          className={`flex items-center cursor-pointer overflow-visible whitespace-nowrap w-full ${isExpanded ? "justify-start px-8" : "justify-center"}`}
          title={isExpanded ? "Thu gọn" : "Mở rộng"}
        >
          <div className="relative flex items-center justify-center flex-shrink-0 w-5 h-5">
            <div className="w-10 h-10 bg-[#2DC275] rounded-full flex items-center justify-center absolute">
              <Music className="w-5 h-5 text-white" />
            </div>
          </div>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${
              isExpanded
                ? "max-w-[200px] opacity-100 ml-4"
                : "max-w-0 opacity-0 ml-0"
            }`}
          >
            <span className="text-2xl font-bold tracking-tight text-white">
              Moodify
            </span>
          </div>
        </div>
      </div>

      {/* Bottom block: Menu container, matches HomePage content container alignment */}
      <div className="flex-1 pl-4 pr-2 pt-2 pb-1">
        {/* We keep rounded-t-xl only or all rounded? The prompt says "khối bo góc lớn". We will let the bottom touch. To make it a true flat continuous line with the player, changing rounded-xl to rounded-t-xl is better. But user just said padding. Let's keep rounded-xl for now or remove bottom rounding. Let's remove bottom margin first. */}
        <div className="bg-[#121212] rounded-xl h-full flex flex-col py-4">
          {/* Navigation */}
          <nav className={`flex-1 ${isExpanded ? "px-4" : "px-2"} space-y-2`}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={!isExpanded ? item.name : ""}
                className={({ isActive }) =>
                  `flex items-center ${isExpanded ? "gap-4 px-4" : "justify-center"} py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`
                }
              >
                {item.icon}
                {isExpanded && <span className="truncate">{item.name}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Footer Settings / Logout */}
          {isAuthenticated && (
            <div
              className={`px-4 mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3 ${!isExpanded ? "items-center" : ""}`}
            >
              <Link
                to="/profile"
                className={`flex items-center ${isExpanded ? "gap-3" : "justify-center"}`}
                title={!isExpanded ? user?.name || "Tài khoản" : ""}
              >
                <div className="w-10 h-10 rounded-full bg-[#7B4A31] flex-shrink-0 flex items-center justify-center text-[#000000] font-bold text-lg hover:brightness-110 transition-all shadow-md">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                {isExpanded && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-white text-sm font-semibold truncate">
                      {user?.name || "Người dùng"}
                    </span>
                    <span className="text-gray-400 text-xs hover:text-white transition-colors truncate">
                      Xem hồ sơ
                    </span>
                  </div>
                )}
              </Link>

              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: "Đăng xuất?",
                    text: "Bạn có chắc chắn muốn đăng xuất?",
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
                    logout();
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
                className={`flex items-center justify-center gap-2 border border-gray-700 text-red-500 rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors ${
                  isExpanded ? "w-full py-2 px-4" : "p-3"
                }`}
              >
                <LogOut className="w-5 h-5 flex-shrink-0 text-red-500 group-hover:text-red-400" />
                {isExpanded && <span className="truncate">Đăng xuất</span>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
