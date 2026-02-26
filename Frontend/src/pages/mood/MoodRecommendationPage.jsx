import React, { useState } from "react";
import Button from "../../components/ui/Button";
import SongCard from "../../components/song/SongCard";
import { Sparkles, Loader2, Smile, Frown, Coffee, Zap, AlertCircle, Meh } from "lucide-react";
import { toast } from "react-toastify";
import { recommendAPI } from "../../services/api";
import usePlayerStore from "../../store/usePlayerStore";

// Ánh xạ emotion label (lowercase, khớp với detected_mood từ PhoBERT API)
// sang config hiển thị UI. Chỉ sửa file này khi muốn đổi màu sắc / icon.
const EMOTION_UI_CONFIG = {
  enjoyment: {
    label: "Vui vẻ, Hứng khởi",
    icon: <Smile className="w-8 h-8 text-yellow-400" />,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
  },
  sadness: {
    label: "Buồn bã, Suy tư",
    icon: <Frown className="w-8 h-8 text-blue-400" />,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  anger: {
    label: "Tức giận, Bực bội",
    icon: <Zap className="w-8 h-8 text-red-400" />,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
  },
  fear: {
    label: "Lo lắng, Sợ hãi",
    icon: <AlertCircle className="w-8 h-8 text-purple-400" />,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
  disgust: {
    label: "Chán nản, Khó chịu",
    icon: <Meh className="w-8 h-8 text-gray-400" />,
    color: "text-gray-400",
    bg: "bg-gray-400/10 border-gray-400/20",
  },
  surprise: {
    label: "Bất ngờ, Hào hứng",
    icon: <Sparkles className="w-8 h-8 text-orange-400" />,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
  },
  other: {
    label: "Bình tâm, Thư giãn",
    icon: <Coffee className="w-8 h-8 text-green-400" />,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
};

export default function MoodRecommendationPage() {
  const [statusText, setStatusText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { setPlaylist } = usePlayerStore();

  const handleAnalyze = async () => {
    if (!statusText.trim()) {
      toast.warning("Vui lòng chia sẻ cảm xúc của bạn trước nhé!");
      return;
    }

    setIsLoading(true);
    setResult(null);

    // POST /api/recommendations/mood { text }
    // Response: { detected_mood, confidence, blend_info, songs: [{id,title,artist,cover,similarity}] }
    try {
      const data = await recommendAPI.mood({ text: statusText });

      // Map detected_mood → UI config (màu sắc, icon, nhãn hiển thị)
      const moodKey = (data.detected_mood || "other").toLowerCase();
      const uiConfig = EMOTION_UI_CONFIG[moodKey] || EMOTION_UI_CONFIG.other;

      const songs = data.songs || [];

      // Lưu playlist vào store để next/prev hoạt động
      setPlaylist(songs);

      setResult({
        ...uiConfig,
        detected_mood: data.detected_mood,
        confidence: data.confidence,
        blend_info: data.blend_info,
        songs,
      });
      toast.success("Đã phân tích xong cảm xúc của bạn!");
    } catch (error) {
      toast.error(error.message || "Không thể phân tích cảm xúc lúc này. Thử lại sau!");
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
                  {/* Hiển thị độ tự tin và chiến lược blend */}
                  <p className="text-xs text-gray-500 mt-1">
                    {result.blend_info?.strategy === "blend_top2" && (
                      <span className="ml-2 text-gray-600">
                        (kết hợp {result.blend_info.emotions_used.join(" + ")})
                      </span>
                    )}
                  </p>
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
                  <SongCard key={song.id} song={song} playlist={result.songs} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
