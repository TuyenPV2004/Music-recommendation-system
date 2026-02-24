import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Music,
  Home,
  Sparkles,
  Library,
  User,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function Sidebar() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    {
      name: "Trang chủ",
      path: "/",
      icon: <Home className="w-5 h-5 flex-shrink-0" />,
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
    {
      name: "Hồ sơ cá nhân",
      path: "/profile",
      icon: <User className="w-5 h-5 flex-shrink-0" />,
    },
  ];

  return (
    <div
      className={`bg-black h-full flex flex-col hidden md:flex transition-all duration-300 ${isExpanded ? "w-64" : "w-20"}`}
    >
      {/* Brand & Toggle */}
      <div
        className={`h-20 flex items-center ${isExpanded ? "px-6 justify-between" : "justify-center"} pt-6 pb-2`}
      >
        {isExpanded && (
          <Link
            to="/"
            className="flex items-center gap-3 group overflow-hidden"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Music className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-green-400 transition-colors truncate">
              Moodify
            </span>
          </Link>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors flex-shrink-0"
          title={isExpanded ? "Thu gọn" : "Mở rộng"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isExpanded ? "px-4" : "px-2"} py-4 space-y-2`}>
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
          className={`p-4 mt-auto ${!isExpanded && "flex flex-col items-center"}`}
        >
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            title={!isExpanded ? "Đăng xuất" : ""}
            className={`flex items-center justify-center gap-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors ${
              isExpanded ? "w-full py-2 px-4" : "p-3"
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="truncate">Đăng xuất</span>}
          </button>
        </div>
      )}
    </div>
  );
}
