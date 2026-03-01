import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SongCard from "../../components/song/SongCard";
import { songAPI } from "../../services/api";

export default function TrendingPage() {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await songAPI.list({ limit: 50 });
        const trendingData = res.data?.items || res.items || res.data || [];
        setTrendingSongs(trendingData);
      } catch (error) {
        console.error("Lỗi lấy bài hát thịnh hành: ", error);
        setTrendingSongs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black px-6 h-16 flex items-center shadow-sm"></header>

      {/* Main Content Scrollable Area Wrapper (Rounded) */}
      <div className="flex-1 pt-2 pr-4 pb-1 pl-2 overflow-hidden flex flex-col">
        <div className="bg-[#1F1F1F] rounded-xl flex-1 overflow-y-auto scrollbar-hide p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Thịnh hành</h1>
            <p className="text-sm text-gray-400">
              Các bài hát đang được nghe nhiều nhất hiện nay
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {isLoading ? (
              <div className="text-gray-400 col-span-full">Đang tải...</div>
            ) : trendingSongs.length > 0 ? (
              trendingSongs.map((song) => (
                <SongCard
                  key={`trending-${song.id}`}
                  song={song}
                  siblings={trendingSongs}
                />
              ))
            ) : (
              <div className="text-gray-400 col-span-full">
                Không có bài hát nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
