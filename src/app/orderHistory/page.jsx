'use client';
import { User, MapPin, Settings, Heart, LogOut, Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getOrderByUser } from "../../services/orderService";
import OrderCard from "../../components/ui/OrderCard";
import Pagination from "../../components/ui/Pagination"; // Import component bạn đã tạo
import Sidebar from "../../components/account/Sidebar"; // Import component bạn đã tạo
import Link from 'next/link';

const TABS = [
  { label: "TẤT CẢ", value: "all" },
  { label: "CHỜ XÁC NHẬN", value: "pending" },
  { label: "ĐANG XỬ LÝ", value: "processing" },
  { label: "ĐANG GIAO", value: "shipping" },
  { label: "ĐÃ GIAO", value: "delivered" },
  { label: "ĐÃ HỦY", value: "cancelled" },
];



export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  // State cho phân trang
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Hàm load dữ liệu từ API
  const loadOrders = async (page, status) => {
    setLoading(true);
    try {
      const statusQuery = status === "all" ? "" : status;
      const res = await getOrderByUser({ page, limit: 3, status: statusQuery });
      setOrders(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API khi tab hoặc trang thay đổi
  useEffect(() => {
    if (user) {
      loadOrders(pagination.page, activeTab);
    }
  }, [user, activeTab, pagination.page]);

  // Reset trang về 1 khi đổi tab
  const handleTabChange = (value) => {
    setActiveTab(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (authLoading || loading && orders.length === 0) return <div className="p-8">Đang tải dữ liệu...</div>;
  if (!user) return <div className="p-8">Bạn cần đăng nhập để xem đơn hàng.</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 p-8 gap-8 font-sans">
      {/* Sidebar giữ nguyên */}
      <Sidebar user={user}/>

      {/* Main Content */}
      <main className="flex-1">
        <h2 className="text-3xl font-bold mb-2">Lịch sử đơn hàng</h2>
        <p className="text-gray-500 mb-6">Theo dõi toàn bộ đơn hàng của bạn</p>

        {/* Tabs Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button 
              key={tab.value} 
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                activeTab === tab.value 
                ? "bg-blue-900 text-white shadow-lg" 
                : "bg-white text-gray-500 shadow-sm hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Danh sách đơn hàng */}
        <div className="space-y-6">
          {orders.length > 0 ? (
            <>
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
              
              {/* Thêm Component Pagination ở đây */}
              <Pagination 
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
              />
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Chưa có đơn hàng nào ở trạng thái này.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}