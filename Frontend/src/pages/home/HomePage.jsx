import { useState, useEffect, useRef, useCallback } from "react";
import SongCard from "../../components/song/SongCard";
import { Search, Bell, Music, Users, Loader2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/useAuthStore";
import usePlayerStore from "../../store/usePlayerStore";
import { recommendAPI, genreAPI, songAPI } from "../../services/api";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const playSong = usePlayerStore((state) => state.playSong);

  const [recommendations, setRecommendations] = useState([]);
  const [genres, setGenres] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Search state ──────────────────────────────────────────────
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await songAPI.list({ search: value.trim(), limit: 8 });
        const items = res.data || res.items || [];
        setSearchResults(items);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Handle clicking a search result
  const handleResultClick = (song) => {
    setShowDropdown(false);
    navigate(`/songs/${song.id || song.song_id}`);
  };

  // Handle playing a song from search
  const handlePlayFromSearch = (e, song) => {
    e.stopPropagation();
    playSong({
      ...song,
      id: song.id || song.song_id,
      name: song.name || song.title,
      author: song.author || song.artist,
      audio_link: song.audio_link || song.cover,
    });
  };

  // Handle Enter key to search
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

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

  useEffect(() => {
    const fetchPublicData = async () => {
      setIsLoading(true);
      try {
        const [genreRes, trendingRes] = await Promise.all([
          genreAPI.list(),
          songAPI.list({ limit: 20 }),
        ]);

        const genreData =
          genreRes.data || genreRes.items || genreRes || [];

        const trendingData =
          trendingRes.data?.items ||
          trendingRes.items ||
          trendingRes.data ||
          [];

        setGenres(genreData);
        setTrendingSongs(trendingData);
      } catch (error) {
        console.error("Fetch public data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Sticky Header with Search */}
      <header className="sticky top-0 z-40 bg-black px-6 h-16 flex items-center shadow-sm">
        {/* Placeholder to balance the flex container and center the search bar */}
        <div className="flex-1"></div>

        {/* ── Search Bar with Dropdown ── */}
        <div className="w-full max-w-md relative" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-9 py-2 border border-transparent rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm transition-colors duration-200"
            placeholder="Tìm kiếm bài hát, nghệ sĩ"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim() && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
          />
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-black transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* ── Search Results Dropdown ── */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#282828] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[420px] overflow-y-auto scrollbar-hide">
              {isSearching ? (
                <div className="flex items-center justify-center gap-2 p-6 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Đang tìm kiếm</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="px-4 pt-3 pb-2">
                    <span className="text-xs font-semibold text-gray-400 tracking-wider">
                      Bài hát
                    </span>
                  </div>
                  {searchResults.map((song) => (
                    <div
                      key={song.id || song.song_id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 cursor-pointer transition-colors group"
                      onClick={() => handleResultClick(song)}
                    >
                      {/* Song icon / thumbnail */}
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:brightness-75 transition">
                        <Music className="w-5 h-5 text-gray-400" />
                        {/* Play overlay on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handlePlayFromSearch(e, song)}
                            className="text-white"
                          >
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Song info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {song.name || song.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {song.author || song.artist || "Unknown"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                  <Search className="w-8 h-8 text-gray-600 mb-3" />
                  <span className="text-sm font-medium">
                    Không tìm thấy kết quả cho "{searchQuery}"
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Thử tìm với từ khóa khác
                  </span>
                </div>
              )}
            </div>
          )}
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
                  Dành riêng cho bạn
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Dựa trên sở thích nghe nhạc gần đây của bạn
                </p>
              </div>
              <Link
                to="/recommendations"
                className="text-sm font-semibold text-gray-400 hover:text-white transition tracking-wider"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {isLoading ? (
                <div className="text-gray-400">Đang tải...</div>
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
                    Chưa có đủ dữ liệu để gợi ý. Hãy nghe thêm nhạc nhé!
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Genres */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
                Khám phá thể loại
              </h2>
              <Link
                to="/genres"
                className="text-sm font-semibold text-gray-400 hover:text-white transition tracking-wider"
              >
                Xem tất cả
              </Link>
            </div>
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

                  const defaultCovers = [
                    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80", // EDM/Party
                    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80", // Mic/Studio
                    "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=200&q=80", // Vinyl/Retro
                    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80", // Concert/Live
                    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&q=80", // Festival/Crowd
                    "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=200&q=80", // Cassette/Vintage
                  ];
                  const defaultCover =
                    defaultCovers[idx % defaultCovers.length];

                  return (
                    <Link
                      to="/genres"
                      key={genre.id}
                      className={`${bgColor} rounded-xl p-4 h-36 flex flex-col items-start justify-start shadow-md cursor-pointer overflow-hidden relative group transition-colors duration-300 block`}
                    >
                      <span className="text-xl font-bold text-white drop-shadow-md relative z-10 pr-4">
                        {genre.name}
                      </span>

                      {/* Decorative Album Image Overlap */}
                      <div className="absolute -bottom-4 -right-4 w-24 h-24 md:w-28 md:h-28 shadow-2xl rounded-md transform rotate-[25deg] group-hover:rotate-[15deg] group-hover:scale-110 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all duration-300 overflow-hidden ring-4 ring-black/20 opacity-90 group-hover:opacity-100 z-0">
                        <img
                          src={genre.image || genre.cover || defaultCover}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80"; // Ultimate fallback
                          }}
                        />
                      </div>
                    </Link>
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
              <Link
                to="/trending"
                className="text-sm font-semibold text-gray-400 hover:text-white transition tracking-wider"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {isLoading ? (
                <div className="text-gray-400">Đang tải...</div>
              ) : trendingSongs.length > 0 ? (
                trendingSongs.map((song) => (
                  <SongCard
                    key={`trending-${song.id}`}
                    song={song}
                    siblings={trendingSongs}
                  />
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
