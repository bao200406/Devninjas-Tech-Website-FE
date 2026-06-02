import { Smartphone, Laptop, Cable, Headphones, Gamepad2, Watch, Tablet, Camera } from "lucide-react";

const categories = [
  { name: "ĐIỆN THOẠI", icon: Smartphone, color: "bg-blue-50 text-blue-600" },
  { name: "LAPTOP", icon: Laptop, color: "bg-orange-50 text-orange-600" },
  { name: "PHỤ KIỆN", icon: Cable, color: "bg-green-50 text-green-600" },
  { name: "AUDIO", icon: Headphones, color: "bg-purple-50 text-purple-600" },
  { name: "GAMING", icon: Gamepad2, color: "bg-red-50 text-red-600" },
  { name: "ĐỒNG HỒ", icon: Watch, color: "bg-cyan-50 text-cyan-600" },
  { name: "TABLET", icon: Tablet, color: "bg-indigo-50 text-indigo-600" },
  { name: "CAMERA", icon: Camera, color: "bg-yellow-50 text-yellow-600" },
];

export default function CategoryBar() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.name}
              className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                <cat.icon size={24} />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-gray-700 tracking-wider">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}