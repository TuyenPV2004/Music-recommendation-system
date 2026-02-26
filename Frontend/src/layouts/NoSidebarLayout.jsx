import React from "react";
import { Outlet } from "react-router-dom";
import MusicPlayer from "../components/layout/MusicPlayer";
import usePlayerStore from "../store/usePlayerStore";

export default function NoSidebarLayout() {
  const currentSong = usePlayerStore((state) => state.currentSong);

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden">
      <div
        className={`flex flex-1 overflow-hidden ${currentSong ? "pb-24" : ""}`}
      >
        {/* Main Content Area without Sidebar */}
        <div className="flex-1 bg-gradient-to-b from-gray-900 via-black to-black flex flex-col overflow-hidden">
          <main className="flex-1 flex flex-col overflow-hidden">
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
