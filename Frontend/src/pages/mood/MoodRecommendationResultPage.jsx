import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import SongCard from "../../components/song/SongCard";
import { ArrowLeft } from "lucide-react";

export default function MoodRecommendationResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dữ liệu được truyền qua state khi navigate từ trang gợi ý cảm xúc
  const result = location.state?.result;

  // Nếu không có dữ liệu (người dùng copy URL dán trực tiếp), quay lại trang trước
  useEffect(() => {
    if (!result || !result.songs) {
      navigate("/mood-recommendation", { replace: true });
    }
  }, [result, navigate]);

  if (!result || !result.songs) return null;

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black px-6 h-16 flex items-center shadow-sm">
      </header>

      {/* Main Content Scrollable Area Wrapper (Rounded) */}
      <div className="flex-1 pt-2 pr-4 pb-1 pl-2 overflow-hidden flex flex-col">
        <div className="bg-[#1F1F1F] rounded-xl flex-1 overflow-y-auto scrollbar-hide p-6">
          {/* Emotion Overview Card from previous page */}
          <div
            className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl border mb-8 ${result.bg}`}
          >
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="p-3 bg-black/40 rounded-xl shadow-inner">
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className={result.color}>
                    {/* Can't easily pass React lucide-react nodes via state perfectly over JSON/History. 
                          We will just use the color class to show a colored blob or a text icon, 
                          or we can keep it simple */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 tracking-wider font-semibold mb-1">
                  Kết quả cho cảm xúc:
                </p>
                <h3 className={`text-2xl font-bold ${result.color}`}>
                  {result.label}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Danh sách bài hát phù hợp
            </h1>
            <span className="text-sm font-medium text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              {result.songs.length} bài hát
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-12">
            {result.songs.map((song) => (
              <SongCard key={song.id} song={song} siblings={result.songs} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
