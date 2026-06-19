const statusConfig = {
  "ĐANG GIAO": { bg: "bg-blue-50", text: "text-blue-700", icon: "🚚" },
  "ĐÃ GIAO": { bg: "bg-green-50", text: "text-green-700", icon: "✅" },
  "ĐÃ HỦY": { bg: "bg-red-50", text: "text-red-700", icon: "❌" },
  "CHỜ XÁC NHẬN": { bg: "bg-amber-50", text: "text-amber-700", icon: "⏳" },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { bg: "bg-gray-50", text: "text-gray-700", icon: "📦" };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${config.bg} ${config.text}`}>
      {config.icon} {status}
    </span>
  );
};