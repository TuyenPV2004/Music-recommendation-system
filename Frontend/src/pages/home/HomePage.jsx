import React, { useState } from "react";
import SongCard from "../../components/song/SongCard";
import Input from "../../components/ui/Input";
import { Search, Bell, Music, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useLayoutStore from "../../store/useLayoutStore";
import useAuthStore from "../../store/useAuthStore";
import { recommendAPI, genreAPI, songAPI } from "../../services/api";
import { useEffect } from "react";

const MOCK_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Chạy Ngay Đi",
    artist: "Sơn Tùng M-TP",
    cover:
      "https://cdn2.tuoitre.vn/thumb_w/480/2018/5/12/1-15261059641701906609880.jpg",
  },
  {
    id: 2,
    title: "Có Chắc Yêu Là Đây",
    artist: "Sơn Tùng M-TP",
    cover: "https://i.ytimg.com/vi/3AAHMU4-o4A/maxresdefault.jpg",
  },
  {
    id: 3,
    title: "Waiting For You",
    artist: "MONO",
    cover: "https://i.ytimg.com/vi/okz5RIZRT0U/maxresdefault.jpg",
  },
  {
    id: 4,
    title: "Gieo Quẻ",
    artist: "Hoàng Thùy Linh",
    cover: "https://i.ytimg.com/vi/Q6ZNsHvspEg/maxresdefault.jpg",
  },
  {
    id: 5,
    title: "See Tình",
    artist: "Hoàng Thùy Linh",
    cover: "https://i.ytimg.com/vi/gJHSDZfJrRY/maxresdefault.jpg",
  },
];

