import React, { useState } from "react";
import Button from "../../components/ui/Button";
import SongCard from "../../components/song/SongCard";
import { Sparkles, Loader2, Smile, Frown, Coffee } from "lucide-react";
import { toast } from "react-toastify";

import { recommendAPI } from "../../services/api";

const MOOD_UI_MAP = {
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
    label: "Tức giận",
    icon: <Frown className="w-8 h-8 text-red-500" />,
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/20",
  },
  fear: {
    label: "Sợ hãi, Lo âu",
    icon: <Frown className="w-8 h-8 text-purple-400" />,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
  surprise: {
    label: "Ngạc nhiên, Bất ngờ",
    icon: <Sparkles className="w-8 h-8 text-orange-400" />,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
  },
  disgust: {
    label: "Khó chịu, Chán ghét",
    icon: <Frown className="w-8 h-8 text-green-600" />,
    color: "text-green-600",
    bg: "bg-green-600/10 border-green-600/20",
  },
  other: {
    label: "Thư giãn, Khác",
    icon: <Coffee className="w-8 h-8 text-gray-400" />,
    color: "text-gray-400",
    bg: "bg-gray-400/10 border-gray-400/20",
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

    try {
      const response = await recommendAPI.mood({ text: statusText });

      const moodKey = response.detected_mood
        ? response.detected_mood.toLowerCase()
        : "other";
      const uiConfig = MOOD_UI_MAP[moodKey] || MOOD_UI_MAP.other;

      setResult({
        ...uiConfig,
        songs: response.songs || [],
        confidence: response.confidence,
      });
      toast.success("Đã phân tích xong cảm xúc của bạn!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể phân tích cảm xúc lúc này. Thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 lg:p-10 overflow-y-auto scrollbar-hide">
      <div className="max-w-6xl w-full mx-auto space-y-10 mt-8">
        {/* Header section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Âm nhạc theo cảm xúc
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Công nghệ thông minh của chúng tôi sẽ thấu hiểu tâm trạng của bạn
            qua từng câu chữ và đưa ra những giai điệu đồng điệu nhất.
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
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  Danh sách gợi ý theo cảm xúc "{result.label}"
                </h4>
                <span className="text-sm font-medium text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                  {Math.min(result.songs.length, 10)} bài hát
                </span>
              </div>
              {result.songs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {result.songs.slice(0, 10).map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Không tìm thấy bài hát phù hợp với cảm xúc này.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
