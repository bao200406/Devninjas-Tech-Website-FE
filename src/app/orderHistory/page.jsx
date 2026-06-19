'use client';
import { User, MapPin, Clock, Lock, Heart, Bell, LogOut, Package, Eye, Truck, RotateCcw, Star, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getOrderByUser } from "../../services/orderService"; // Đảm bảo đường dẫn đúng
import OrderCard from "../../components/ui/OrderCard";
import Link from 'next/link';

export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy đơn hàng thật
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          const res = await getOrderByUser({ page: 1, limit: 10 });
          setOrders(res.data);
        } catch (err) {
          console.error("Lỗi khi tải đơn hàng:", err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [user]);

  if (authLoading || loading) return <div className="p-8">Đang tải dữ liệu...</div>;
  if (!user) return <div className="p-8">Bạn cần đăng nhập để xem đơn hàng.</div>;

  console.log("Đơn hàng của người dùng:", orders); // Debug: Kiểm tra dữ liệu đơn hàng

  return (
    <div className="flex min-h-screen bg-gray-50 p-8 gap-8 font-sans">
      {/* Sidebar - Giữ nguyên cấu trúc */}
      <aside className="w-64 bg-white p-6 rounded-2xl shadow-sm h-fit">
        <h1 className="text-xl font-bold text-blue-900 mb-8 flex items-center gap-2"><Package className="fill-blue-900"/> Azure Logic</h1>
        
        <div className="flex items-center gap-4 mb-8 p-3 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-gray-800 truncate">{user.name}</p>
            <p className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold inline-block">
              {user.role || "Member"}
            </p>
          </div>
        </div>

        <nav className="space-y-2 text-gray-500 text-sm">
          {[
            { icon: User, label: "Personal Info", href: "/account" },
            { icon: MapPin, label: "Addresses", href: "/addresses" },
            { icon: Package, label: "Order History", active: true, href: "/orders" },
            { icon: Settings, label: "Change Password", href: "/settings" },
            { icon: Heart, label: "Wishlist", href: "/wishlist" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'hover:bg-gray-50 text-gray-600'}`}>
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <button className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content - Giữ nguyên cấu trúc */}
      <main className="flex-1">
        <h2 className="text-3xl font-bold mb-2">Lịch sử đơn hàng</h2>
        <p className="text-gray-500 mb-6">Theo dõi toàn bộ đơn hàng của bạn</p>

        <div className="flex gap-4 mb-8">
          {["TẤT CẢ", "CHỜ XÁC NHẬN", "ĐANG XỬ LÝ", "ĐANG GIAO", "ĐÃ GIAO", "ĐÃ HỦY"].map((tab, i) => (
            <button key={i} className={`px-4 py-2 rounded-lg text-xs font-bold ${tab === "TẤT CẢ" ? "bg-blue-900 text-white" : "bg-white text-gray-500 shadow-sm"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
            {orders.length > 0 ? (
            orders.map((order) => (
                <OrderCard key={order._id} order={order} />
            ))
            ) : (
            <p>Chưa có đơn hàng nào.</p>
            )}
        </div>
      </main>
    </div>
  );
}