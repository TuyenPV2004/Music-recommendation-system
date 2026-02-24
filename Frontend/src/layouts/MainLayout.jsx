import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import MusicPlayer from "../components/layout/MusicPlayer";
import usePlayerStore from "../store/usePlayerStore";

export default function MainLayout() {
  const currentSong = usePlayerStore((state) => state.currentSong);

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar className="flex-shrink-0" />

        {/* Main Content Area */}
        <div className="flex-1 bg-gradient-to-b from-gray-900 via-black to-black overflow-y-auto">
          {/* We will add a Header for mobile and search later inside Outlet context or directly here */}
          <main className={`min-h-full ${currentSong ? "pb-24" : ""}`}>
            {/* dynamic padding ensures content doesn't get hidden behind the fixed Music Player */}
            <Outlet />
          </main>
        </div>
      </div>

      {/* Bottom Music Player - Fixed position at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <MusicPlayer />
      </div>
    </div>
  );
}
