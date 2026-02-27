import React, { useState, useEffect } from "react";
import { Music2, Loader2 } from "lucide-react";
import SongCard from "../../components/song/SongCard";
import { genreAPI, songAPI } from "../../services/api";
import { getGenreColorClass } from "../../utils/genreColors";

export default function GenresPage() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await genreAPI.list();
        const data = res.data || res.items || res || [];
        setGenres(data);
        if (data.length > 0) {
          setSelectedGenre(data[0]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách thể loại: ", error);
      } finally {
        setIsLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!selectedGenre) return;

    const fetchSongs = async () => {
      setIsLoadingSongs(true);
      try {
        const res = await songAPI.list({
          genre: selectedGenre.id,
          limit: 50, // Get a good amount of songs for the genre
        });
        const songsData =
          res.data?.items ||
          res.data?.data ||
          res.items ||
          res.data ||
          res ||
          [];
        // The API might wrap the data differently based on pagination vs direct list
        const actualSongs = Array.isArray(songsData)
          ? songsData
          : songsData.data || [];
        setSongs(actualSongs);
      } catch (error) {
        console.error("Lỗi lấy bài hát theo thể loại: ", error);
        setSongs([]);
      } finally {
        setIsLoadingSongs(false);
      }
    };
    fetchSongs();
  }, [selectedGenre]);

  return (
    <div className="h-full flex flex-col p-6 lg:p-10 relative">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          Khám phá thể loại
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Khám phá bộ sưu tập phong phú các giai điệu từ nhiều thể loại âm nhạc
          khác nhau. Từ Pop sôi động đến Lofi thư giãn.
        </p>
      </div>

      {isLoadingGenres ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-10 h-10 text-[#2DC275] animate-spin" />
        </div>
      ) : genres.length > 0 ? (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Genre Tabs Container */}
          <div className="pb-6 border-b border-gray-800/50 mb-6 shrink-0 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 w-max px-1 pt-2 pb-3">
              {genres.map((genre) => {
                const isSelected = selectedGenre?.id === genre.id;
                const { bgClass } = getGenreColorClass(genre.id);

                return (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre)}
                    className={`
                      px-6 py-4 rounded-2xl flex items-center justify-center transition-all duration-300
                      font-bold text-lg whitespace-nowrap overflow-hidden relative group
                      ${bgClass}
                      ${isSelected ? "text-white shadow-lg scale-105 z-10 opacity-100" : "text-white/70 opacity-50 hover:opacity-80"}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}
                    <span className="relative z-10 z-20 truncate max-w-[200px]">
                      {genre.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Songs Grid Container */}
          <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                Tuyển tập nhạc {selectedGenre?.name}
              </h2>
              <span className="text-sm font-medium text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                {songs.length} bài hát
              </span>
            </div>

            {isLoadingSongs ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-[#2DC275] animate-spin" />
              </div>
            ) : songs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-20">
                {songs.map((song) => (
                  <SongCard
                    key={song.id || song.song_id}
                    song={song}
                    siblings={songs}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
                <Music2 className="w-16 h-16 opacity-50" />
                <p className="text-lg">
                  Thể loại này hiện chưa có bài hát nào.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
          <Music2 className="w-16 h-16 opacity-50" />
          <p className="text-lg">
            Chưa có thể loại âm nhạc nào được hệ thống ghi nhận.
          </p>
        </div>
      )}
    </div>
  );
}
