import React from "react";
import {
  Users,
  Music,
  Disc,
  ListMusic,
  Plus,
  Play,
  Activity,
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { ResponsiveBar } from "@nivo/bar";

const STATS = [
  {
    title: "Người dùng",
    value: "1,245",
    icon: <Users className="w-6 h-6" />,
    trend: "12%",
    trendSuffix: "so với tháng trước",
    trendUp: true,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
  },
  {
    title: "Bài hát",
    value: "8,942",
    icon: <Music className="w-6 h-6" />,
    trend: "5%",
    trendSuffix: "so với tuần trước",
    trendUp: true,
    colorClass: "text-green-500",
    bgClass: "bg-green-500/10",
  },
  {
    title: "Thể loại",
    value: "42",
    icon: <Disc className="w-6 h-6" />,
    trend: "2",
    trendSuffix: "thể loại mới",
    trendUp: true,
    colorClass: "text-purple-500",
    bgClass: "bg-purple-500/10",
  },
  {
    title: "Playlists",
    value: "3,421",
    icon: <ListMusic className="w-6 h-6" />,
    trend: "1%",
    trendSuffix: "so với hôm qua",
    trendUp: false,
    colorClass: "text-yellow-500",
    bgClass: "bg-yellow-500/10",
  },
];

const RECENT_SONGS = [
  {
    id: 1,
    title: "Ngày Mai Người Ta Lấy Chồng",
    artist: "Thành Đạt",
    plays: "124,500",
    cover: "https://i.ytimg.com/vi/u6Y96g_yjnQ/maxresdefault.jpg",
  },
  {
    id: 2,
    title: "Lửng Lơ",
    artist: "B-Ray",
    plays: "98,200",
    cover:
      "https://image-cdn.nct.vn/song/share/2022/02/20/5/f/b/1/1645341333426.jpg",
  },
  {
    id: 3,
    title: "Nấu Ăn Cho Em",
    artist: "Đen Vâu",
    plays: "210,400",
    cover:
      "https://photo-resize-zmp3.zmdcdn.me/w600_r300x169_jpeg/thumb_video/9/9/e/e/99ee33f170ea4841485d21ec3f76321f.jpg",
  },
  {
    id: 4,
    title: "Chắc Ai Đó Sẽ Về",
    artist: "Sơn Tùng M-TP",
    plays: "450,123",
    cover: "https://i1.sndcdn.com/artworks-000179966454-gtqf9y-t500x500.jpg",
  },
];

const MOCK_AREA_DATA = [
  { name: "T2", listen: 4000 },
  { name: "T3", listen: 3000 },
  { name: "T4", listen: 5000 },
  { name: "T5", listen: 2780 },
  { name: "T6", listen: 1890 },
  { name: "T7", listen: 2390 },
  { name: "CN", listen: 3490 },
];

const MOCK_BAR_DATA = [
  { genre: "Pop", plays: 120 },
  { genre: "Rap", plays: 98 },
  { genre: "Ballad", plays: 86 },
  { genre: "R&B", plays: 52 },
  { genre: "Indie", plays: 45 },
  { genre: "EDM", plays: 30 },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Tổng quan hệ thống
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Chào mừng Admin! Dưới đây là hoạt động hôm nay của Moodify.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Activity Chart Placeholder */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Lượt nghe trong 7 ngày gần nhất
            </h2>
            <div className="relative">
              <select className="bg-black border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2 pr-8 outline-none appearance-none cursor-pointer">
                <option>Tuần này</option>
                <option>Tháng này</option>
                <option>Năm nay</option>
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
          <div className="w-full h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={MOCK_AREA_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorListen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#ef4444" }}
                />
                <Area
                  type="monotone"
                  dataKey="listen"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorListen)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Recent Uploads */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Top thịnh hành</h2>
          <div className="space-y-4">
            {RECENT_SONGS.map((song, i) => (
              <div
                key={song.id}
                className="flex items-center gap-4 hover:bg-gray-800/50 p-2 -mx-2 rounded-lg transition-colors cursor-default group"
              >
                <div className="w-10 text-center font-bold text-gray-500 group-hover:text-white transition-colors">
                  0{i + 1}
                </div>
                <div className="relative w-10 h-10 bg-gray-800 rounded flex flex-shrink-0 items-center justify-center overflow-hidden">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play
                      className="w-4 h-4 text-white hover:text-green-400 translate-x-0.5"
                      fill="currentColor"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate">
                    {song.title}
                  </h4>
                  <p className="text-gray-400 text-xs truncate">
                    {song.artist}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-gray-300 text-sm font-semibold">
                    {song.plays}
                  </p>
                  <p className="text-gray-500 text-xs">lượt nghe</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 rounded-lg border border-gray-700 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            Xem tất cả
          </button>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">
          Độ phổ biến của thể loại âm nhạc
        </h2>
        <div className="h-[350px] w-full">
          <ResponsiveBar
            data={MOCK_BAR_DATA}
            keys={["plays"]}
            indexBy="genre"
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={["#8b5cf6"]}
            theme={{
              axis: {
                ticks: {
                  text: { fill: "#9ca3af" },
                },
                legend: {
                  text: { fill: "#9ca3af", fontSize: 13, fontWeight: 500 },
                },
              },
              grid: {
                line: { stroke: "#374151", strokeWidth: 1 },
              },
              tooltip: {
                container: {
                  background: "#111827",
                  color: "#fff",
                  fontSize: "12px",
                  borderRadius: "8px",
                },
              },
            }}
            borderRadius={4}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Thể loại",
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Lượt nghe (nghìn)",
              legendPosition: "middle",
              legendOffset: -45,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#ffffff"
            role="application"
            ariaLabel="Biểu đồ thể loại phổ biến"
            barAriaLabel={(e) =>
              `${e.id}: ${e.formattedValue} lượt nghe cho thể loại ${e.indexValue}`
            }
          />
        </div>
      </div>
    </div>
  );
}
