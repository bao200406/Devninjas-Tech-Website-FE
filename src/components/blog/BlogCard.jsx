export default function BlogCard({ category, date, title, description, image }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Hình ảnh */}
      <div className="h-48 w-full bg-gray-200 overflow-hidden">
        <div className="w-full h-full bg-gray-300" /> {/* Placeholder ảnh */}
      </div>
      
      {/* Nội dung */}
      <div className="p-5">
        <span className="inline-block bg-blue-900 text-white text-[10px] font-bold px-2 py-1 rounded mb-3">
          {category}
        </span>
        <p className="text-gray-400 text-xs mb-2">{date}</p>
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 hover:text-blue-700 cursor-pointer">
          {title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}