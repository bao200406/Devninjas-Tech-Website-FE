import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { getFeaturedCategories } from "../../services/categoryService";

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFeaturedCategories();
      // Chúng ta sẽ gán icon và color vào dữ liệu từ API
      // Giữ lại logic màu sắc dựa trên tên như cũ
      const formattedData = data.map((cat) => ({
        ...cat,
        // Dùng hàm lấy icon từ chuỗi string trong DB
        icon: LucideIcons[cat.icon] || LucideIcons.HelpCircle,
        // Giữ nguyên logic màu sắc của bạn
        color: getColorByName(cat.name),
      }));
      setCategories(formattedData);
    };
    fetchData();
  }, []);

  // Hàm hỗ trợ giữ nguyên màu sắc cũ của bạn
  const getColorByName = (name) => {
    const colorMap = {
      "ĐIỆN THOẠI": "bg-blue-50 text-blue-600",
      "LAPTOP": "bg-orange-50 text-orange-600",
      "PHỤ KIỆN": "bg-green-50 text-green-600",
      "AUDIO": "bg-purple-50 text-purple-600",
      "GAMING": "bg-red-50 text-red-600",
      "ĐỒNG HỒ": "bg-cyan-50 text-cyan-600",
      "TABLET": "bg-indigo-50 text-indigo-600",
      "CAMERA": "bg-yellow-50 text-yellow-600",
    };
    return colorMap[name] || "bg-gray-50 text-gray-600";
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <a 
              href={`/products/category/${cat.slug}`}
              key={cat._id}
              className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                <cat.icon size={24} />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-gray-700 tracking-wider">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}