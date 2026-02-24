import React from "react";

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendSuffix,
  trendUp = true,
  colorClass = "text-green-500",
  bgClass = "bg-green-500/10",
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col hover:border-gray-700 transition-colors shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgClass}`}>
          <div className={colorClass}>{icon}</div>
        </div>
        <div className="flex flex-col items-end">
          <h3 className="text-gray-400 font-medium text-sm tracking-wide mb-1">
            {title}
          </h3>
          <h4 className="text-3xl font-bold text-white">{value}</h4>
        </div>
      </div>
      <div>
        {trend && (
          <div className="flex justify-between items-center w-full mt-2">
            <span className="text-sm font-medium text-gray-500">
              {trendSuffix}
            </span>
            <span
              className={`text-sm flex items-center gap-1 font-medium ${
                trendUp ? "text-green-400" : "text-red-400"
              }`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
