import React, { useState, useEffect } from "react";
import {
  Users,
  Music,
  Disc,
  ListMusic,
  Play,
  Activity,
  Smile,
  Loader2,
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
import { adminAPI } from "../../services/api";

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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.stats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        {
          title: "Người dùng",
          value: stats.total_users?.toLocaleString() || "0",
          icon: <Users className="w-6 h-6" />,
          trend: "",
          trendSuffix: "tổng cộng",
          trendUp: true,
          colorClass: "text-blue-500",
          bgClass: "bg-blue-500/10",
        },
        {
          title: "Bài hát",
          value: stats.total_songs?.toLocaleString() || "0",
          icon: <Music className="w-6 h-6" />,
          trend: "",
          trendSuffix: "tổng cộng",
          trendUp: true,
          colorClass: "text-green-500",
          bgClass: "bg-green-500/10",
        },
        {
          title: "Thể loại",
          value: stats.total_genres?.toLocaleString() || "0",
          icon: <Disc className="w-6 h-6" />,
          trend: "",
          trendSuffix: "thể loại",
          trendUp: true,
          colorClass: "text-purple-500",
          bgClass: "bg-purple-500/10",
        },
        {
          title: "Playlists",
          value: stats.total_playlists?.toLocaleString() || "0",
          icon: <ListMusic className="w-6 h-6" />,
          trend: "",
          trendSuffix: "tổng cộng",
          trendUp: true,
          colorClass: "text-yellow-500",
          bgClass: "bg-yellow-500/10",
        },
        {
          title: "Cảm xúc",
          value: stats.total_moods?.toLocaleString() || "0",
          icon: <Smile className="w-6 h-6" />,
          trend: "",
          trendSuffix: "nhãn cảm xúc",
          trendUp: true,
          colorClass: "text-orange-500",
          bgClass: "bg-orange-500/10",
        },
        {
          title: "Tương tác",
          value: stats.total_interactions?.toLocaleString() || "0",
          icon: <Activity className="w-6 h-6" />,
          trend: "",
          trendSuffix: "lượt tương tác",
          trendUp: true,
          colorClass: "text-red-500",
          bgClass: "bg-red-500/10",
        },
      ]
    : [];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Tổng quan hệ thống
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Chào mừng Admin! Dưới đây là hoạt động của Moodify.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          <span className="ml-3 text-gray-400">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      )}

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Activity Chart */}
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

        {/* Right Col: Quick Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Thông tin nhanh</h2>
          <div className="space-y-4">
            {stats && (
              <>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 text-sm">Người dùng</span>
                  </div>
                  <span className="text-white font-bold">
                    {stats.total_users?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300 text-sm">Bài hát</span>
                  </div>
                  <span className="text-white font-bold">
                    {stats.total_songs?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-red-400" />
                    <span className="text-gray-300 text-sm">Tương tác</span>
                  </div>
                  <span className="text-white font-bold">
                    {stats.total_interactions?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ListMusic className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300 text-sm">Playlists</span>
                  </div>
                  <span className="text-white font-bold">
                    {stats.total_playlists?.toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
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
