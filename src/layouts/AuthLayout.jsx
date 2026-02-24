import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Music } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-gray-900 to-black">
      {/* Background aesthetics */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-green-900/10 to-transparent pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 mb-8 group">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Music className="w-6 h-6 text-black" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-white group-hover:text-green-400 transition-colors">
            Moodify
          </span>
        </Link>

        {/* Auth Card Content */}
        <div className="w-full bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Moodify. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
