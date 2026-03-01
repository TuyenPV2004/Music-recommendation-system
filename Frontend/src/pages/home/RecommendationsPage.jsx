import { useState, useEffect } from "react";
import SongCard from "../../components/song/SongCard";
import { recommendAPI } from "../../services/api";
import useAuthStore from "../../store/useAuthStore";

export default function RecommendationsPage() {
  const { isAuthenticated } = useAuthStore();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Fetch data on mount ───────────────────────────────────────
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await recommendAPI.hybrid({ page_size: 10 });

        const recData =
          res.recommendations ||
          res.data?.recommendations ||
          [];

        setRecommendations(recData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black px-6 h-16 flex items-center shadow-sm"> </header>

      {/* Main Content Scrollable Area Wrapper (Rounded) */}
      <div className="flex-1 pt-2 pr-4 pb-1 pl-2 overflow-hidden flex flex-col">
        <div className="bg-[#1F1F1F] rounded-xl flex-1 overflow-y-auto scrollbar-hide p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Dành riêng cho bạn
            </h1>
            <p className="text-sm text-gray-400">
              Dựa trên sở thích nghe nhạc gần đây của bạn
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {isLoading ? (
              <div className="text-gray-400 col-span-full">Đang tải...</div>
            ) : recommendations.length > 0 ? (
              recommendations.map((song) => (
                <SongCard
                  key={song.id || song.song_id}
                  song={song}
                  siblings={recommendations}
                />
              ))
            ) : (
              <div className="text-gray-400 col-span-full">
                  Vui lòng đăng nhập để xem gợi ý dành cho bạn.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
