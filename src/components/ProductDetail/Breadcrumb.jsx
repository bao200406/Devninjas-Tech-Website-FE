export default function Breadcrumb() {
  return (
    <nav className="text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
      <span className="hover:text-gray-600 cursor-pointer transition-colors">Trang chủ</span>
      <span className="text-gray-300">›</span>
      <span className="hover:text-gray-600 cursor-pointer transition-colors">Điện thoại</span>
      <span className="text-gray-300">›</span>
      <span className="hover:text-gray-600 cursor-pointer transition-colors">iPhone</span>
      <span className="text-gray-300">›</span>
      <span className="text-gray-900 font-bold">iPhone 15 Pro Max</span>
    </nav>
  );
}