const MOCK_GENRES = [
  {
    id: 1,
    name: "Pop",
    color: "bg-blue-500",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
  },
  {
    id: 2,
    name: "Rock",
    color: "bg-red-500",
    image:
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&q=80",
  },
  {
    id: 3,
    name: "Ballad",
    color: "bg-purple-500",
    image:
      "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&q=80",
  },
  {
    id: 4,
    name: "Rap/Hip-Hop",
    color: "bg-yellow-500",
    image:
      "https://images.unsplash.com/photo-1601643157091-ce5c665179ab?w=300&q=80",
  },
  {
    id: 5,
    name: "Lofi Chill",
    color: "bg-green-600",
    image:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80",
  },
  {
    id: 6,
    name: "R&B",
    color: "bg-pink-500",
    image:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isExpanded, setIsExpanded } = useLayoutStore();
  const { isAuthenticated, user } = useAuthStore();

  const [recommendations, setRecommendations] = useState([]);
  const [genres, setGenres] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recommendations without blocking (hybrid API might be incomplete/hanging)
        if (isAuthenticated) {
          recommendAPI
            .hybrid({ limit: 10 })
            .then((res) => {
              const recData =
                res.recommendations ||
                res.data?.recommendations ||
                res.data?.songs ||
                res.songs ||
                [];
              setRecommendations(recData);
            })
            .catch((error) => {
              console.error("Lỗi lấy gợi ý: ", error);
              setRecommendations([]);
            });
        } else {
          setRecommendations([]);
        }

        // Fetch genres
        let genreData = [];
        try {
          const res = await genreAPI.list();
          // Map real genres or use placeholders
          genreData = res.data || res.items || res || [];
        } catch (error) {
          console.error("Lỗi lấy thể loại: ", error);
        }

        // Fetch trending (just list songs for now)
        let trendingData = [];
        try {
          const res = await songAPI.list({ limit: 10 });
          trendingData = res.data?.items || res.items || res.data || [];
        } catch (error) {
          console.error("Lỗi lấy bài hát: ", error);
        }

        setGenres(genreData);
        setTrendingSongs(trendingData);
      } catch (err) {
        console.error("Data fetch error", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Sticky Header with Search */}
      <header className="sticky top-0 z-40 bg-black px-6 h-16 flex items-center shadow-sm">
        {/* Placeholder to balance the flex container and center the search bar */}
        <div className="flex-1"></div>

        <div className="w-full max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm transition-colors duration-200"
            placeholder="Tìm kiếm bài hát, nghệ sĩ"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Auth Actions & Icons */}
        <div className="flex-1 flex items-center justify-end ml-4">
          {/* Decorative Users Icon */}
          <button
            className="p-2.5 mr-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
            title="Hoạt động bạn bè"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Notification Bell with Hover Menu */}
          <div className="relative group mr-4">
            <button
              onClick={() => toast.info("Bạn chưa có thông báo mới.")}
              className="p-2.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors relative"
              title="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {/* Notification red dot (Mock) */}
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-black group-hover:border-gray-800 transition-colors"></span>
            </button>

            {/* Hover Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top group-hover:scale-100 scale-95">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-white font-bold text-sm">Thông báo</h3>
                <span
                  onClick={() => toast.success("Đã đánh dấu tất cả là đã đọc!")}
                  className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Đánh dấu đã đọc
                </span>
              </div>
              <div className="p-8 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Bell className="w-8 h-8 text-gray-700" />
                <span className="text-sm font-medium">
                  Bạn chưa có thông báo mới.
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-800 mx-2 mr-4"></div>

          {isAuthenticated ? null : (
            <div className="flex gap-3">
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full font-bold text-gray-400 hover:text-white transition-colors text-sm hover:scale-105"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform text-sm hover:bg-gray-200"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Scrollable Area Wrapper (Rounded) */}
      <div className="flex-1 pt-2 pr-4 pb-1 pl-2 overflow-hidden flex flex-col">
        <div className="bg-[#1F1F1F] rounded-xl flex-1 overflow-y-auto scrollbar-hide p-6 space-y-12">
          {/* Section 1: Hybrid Recommendations */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
                  Gợi ý riêng cho bạn
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Dựa trên sở thích nghe nhạc gần đây của bạn
                </p>
              </div>
              <button className="text-sm font-semibold text-gray-400 hover:text-white transition tracking-wider">
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {isLoading ? (
                <div className="text-gray-400">Đang tải...</div>
              ) : recommendations.length > 0 ? (
                recommendations.map((song) => (
                  <SongCard key={song.id || song.song_id} song={song} />
                ))
              ) : (
                <div className="text-gray-400 col-span-full">
                  {isAuthenticated
                    ? "Chưa có đủ dữ liệu để gợi ý. Hãy nghe thêm nhạc nhé!"
                    : "Vui lòng đăng nhập để xem gợi ý dành cho bạn."}
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Genres */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              Khám phá thể loại
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {isLoading ? (
                <div className="text-gray-400">Đang tải...</div>
              ) : genres.length > 0 ? (
                genres.slice(0, 6).map((genre, idx) => {
                  const colors = [
                    "bg-blue-500",
                    "bg-red-500",
                    "bg-purple-500",
                    "bg-yellow-500",
                    "bg-green-600",
                    "bg-pink-500",
                  ];
                  const bgColor = genre.color || colors[idx % colors.length];

                  return (
                    <div
                      key={genre.id}
                      className={`${bgColor} rounded-xl p-4 h-32 flex flex-col items-start justify-start shadow-md cursor-pointer overflow-hidden relative group`}
                    >
                      {/* Decorative circle */}
                      <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                      <span className="text-xl font-bold text-white drop-shadow-md relative z-10">
                        {genre.name}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400">Không có thể loại nào.</div>
              )}
            </div>
          </section>

          {/* Section 3: Trending / New Releases */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
                Thịnh hành
              </h2>
              <button className="text-sm font-semibold text-gray-400 hover:text-white transition tracking-wider">
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {isLoading ? (
                <div className="text-gray-400">Đang tải...</div>
              ) : trendingSongs.length > 0 ? (
                trendingSongs.map((song) => (
                  <SongCard key={`trending-${song.id}`} song={song} />
                ))
              ) : (
                <div className="text-gray-400">Không có bài hát nào.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
