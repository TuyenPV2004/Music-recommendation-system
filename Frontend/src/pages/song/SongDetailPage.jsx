import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Heart,
  Star,
  PlusCircle,
  Share2,
  ListMusic,
  ArrowLeft,
  Music2,
  Clock,
  Disc3,
  Zap,
  Smile,
  Loader2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { toast } from "react-toastify";
import { songAPI, playlistAPI, interactionAPI } from "../../services/api";
import usePlayerStore from "../../store/usePlayerStore";
import useAuthStore from "../../store/useAuthStore";
import SongCard from "../../components/song/SongCard";

export default function SongDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [song, setSong] = useState(null);
  const [relatedSongs, setRelatedSongs] = useState([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    currentRating,
    setRating: setStoreRating,
    setPlaylist,
  } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();

  const isCurrentSong = currentSong && song && currentSong.id === song.id;
  // Use shared store rating when viewing the currently-playing song, else local
  const [localRating, setLocalRating] = useState(0);
  const rating = isCurrentSong ? currentRating : localRating;

  useEffect(() => {
    const fetchSong = async () => {
      setIsLoadingDetail(true);

      try {
        const res = await songAPI.detail(id);
        const data = res.data || res;

        setSong(data);
      } catch (error) {
        console.error("Error fetching song:", error);
        toast.error("Không thể tải thông tin bài hát.");
      } finally {
        setIsLoadingDetail(false);
      }
    };

    fetchSong();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchSimilar = async () => {
      setIsLoadingSimilar(true);

      try {
        const res = await songAPI.similar(id, { limit: 12 });
        const data = res.data || res;

        setRelatedSongs(data.similar_songs || []);
      } catch (err) {
        console.error("Error fetching similar songs:", err);
      } finally {
        setIsLoadingSimilar(false);
      }
    };

    fetchSimilar();
  }, [id]);

  const handlePlayToggle = () => {
    if (!song) return;
    if (isCurrentSong) {
      togglePlay();
    } else {
      const currentSongObj = {
        id: song.id,
        name: song.title || song.name,
        author: song.artist || song.author,
        audio_link: song.audio_link || song.cover,
      };
      // Build playlist from current song + related songs
      const allSongs = [
        currentSongObj,
        ...relatedSongs.map((s) => ({
          id: s.id,
          name: s.name || s.title,
          author: s.author || s.artist,
          audio_link: s.audio_link || s.cover,
        })),
      ];
      setPlaylist(allSongs);
      playSong(currentSongObj);
    }
  };

  const handleRate = async (stars) => {
    if (isCurrentSong) {
      setStoreRating(stars);
    } else {
      setLocalRating(stars);
    }
    if (isAuthenticated) {
      try {
        await interactionAPI.rate({ song_id: song.id, rate: stars });
        toast.success(`Bạn đã đánh giá ${stars} sao!`);
      } catch {
        toast.info(`Đánh giá ${stars} sao (chưa lưu).`);
      }
    } else {
      toast.info(`Đánh giá ${stars} sao (đăng nhập để lưu).`);
    }
  };

  const handleOpenPlaylistModal = async () => {
    if (!isAuthenticated) {
      toast.warning("Vui lòng đăng nhập để thêm vào playlist.");
      return;
    }
    try {
      const res = await playlistAPI.list();
      setPlaylists(res.data || res || []);
    } catch {
      setPlaylists([]);
    }
    setIsPlaylistModalOpen(true);
  };

  const handleAddToPlaylist = async (playlistId, playlistName) => {
    try {
      await playlistAPI.addSong(playlistId, { song_id: song.id });
      toast.success(`Đã thêm vào "${playlistName}"`);
      setIsPlaylistModalOpen(false);
    } catch {
      toast.error("Không thể thêm bài hát vào playlist.");
    }
  };

  // Audio feature bar component
  const AudioFeatureBar = ({ label, value, icon: Icon, color }) => {
    if (value === null || value === undefined) return null;
    const percent = Math.round(value * 100);
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-400">
            <Icon className="w-4 h-4" />
            {label}
          </span>
          <span className="text-white font-semibold">{percent}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  if (isLoadingDetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
        <Music2 className="w-16 h-16" />
        <p className="text-xl font-semibold">Không tìm thấy bài hát</p>
        <Button onClick={() => navigate("/")}>Về trang chủ</Button>
      </div>
    );
  }

  const songTitle = song.title || song.name;
  const songArtist = song.artist || song.author || "Unknown";

  return (
    <div className="h-full flex flex-col overflow-y-auto scrollbar-hide">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#2DC275]/30 via-[#1a1a2e] to-black p-6 lg:p-10 pt-8 md:pt-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mt-8 md:mt-0">
          {/* Cover Art */}
          <div className="relative group">
            <div className="w-52 h-52 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
              <div className="w-full h-full bg-gradient-to-br from-[#2DC275] to-[#1a6b3a] flex items-center justify-center">
                <Music2 className="w-20 h-20 text-white" />
              </div>
            </div>
            {/* Hover play overlay */}
            <button
              onClick={handlePlayToggle}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
            >
              {isCurrentSong && isPlaying ? (
                <Pause className="w-16 h-16 text-white drop-shadow-lg" />
              ) : (
                <Play className="w-16 h-16 text-white drop-shadow-lg ml-1" />
              )}
            </button>
          </div>

          {/* Song Info */}
          <div className="flex-1 w-full text-center md:text-left space-y-3">
            <p className="text-xs font-bold tracking-[0.2em] text-[#2DC275]">
              Bài hát
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {songTitle}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-300 flex-wrap">
              <span className="text-white font-bold text-lg hover:underline cursor-pointer">
                {songArtist}
              </span>
              {song.genre && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs font-medium">
                    {song.genre}
                  </span>
                </>
              )}
              {song.releaseDate && (
                <>
                  <span className="text-gray-500">•</span>
                  <span>{song.releaseDate}</span>
                </>
              )}
              {song.duration && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {song.duration}
                  </span>
                </>
              )}
              {song.listens && (
                <>
                  <span className="text-gray-500">•</span>
                  <span>{song.listens} lượt nghe</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 lg:px-10 py-5 flex items-center flex-wrap gap-4 md:gap-5 bg-black/60 backdrop-blur-sm border-b border-gray-800/50">
        <button
          onClick={handlePlayToggle}
          className="w-14 h-14 bg-[#2DC275] rounded-full flex items-center justify-center text-black shadow-lg shadow-green-500/20 hover:scale-105 hover:bg-[#33d681] transition-all"
        >
          {isCurrentSong && isPlaying ? (
            <Pause className="w-7 h-7 fill-current" />
          ) : (
            <Play className="w-7 h-7 ml-0.5 fill-current" />
          )}
        </button>

        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-3 rounded-full hover:bg-gray-800 transition-colors ${isLiked ? "text-[#2DC275]" : "text-gray-400"}`}
          title={isLiked ? "Bỏ thích" : "Yêu thích"}
        >
          <Heart className={`w-7 h-7 ${isLiked ? "fill-current" : ""}`} />
        </button>

        <button
          onClick={handleOpenPlaylistModal}
          className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          title="Thêm vào Playlist"
        >
          <PlusCircle className="w-7 h-7" />
        </button>

        <div className="h-7 w-px bg-gray-700 mx-1 hidden md:block" />

        {/* Star Rating */}
        <div className="flex items-center gap-1 bg-gray-900/80 px-4 py-2.5 rounded-full border border-gray-800">
          <span className="text-sm text-gray-400 mr-2 font-medium">
            Đánh giá:
          </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              className={`${star <= rating ? "text-yellow-400" : "text-gray-600"} hover:text-yellow-300 hover:scale-110 transition-all`}
            >
              <Star
                className="w-5 h-5"
                fill={star <= rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-10 py-8 flex flex-col lg:flex-row gap-10 flex-1 pb-32">
        {/* Left: Audio Features Visualization */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              Chỉ số bài hát
            </h2>
            <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-800/50 space-y-5">
              <AudioFeatureBar
                label="Danceability"
                value={song.danceability}
                icon={Disc3}
                color="bg-gradient-to-r from-pink-500 to-rose-400"
              />
              <AudioFeatureBar
                label="Energy"
                value={song.energy}
                icon={Zap}
                color="bg-gradient-to-r from-orange-500 to-amber-400"
              />
              <AudioFeatureBar
                label="Valence"
                value={song.valence}
                icon={Smile}
                color="bg-gradient-to-r from-green-500 to-emerald-400"
              />
            </div>
          </div>

          {/* Tags / Album info */}
          {song.album && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {song.album.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Songs */}
          {isLoadingSimilar ? (
            <div className="text-gray-400">Đang tải bài hát tương tự...</div>
          ) : relatedSongs.length === 0 ? (
            <div className="text-gray-400">Không có bài hát tương tự nào.</div>
          ) : (
            <div className="pt-4">
              <h2 className="text-xl font-bold text-white mb-4">
                Có thể bạn sẽ thích
              </h2>
              <div className="grid grid-cols-5 gap-4">
                {relatedSongs.slice(0, 10).map((rs) => (
                  <SongCard key={rs.id} song={rs} siblings={relatedSongs} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Details Panel */}
        <div className="w-full lg:w-80 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Chi tiết</h2>
            <div className="space-y-0 text-sm bg-gray-900/40 rounded-2xl overflow-hidden border border-gray-800/50">
              <DetailRow label="Nghệ sĩ" value={songArtist} />
              {song.genre && <DetailRow label="Thể loại" value={song.genre} />}
              {song.releaseDate && (
                <DetailRow label="Phát hành" value={song.releaseDate} />
              )}
              {song.duration && (
                <DetailRow label="Thời lượng" value={song.duration} />
              )}
              {song.listens && (
                <DetailRow label="Lượt nghe" value={song.listens} />
              )}
              {song.track_hash && (
                <DetailRow label="Track ID" value={song.track_hash} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add to Playlist Modal */}
      <Modal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        title={
          <span className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#2DC275]" />
            Thêm vào Playlist
          </span>
        }
      >
        <p className="text-gray-400 text-sm mb-6">
          Chọn danh sách phát bạn muốn lưu bài hát "{songTitle}".
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-2 scrollbar-hide">
          {Array.isArray(playlists) && playlists.length > 0 ? (
            playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => handleAddToPlaylist(pl.id, pl.name)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 text-left transition-colors group border border-transparent hover:border-gray-700"
              >
                <span className="text-white font-medium">{pl.name}</span>
                <PlusCircle className="w-5 h-5 text-gray-500 group-hover:text-[#2DC275]" />
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">
              Chưa có playlist nào. Tạo một playlist mới nhé!
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <Button
            variant="text"
            onClick={() => {
              setIsPlaylistModalOpen(false);
              navigate("/playlists");
            }}
            className="text-[#2DC275] px-0"
          >
            Tạo Playlist mới
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex justify-between px-5 py-3 border-b border-gray-800/50 last:border-b-0">
      <span className="text-gray-400">{label}</span>
      <span
        className={`text-white font-medium truncate ml-4 text-right ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
