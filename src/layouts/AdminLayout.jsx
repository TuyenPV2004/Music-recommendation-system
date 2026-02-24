import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="h-screen w-full bg-black text-gray-200 flex overflow-hidden font-sans">
      <AdminSidebar className="flex-shrink-0" />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black">
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#2DC275]/20 via-black to-black pointer-events-none" />
          <div className="relative z-10 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
