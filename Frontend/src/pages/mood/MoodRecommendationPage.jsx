import React, { useState } from "react";
import Button from "../../components/ui/Button";
import SongCard from "../../components/song/SongCard";
import { Sparkles, Loader2, Smile, Frown, Coffee } from "lucide-react";
import { toast } from "react-toastify";

const MOCK_MOOD_RESULTS = {
  vui_ve: {
    label: "Vui vẻ, Hứng khởi",
    icon: <Smile className="w-8 h-8 text-yellow-400" />,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    songs: [
      {
        id: 101,
        title: "Waiting For You",
        artist: "MONO",
        cover:
          "https://i.ytimg.com/vi/u6Y96g_yjnQ/maxresdefault.jpg",
      },
      {
        id: 102,
        title: "See Tình",
        artist: "Hoàng Thùy Linh",
        cover:
          "https://image-cdn.nct.vn/song/share/2022/02/20/5/f/b/1/1645341333426.jpg",
      },
      {
        id: 106,
        title: "Đi Đu Đưa Đi",
        artist: "Bích Phương",
        cover:
          "https://photo-resize-zmp3.zmdcdn.me/w600_r300x169_jpeg/thumb_video/9/9/e/e/99ee33f170ea4841485d21ec3f76321f.jpg",
      },
    ],
  },
  buon_ba: {
    label: "Buồn bã / Suy tư",
    icon: <Frown className="w-8 h-8 text-blue-400" />,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    songs: [
      {
        id: 103,
        title: "Chạm Khẽ Tim Anh Một Chút Thôi",
        artist: "Noo Phước Thịnh",
        cover:
          "https://images.unsplash.com/photo-1516280440502-86111aebea23?w=300&h=300&fit=crop&q=80",
      },
      {
        id: 107,
        title: "Nước Mắt Em Lau Bằng Tình Yêu Mới",
        artist: "Da LAB, Tóc Tiên",
        cover:
          "https://images.unsplash.com/photo-1493225457124-a1a2a5f0a469?w=300&h=300&fit=crop&q=80",
      },
    ],
  },
  thu_gian: {
    label: "Thư giãn / Lofi",
    icon: <Coffee className="w-8 h-8 text-green-400" />,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    songs: [
      {
        id: 104,
        title: "Thức Giấc",
        artist: "Da LAB",
        cover:
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop&q=80",
      },
      {
        id: 105,
        title: "Bài Này Chill Phết",
        artist: "Đen, Min",
        cover:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&q=80",
      },
    ],
  },
};

export default function MoodRecommendationPage() {
  const [statusText, setStatusText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!statusText.trim()) {
      toast.warning("Vui lòng chia sẻ cảm xúc của bạn trước nhé!");
      return;
    }

    setIsLoading(true);
    setResult(null);

    // TODO: Connect to backend API: POST /api/recommendations/mood
    try {
      // Mock analyzing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const text = statusText.toLowerCase();
      let moodKey = "thu_gian"; // default
      if (
        text.includes("vui") ||
        text.includes("tuyệt") ||
        text.includes("hào hứng")
      ) {
        moodKey = "vui_ve";
      } else if (
        text.includes("buồn") ||
        text.includes("chán") ||
        text.includes("tệ") ||
        text.includes("khóc")
      ) {
        moodKey = "buon_ba";
      }

      setResult(MOCK_MOOD_RESULTS[moodKey]);
      toast.success("Đã phân tích xong cảm xúc của bạn!");
    } catch (error) {
      toast.error("Không thể phân tích cảm xúc lúc này. Thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 lg:p-10">
      <div className="max-w-4xl w-full mx-auto space-y-10 mt-8">
        {/* Header section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Âm nhạc theo cảm xúc
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Công nghệ thông minh của chúng tôi sẽ thấu hiểu tâm trạng của bạn qua từng câu chữ và đưa
            ra những giai điệu đồng điệu nhất.
          </p>
        </div>

        {/* Input section */}
        <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-gray-800 shadow-xl">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-300 mb-3"
          >
            Hôm nay tâm trạng của bạn thế nào ?
          </label>
          <textarea
            id="status"
            rows={4}
            className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all resize-none"
            placeholder="Hãy chia sẻ cảm xúc của bạn với chúng tôi nhé"
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
          />
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleAnalyze}
              isLoading={isLoading}
              className="px-8 py-3 text-base flex items-center gap-2"
            >
              Lắng nghe
            </Button>
          </div>
        </div>

        {/* Loading state indicator */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-pulse">
            <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
            <p className="text-gray-400 font-medium">
              Chúng tôi đang cảm nhận tâm trạng của bạn
            </p>
          </div>
        )}

        {/* Results section */}
        {result && !isLoading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Emotion Badge */}
            <div
              className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl border ${result.bg}`}
            >
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="p-3 bg-black/40 rounded-xl shadow-inner">
                  {result.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-400 tracking-wider font-semibold mb-1">
                    Cảm xúc được nhận diện:
                  </p>
                  <h3 className={`text-2xl font-bold ${result.color}`}>
                    {result.label}
                  </h3>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-300 text-sm">
                  Dưới đây là một vài giai điệu phù
                  <br />
                  hợp với tâm trạng hiện tại của bạn
                </p>
              </div>
            </div>

            {/* Song Recommendations Grid */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                Danh sách gợi ý
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {result.songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
