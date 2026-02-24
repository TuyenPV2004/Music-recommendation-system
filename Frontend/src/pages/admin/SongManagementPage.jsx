import React, { useState } from "react";
import {
  Music,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Play,
  Filter,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";

const MOCK_GENRES = [
  { id: 1, name: "Pop" },
  { id: 2, name: "Ballad" },
  { id: 3, name: "Rap/Hip-Hop" },
  { id: 4, name: "R&B" },
];

const MOCK_MOODS = [
  { id: 1, name: "Vui vẻ" },
  { id: 2, name: "Buồn bã" },
  { id: 3, name: "Thư giãn" },
  { id: 4, name: "Sôi động" },
];

const MOCK_SONGS = [
  {
    id: 1,
    title: "Chắc Ai Đó Sẽ Về",
    author: "Sơn Tùng M-TP",
    duration: "4:20",
    releaseDate: "2014-12-19",
    genre: "Pop",
    mood: "Buồn bã",
    cover: "https://i.ytimg.com/vi/PdbsnGuduvo/mqdefault.jpg",
  },
  {
    id: 2,
    title: "Nấu Ăn Cho Em",
    author: "Đen Vâu ft. PiaLinh",
    duration: "4:05",
    releaseDate: "2023-05-12",
    genre: "Rap/Hip-Hop",
    mood: "Thư giãn",
    cover:
      "https://cdn2.tuoitre.vn/zoom/700_525/471584752817336320/2023/5/21/den-vau-nau-an-cho-em-1684631926935714041497-91-0-1138-2000-crop-1684631968837627660208.jpg",
  },
  {
    id: 3,
    title: "Có Chàng Trai Viết Lên Cây",
    author: "Phan Mạnh Quỳnh",
    duration: "5:12",
    releaseDate: "2019-12-20",
    genre: "Ballad",
    mood: "Buồn bã",
    cover: "https://i.ytimg.com/vi/0VC6euBtKkk/maxresdefault.jpg",
  },
  {
    id: 4,
    title: "Lửng Lơ",
    author: "Masew x BRAY",
    duration: "3:45",
    releaseDate: "2020-08-15",
    genre: "EDM",
    mood: "Sôi động",
    cover: "https://i.ytimg.com/vi/SdESQH77bTg/maxresdefault.jpg",
  },
];

export default function SongManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterMood, setFilterMood] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const filteredSongs = MOCK_SONGS.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = filterGenre
      ? song.genre ===
        MOCK_GENRES.find((g) => g.id.toString() === filterGenre)?.name
      : true;
    const matchesMood = filterMood
      ? song.mood ===
        MOCK_MOODS.find((m) => m.id.toString() === filterMood)?.name
      : true;

    return matchesSearch && matchesGenre && matchesMood;
  });

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
    // Rough mock mapping for edit form (In real app, song object should have genreId/moodId)
    const gId = MOCK_GENRES.find((g) => g.name === song.genre)?.id || "";
    const mId = MOCK_MOODS.find((m) => m.name === song.mood)?.id || "";

    setFormData({
      title: song.title,
      author: song.author,
      audioLink: "https://mock-audio-link.com/file.mp3", // Mock
      cover: song.cover,
      duration: song.duration,
      releaseDate: song.releaseDate,
      genreId: gId.toString(),
      moodId: mId.toString(),
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
      // Mock API POST/PUT /api/songs
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingSong) {
        toast.success(`Đã cập nhật bài hát "${formData.title}"`);
      } else {
        toast.success(`Đã thêm mới bài hát "${formData.title}"`);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Thao tác thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (title) => {
    if (
      window.confirm(
        `Xóa vĩnh viễn bài hát "${title}" khỏi hệ thống? Dữ liệu tương tác liên quan cũng sẽ bị ảnh hưởng.`,
      )
    ) {
      toast.info(`Đã xóa bài hát ${title}`);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
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
          <div className="relative w-full lg:w-96">
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
            className="flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full font-medium text-sm hover:focus:ring-green-600 hover:bg-green-600 transition-colors shadow-sm whitespace-nowrap"
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
              className="bg-black border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2 pr-8 w-full sm:w-auto outline-none appearance-none cursor-pointer"
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <option value="">Thể loại</option>
              {MOCK_GENRES.map((g) => (
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
          <div className="relative w-full sm:w-auto">
            <select
              className="bg-black border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2 pr-8 w-full sm:w-auto outline-none appearance-none cursor-pointer"
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
            >
              <option value="">Cảm xúc</option>
              {MOCK_MOODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
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
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden lg:table-cell min-w-[200px]"
                >
                  Thể loại và cảm xúc
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden xl:table-cell"
                >
                  Phát hành
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden xl:table-cell"
                >
                  Thời lượng
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {filteredSongs.map((song) => (
                <tr
                  key={song.id}
                  className="hover:bg-gray-800/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{song.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow">
                        <img
                          src={song.cover}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Play
                            className="w-4 h-4 text-white ml-0.5"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                      <div
                        className="text-sm font-bold text-white max-w-[200px] truncate"
                        title={song.title}
                      >
                        {song.title}
                        {/* Show artist on small screens where artist column is hidden */}
                        <div className="text-xs font-normal text-gray-400 md:hidden truncate mt-0.5">
                          {song.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium hidden md:table-cell max-w-[150px] truncate">
                    {song.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="flex flex-row gap-2 items-center flex-wrap">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
                        {song.genre}
                      </span>
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 w-fit">
                        {song.mood}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden xl:table-cell">
                    {song.releaseDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden xl:table-cell">
                    {song.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(song)}
                        className="text-gray-400 hover:text-green-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                        title="Chỉnh sửa Chi tiết"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(song.title)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                        title="Xóa Bài hát"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSongs.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
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
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-950/50 px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Hiển thị{" "}
            <span className="font-medium text-white">
              {filteredSongs.length}
            </span>{" "}
            /{" "}
            <span className="font-medium text-white">{MOCK_SONGS.length}</span>{" "}
            bài hát
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled
            >
              Trước
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium border border-green-500 shadow-sm">
              1
            </button>
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled
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
        title={editingSong ? "Cập nhật Bài hát" : "Thêm Bài hát Mới"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveSong} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side details */}
            <div className="space-y-4">
              <Input
                id="title"
                name="title"
                label="Tên Bài hát *"
                placeholder="Ví dụ: Chắc Ai Đó Sẽ Về"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <Input
                id="author"
                name="author"
                label="Nghệ sĩ *"
                placeholder="Ví dụ: Sơn Tùng M-TP"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
              <Input
                id="cover"
                name="cover"
                label="URL Ảnh Bìa (Cover Art)"
                placeholder="https://..."
                value={formData.cover}
                onChange={handleInputChange}
              />
              <Input
                id="audioLink"
                name="audioLink"
                label="URL File Audio/MP3 *"
                placeholder="https://.../file.mp3"
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
                    label="Thời lượng (vd: 3:45)"
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
                  <Filter className="w-4 h-4 text-green-400" />
                  Phân loại Nhãn (Mapping)
                </h3>
                <p className="text-xs text-gray-400 mb-4 bg-gray-950 p-3 rounded border border-gray-800">
                  Song Recommendation Model (LightFM) sử dụng{" "}
                  <strong className="text-gray-300">Thể loại</strong> và{" "}
                  <strong className="text-gray-300">Cảm xúc</strong> như những
                  Item Features then chốt để phục vụ hệ thống Gợi ý lai
                  (Hybrid).
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  Thể loại Âm nhạc (Genre) *
                </label>
                <select
                  name="genreId"
                  value={formData.genreId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  required
                >
                  <option value="" disabled>
                    -- Chọn Thể loại --
                  </option>
                  {MOCK_GENRES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 mt-4">
                <label className="block text-sm font-medium text-gray-300">
                  Nhãn Cảm xúc (Mood) *
                </label>
                <select
                  name="moodId"
                  value={formData.moodId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                  required
                >
                  <option value="" disabled>
                    -- Chọn Cảm xúc --
                  </option>
                  {MOCK_MOODS.map((m) => (
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
              {editingSong ? "Cập nhật dữ liệu" : "Đăng Biên mục"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
