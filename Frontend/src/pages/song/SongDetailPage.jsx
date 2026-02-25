import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Heart,
  Star,
  PlusCircle,
  Share2,
  MoreHorizontal,
  ListMusic,
  Loader2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { toast } from "react-toastify";
import { songAPI, playlistAPI } from "../../services/api";

export default function SongDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── Data state ───────────────────────────────────────────────────────────────
  const [song, setSong] = useState(null);
  const [similarSongs, setSimilarSongs] = useState([]);   // bài hát tương tự
  const [isPageLoading, setIsPageLoading] = useState(true);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);

  // ── Fetch dữ liệu mỗi khi id thay đổi (navigate giữa các bài hát tương tự) ────────
  useEffect(() => {
    let cancelled = false;

    const fetchSong = async () => {
      setIsPageLoading(true);
      try {
        // GET /api/songs/{id}?similar_limit=8
        // Response: { success, data: SongDetail, similar_songs: SongBriefWithScore[] }
        const res = await songAPI.detail(id, { similar_limit: 8 });
        if (!cancelled) {
          setSong(res.data);
          setSimilarSongs(res.similar_songs || []);
          setRating(0);
          setIsPlaying(false);
        }
      } catch (err) {
        if (!cancelled) toast.error("Không thể tải bài hát. Thử lại sau!");
      } finally {
        if (!cancelled) setIsPageLoading(false);
      }
    };

    // Fetch danh sách playlist của user (để hiển thị trong modal "Thêm vào Playlist")
    const fetchPlaylists = async () => {
      try {
        const res = await playlistAPI.list();
        if (!cancelled) setUserPlaylists(res.data || res || []);
      } catch (_) { /* Không bắt buộc, modal vẫn hoạt động */ }
    };

    fetchSong();
    fetchPlaylists();
    return () => { cancelled = true; };
  }, [id]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    // TODO: Dispatch to global Redux store: setCurrentlyPlaying(song), togglePlay()
    toast.success(isPlaying ? "Đã tạm dừng." : `Đang phát: ${song.title}`);
  };

  const handleRate = (stars) => {
    setRating(stars);
    // Mock API call POST /api/interactions/rate
    toast.success(`Bạn đã đánh giá ${stars} sao cho bài hát này!`);
  };

  const handleAddToPlaylist = (playlistId, playlistName) => {
    // TODO: gọi playlistAPI.addSong(playlistId, { song_id: song.id })
    toast.success(`Đã thêm "${song.title}" vào playlist "${playlistName}"`);
    setIsPlaylistModalOpen(false);
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (isPageLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
      </div>
    );
  }

  if (!song) return null;

  return (
    <div className="h-full flex flex-col relative">
      {/* Top Banner / Hero Section */}
      <div className="bg-gradient-to-b from-gray-800 to-black p-6 lg:p-10 flex flex-col md:flex-row items-center md:items-end gap-8 pt-10 md:pt-24 min-h-[40vh]">
        <img
          src={song.cover}
          alt={song.title}
          className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover rounded-md"
        />

        <div className="flex-1 w-full text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-300">
            Bài Hát
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mt-2 mb-4 drop-shadow-lg tracking-tight">
            {song.title}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-sm md:text-base text-gray-300">
            <span className="text-white font-bold hover:underline cursor-pointer text-lg">
              {song.artist}
            </span>
            <span className="mx-1">•</span>
            <span>{song.releaseDate}</span>
            <span className="mx-1">•</span>
            <span>{song.duration}</span>
            <span className="mx-1">•</span>
            <span>{song.listens} lượt nghe</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 lg:px-10 py-6 flex items-center flex-wrap gap-4 md:gap-6 bg-black/50 backdrop-blur-md sticky top-0 z-10 border-b border-gray-900">
        <button
          onClick={handlePlayToggle}
          className="w-14 h-14 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center text-black shadow-xl hover:scale-105 transition-transform hover:bg-green-400"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 ml-1 fill-current" />
          )}
        </button>

        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-3 rounded-full hover:bg-gray-800 transition-colors ${isLiked ? "text-green-500" : "text-gray-400"}`}
          title={isLiked ? "Bỏ thích" : "Yêu thích"}
        >
          <Heart className={`w-8 h-8 ${isLiked ? "fill-current" : ""}`} />
        </button>

        <button
          onClick={() => setIsPlaylistModalOpen(true)}
          className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          title="Thêm vào Playlist"
        >
          <PlusCircle className="w-8 h-8" />
        </button>

        <div className="h-8 w-px bg-gray-700 mx-2 hidden md:block"></div>

        {/* Star Rating System explicitly shown */}
        <div className="flex items-center gap-1 bg-gray-900/80 px-4 py-2 rounded-full border border-gray-800">
          <span className="text-sm text-gray-400 mr-2 font-medium">
            Đánh giá:
          </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              className={`${star <= rating ? "text-yellow-400" : "text-gray-600"} hover:text-yellow-300 hover:scale-110 transition-transform`}
            >
              <Star
                className="w-6 h-6"
                fill={star <= rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>

        <button className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ml-auto sm:ml-0 hidden sm:block">
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Areas */}
      <div className="px-6 lg:px-10 py-8 flex flex-col md:flex-row gap-12 flex-1 pb-32">
        {/* Left Column: Lyrics */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-6">Lời bài hát</h2>
          <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg font-medium">
              {song.lyrics}
            </p>
          </div>
        </div>

        {/* Right Column: Details & More Info */}
        <div className="w-full md:w-80 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Chi tiết</h2>
            <div className="space-y-4 text-sm bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
              <div className="flex justify-between">
                <span className="text-gray-400">Nghệ sĩ</span>
                <span className="text-white font-medium hover:underline cursor-pointer">
                  {song.artist}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Album</span>
                <span className="text-white font-medium hover:underline cursor-pointer">
                  {song.album}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Thể loại</span>
                <span className="text-white font-medium">{song.genre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phát hành</span>
                <span className="text-white font-medium">
                  {song.releaseDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lượt nghe</span>
                <span className="text-white font-medium">{song.listens}</span>
              </div>
            </div>
          </div>

          {/* Bài hát tương tự (cosine similarity trên audio features) */}
          {similarSongs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Tương tự</h2>
              <div className="space-y-1">
                {similarSongs.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/songs/${s.id}`)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-left transition-colors group"
                  >
                    <img
                      src={s.cover || "https://via.placeholder.com/40"}
                      alt={s.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate group-hover:text-green-400 transition-colors">
                        {s.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">{s.artist}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      {/* Add to Playlist Modal */}
      <Modal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        title={
          <span className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-green-400" />
            Thêm vào Playlist
          </span>
        }
      >
        <p className="text-gray-400 text-sm mb-6">
          Chọn danh sách phát bạn muốn lưu bài hát "{song.title}".
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
          {userPlaylists.length > 0 ? (
            userPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handleAddToPlaylist(playlist.id, playlist.name)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 text-left transition-colors group border border-transparent hover:border-gray-700"
              >
                <span className="text-white font-medium">{playlist.name}</span>
                <PlusCircle className="w-5 h-5 text-gray-500 group-hover:text-green-400" />
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Bạn chưa có playlist nào.</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <Button
            variant="text"
            onClick={() => {
              setIsPlaylistModalOpen(false);
              navigate("/playlists"); // go create new playlist
            }}
            className="text-green-400 px-0"
          >
            + Tạo Playlist mới
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsPlaylistModalOpen(false)}
          >
            Đóng
          </Button>
        </div>
      </Modal>
    </div>
  );
}
