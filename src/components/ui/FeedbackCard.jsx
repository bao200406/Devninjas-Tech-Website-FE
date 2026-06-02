import { Star } from "lucide-react";

export default function FeedbackCard({ quote, name, role, initials, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* 5 Ngôi sao */}
      <div className="flex gap-0.5 mb-4 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
      
      {/* Nội dung trích dẫn */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
        "{quote}"
      </p>
      
      {/* Thông tin khách hàng */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center font-bold text-blue-900 text-xs`}>
          {initials}
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">{name}</h4>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">{role}</p>
        </div>
      </div>
    </div>
  );
}