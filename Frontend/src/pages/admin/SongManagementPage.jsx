import React, { useState, useEffect, useCallback } from "react";
import {
  Music,
  Search,
  Plus,
  Edit,
  Trash2,
  Play,
  Filter,
  Loader2,
  EllipsisVertical,
  X,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { adminAPI } from "../../services/api";
import { getGenreColorClass } from "../../utils/genreColors";

export default function SongManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("");

  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailSong, setDetailSong] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    audioLink: "",
    cover: "",
    duration: "",
    releaseDate: "",
    genreId: "",
    moodId: "",
  });

  // Fetch genres & moods once
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [genreRes, moodRes] = await Promise.all([
          adminAPI.genres(),
          adminAPI.moods(),
        ]);
        setGenres(genreRes.data || []);
        setMoods(moodRes.data || []);
      } catch (err) {
        console.error("Failed to fetch genres/moods:", err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch songs
  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, search: searchQuery };
      if (filterGenre) params.genre = parseInt(filterGenre);
      const res = await adminAPI.songs(params);
      setSongs(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to fetch songs:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, filterGenre]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Reset page on search/filter change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterGenre]);

  const totalPages = Math.ceil(total / limit);

  const formatDuration = (ms) => {
    if (!ms) return "—";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const openCreateModal = () => {
    setEditingSong(null);
    setFormData({
      title: "",
      author: "",
      audioLink: "",
      cover: "",
      duration: "",
      releaseDate: "",
      genreId: "",
      moodId: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (song) => {
    setEditingSong(song);
    setFormData({
      title: song.name,
      author: song.author || "",
      audioLink: "",
      cover: "",
      duration: song.duration ? formatDuration(song.duration) : "",
      releaseDate: "",
      genreId: "",
      moodId: "",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSong = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Mock API POST/PUT (backend doesn't have create/update endpoints yet)
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingSong) {
        toast.success(`Đã cập nhật bài hát "${formData.title}"`);
      } else {
        toast.success(`Đã thêm mới bài hát "${formData.title}"`);
      }
      setIsModalOpen(false);
      fetchSongs(); // Refresh
    } catch (error) {
      toast.error("Thao tác thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (title) => {
    const result = await Swal.fire({
      title: "Xóa bài hát?",
      text: `Xóa vĩnh viễn bài hát "${title}" khỏi hệ thống? Dữ liệu tương tác liên quan cũng sẽ bị ảnh hưởng.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      background: "#1D1D1D",
      color: "#fff",
    });

    if (result.isConfirmed) {
      toast.info(`Đã xóa bài hát ${title}`);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Quản lý bài hát
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Kho lưu trữ trung tâm của hệ thống, tải lên file và gán nhãn.
          </p>
        </div>
      </div>

      {/* Advanced Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 flex-1">
          <div className="relative w-full lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-black text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="Tìm theo tên bài hát, nghệ sĩ"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-green-500 text-black px-5 py-2 rounded-full font-medium text-sm hover:focus:ring-green-600 hover:bg-green-400 transition-colors shadow-sm whitespace-nowrap"
          >
            Thêm bài hát mới
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap hidden sm:flex">
            <Filter className="w-4 h-4" /> Lọc:
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              className="bg-gray-800/50 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-green-500/50 focus:border-green-500 block p-2 pr-8 w-full sm:w-auto outline-none appearance-none cursor-pointer transition-colors duration-200"
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <option value="">Tất cả phân loại</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider w-16"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Bài hát
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400  tracking-wider hidden md:table-cell"
                >
                  Nghệ sĩ
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden lg:table-cell"
                >
                  Thể loại
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden xl:table-cell"
                >
                  Spotify ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden xl:table-cell"
                >
                  Thời lượng
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                      <span className="ml-3 text-gray-400">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : songs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Music className="w-8 h-8 opacity-20 mb-3" />
                      <p>
                        Danh sách bài hát trống hoặc không có kết quả phù hợp.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                songs.map((song) => (
                  <tr
                    key={song.id}
                    className="hover:bg-gray-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{song.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-800 flex items-center justify-center">
                          <Music className="w-4 h-4 text-gray-500" />
                        </div>
                        <div
                          className="text-sm font-bold text-white max-w-[200px] truncate"
                          title={song.name}
                        >
                          {song.name}
                          <div className="text-xs font-normal text-gray-400 md:hidden truncate mt-0.5">
                            {song.author}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium hidden md:table-cell max-w-[150px] truncate">
                      {song.author || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      {song.genre ? (
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${getGenreColorClass(genres.find((g) => g.name === song.genre)?.id)}`}
                        >
                          {song.genre}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden xl:table-cell font-mono">
                      {song.spotify_id || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden xl:table-cell">
                      {formatDuration(song.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(song)}
                          className="text-gray-400 hover:text-green-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDetailSong(song)}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                          title="Xem chi tiết"
                        >
                          <EllipsisVertical className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(song.name)}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                          title="Xóa bài hát"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-950/50 px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Hiển thị{" "}
            <span className="font-medium text-white">{songs.length}</span> /{" "}
            <span className="font-medium text-white">{total}</span> bài hát
            (Trang {page}/{totalPages || 1})
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </button>
            <span className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium border border-green-500 shadow-sm">
              {page}
            </span>
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE MODAL FOR SONG CREATION/EDITING */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSong ? "Cập nhật bài hát" : "Thêm bài hát mới"}
        maxWidth="max-w-2xl"
        showCloseButton={false}
      >
        <form onSubmit={handleSaveSong} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side details */}
            <div className="space-y-4">
              <Input
                id="title"
                name="title"
                label="Tên bài hát"
                placeholder="Nhập tên bài hát"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <Input
                id="author"
                name="author"
                label="Nghệ sĩ"
                placeholder="Nhập tên nghệ sĩ"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
              <Input
                id="cover"
                name="cover"
                label="URL ảnh bìa"
                placeholder="Nhập URL ảnh bìa"
                value={formData.cover}
                onChange={handleInputChange}
              />
              <Input
                id="audioLink"
                name="audioLink"
                label="URL File Audio/MP3"
                placeholder="Nhập URL file"
                value={formData.audioLink}
                onChange={handleInputChange}
                required
              />

              <div className="flex gap-4">
                <div className="w-1/2">
                  <Input
                    type="date"
                    id="releaseDate"
                    name="releaseDate"
                    label="Ngày phát hành"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    type="text"
                    id="duration"
                    name="duration"
                    label="Thời lượng"
                    placeholder="Tính bằng s hoặc mm:ss"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Right side AI Meta data */}
            <div className="space-y-4 md:border-l md:border-gray-800 md:pl-4">
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  Phân loại
                </h3>
                <p className="text-xs text-gray-400 mb-4 bg-gray-950 p-3 rounded border border-gray-800">
                  Song Recommendation Model LightFM sử dụng{" "}
                  <strong className="text-gray-300">Thể loại</strong> và{" "}
                  <strong className="text-gray-300">Cảm xúc</strong> như những
                  Item Features then chốt để phục vụ hệ thống gợi ý lai
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  Thể loại
                </label>
                <select
                  name="genreId"
                  value={formData.genreId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                  required
                >
                  <option value="" disabled>
                    Chọn thể loại
                  </option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 mt-4">
                <label className="block text-sm font-medium text-gray-300">
                  Nhãn cảm xúc
                </label>
                <select
                  name="moodId"
                  value={formData.moodId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
                  required
                >
                  <option value="" disabled>
                    Chọn cảm xúc
                  </option>
                  {moods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingSong ? "Cập nhật dữ liệu" : "Xác nhận"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DETAIL MODAL */}
      <Modal
        isOpen={!!detailSong}
        onClose={() => setDetailSong(null)}
        title="Chi tiết bài hát"
        maxWidth="max-w-2xl"
      >
        {detailSong && (
          <div className="mt-4 space-y-5 max-h-[70vh] overflow-y-auto pr-1 scrollbar-hide">
            {/* Song header */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
              <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 text-gray-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white truncate">
                  {detailSong.name}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {detailSong.author || "Không rõ nghệ sĩ"}
                </p>
              </div>
            </div>

            {/* Thông tin cơ bản */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Thông tin cơ bản
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">ID</p>
                  <p className="text-sm text-white font-medium">
                    #{detailSong.id}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Track Hash</p>
                  <p
                    className="text-sm text-white font-medium font-mono truncate"
                    title={detailSong.track_hash}
                  >
                    {detailSong.track_hash || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Thể loại</p>
                  <p className="text-sm text-white font-medium">
                    {detailSong.genre || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Thời lượng</p>
                  <p className="text-sm text-white font-medium">
                    {formatDuration(detailSong.duration)}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Spotify ID</p>
                  <p
                    className="text-sm text-white font-medium font-mono truncate"
                    title={detailSong.spotify_id}
                  >
                    {detailSong.spotify_id || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Ngày phát hành</p>
                  <p className="text-sm text-white font-medium">
                    {detailSong.release_date || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Audio Link</p>
                  <p
                    className="text-sm text-white font-medium truncate"
                    title={detailSong.audio_link}
                  >
                    {detailSong.audio_link ? (
                      <a
                        href={detailSong.audio_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-400 hover:underline"
                      >
                        {detailSong.audio_link}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Tags</p>
                  <p className="text-sm text-white font-medium">
                    {detailSong.tags || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Ngày tạo</p>
                  <p className="text-sm text-white font-medium">
                    {detailSong.created_at || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Chỉ số âm nhạc Spotify */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Chỉ số âm nhạc Spotify
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Danceability", value: detailSong.danceability },
                  { label: "Energy", value: detailSong.energy },
                  {
                    label: "Loudness",
                    value: detailSong.loudness,
                    suffix: " dB",
                  },
                  { label: "Speechiness", value: detailSong.speechiness },
                  { label: "Acousticness", value: detailSong.acousticness },
                  {
                    label: "Instrumentalness",
                    value: detailSong.instrumentalness,
                  },
                  { label: "Liveness", value: detailSong.liveness },
                  { label: "Valence", value: detailSong.valence },
                  { label: "Tempo", value: detailSong.tempo, suffix: " BPM" },
                  { label: "Key", value: detailSong.song_key },
                  {
                    label: "Mode",
                    value:
                      detailSong.mode != null
                        ? detailSong.mode === 1
                          ? "Major"
                          : "Minor"
                        : null,
                  },
                  { label: "Time Signature", value: detailSong.time_signature },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-800/50 rounded-lg p-3"
                  >
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="text-sm text-white font-medium">
                      {item.value != null
                        ? `${item.value}${item.suffix || ""}`
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
