import React, { useState } from "react";
import SongCard from "../../components/song/SongCard";
import Input from "../../components/ui/Input";
import { Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header with Search */}
      <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-md px-6 py-4 flex items-center shadow-sm">
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

        {/* Auth Actions */}
        <div className="flex-1 flex items-center justify-end gap-3 ml-4">
          <Link
            to="/register"
            className="px-5 py-2 rounded-full font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm"
          >
            Đăng ký
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform text-sm"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 p-6 space-y-12">
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
            {MOCK_RECOMMENDATIONS.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        {/* Section 2: Genres */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">
            Khám phá theo thể loại
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {MOCK_GENRES.map((genre) => (
              <div
                key={genre.id}
                className={`${genre.color} rounded-xl p-4 h-32 flex flex-col items-start justify-start shadow-md cursor-pointer overflow-hidden relative group`}
              >
                {/* Decorative circle */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                <span className="text-xl font-bold text-white drop-shadow-md relative z-10">
                  {genre.name}
                </span>
                {genre.image && (
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="absolute -bottom-2 -right-4 w-20 h-20 object-cover rounded shadow-lg transform rotate-[25deg] group-hover:scale-110 transition-transform duration-300"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Trending / New Releases */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
              Mới & Thịnh hành
            </h2>
            <button className="text-sm font-semibold text-gray-400 hover:text-white transition tracking-wider">
              Xem tất cả
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Reusing Mock Recommendations for demo purposes */}
            {[...MOCK_RECOMMENDATIONS].reverse().map((song) => (
              <SongCard key={`trending-${song.id}`} song={song} />
            ))}
          </div>
        </section>

        {/* Spacer for bottom player padding */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
