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
  ShieldAlert,
  ChevronLeft,
  Menu,
} from "lucide-react";

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
      className={`bg-gray-900 border-r border-gray-800 h-full flex flex-col hidden md:flex transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Brand & Toggle */}
      <div
        className={`flex items-center ${
          isExpanded ? "justify-between px-6" : "justify-center"
        } py-6 border-b border-gray-800`}
      >
        {isExpanded && (
          <Link
            to="/admin"
            className="flex items-center gap-3 group overflow-hidden"
          >
            <div className="w-10 h-10 bg-[#2DC275] rounded-lg flex items-center justify-center shadow-lg shadow-[#2DC275]/20 flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
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
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
          title={isExpanded ? "Thu gọn" : "Mở rộng"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
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
        className={`p-4 border-t border-gray-800 bg-gray-950/50 ${!isExpanded && "flex flex-col items-center"}`}
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
          onClick={() => {
            // TODO: Implement logout
            navigate("/login");
          }}
          title={!isExpanded ? "Đăng xuất" : ""}
          className={`flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-[#2DC275]/20 hover:text-[#2DC275] rounded-lg transition-colors border border-transparent hover:border-[#2DC275]/30 ${
            isExpanded ? "w-full px-4 py-2" : "p-3"
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {isExpanded && <span className="truncate">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}
