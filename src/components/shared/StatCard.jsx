import React from "react";

export default function StatCard({
  title,
  value,
  trend,
  isTrendUp,
  icon: Icon,
  colorClass, 
}) {
  // Bảng cấu hình màu sắc để bạn không phải viết thủ công class SVG
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5",
    emerald:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
    orange:
      "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-500/5",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5",
  };

  return (
    <div className="bg-gray-900/40 border border-white/5 p-5 rounded-2xl flex justify-between items-start hover:bg-gray-900/60 transition-all duration-300 group">
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 font-bold mb-2 group-hover:text-gray-400 transition-colors">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-black text-white tracking-tight">
            {value}
          </h2>
          {trend && (
            <span
              className={`text-[10px] font-bold ${isTrendUp ? "text-emerald-500" : "text-rose-500"}`}
            >
              {isTrendUp ? "↑" : "↓"} {trend}
            </span>
          )}
        </div>
      </div>

      {/* Khối Icon đã được tối ưu */}
      <div
        className={`p-3 rounded-xl border transition-all duration-500 group-hover:scale-110 shadow-lg ${colorMap[colorClass]}`}
      >
        {Icon && <Icon size={24} strokeWidth={2} />}
      </div>
    </div>
  );
}
