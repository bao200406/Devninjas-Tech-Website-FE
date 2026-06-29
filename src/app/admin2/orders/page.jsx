"use client";
import { useEffect, useState } from "react";
import {
  Plus, Search, Filter, Download, MoreHorizontal, ChevronLeft, ChevronRight,
  Package, ArrowUpDown, Wallet, AlertCircle, TrendingUp,
} from "lucide-react";
import { getAllOrdersAdmin , updateOrderStatusAdmin } from "../../../services/orderService"; 

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

 // Hàm fetch dữ liệu từ API
  const fetchOrders = async (page = 1, status = "", searchTerm = "") => {
    setLoading(true);
    try {
      const params = { 
        page, 
        limit: 10, 
        status: status === "All" ? "" : status,
        search: searchTerm // Truyền thêm tham số search vào API
      };

      // LOG ĐỂ KIỂM TRA
    console.log("Params gửi lên API:", params);
      const res = await getAllOrdersAdmin(params);
      
      setOrders(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Dùng useEffect để lắng nghe thay đổi của 'search'
    useEffect(() => {
      // Debounce: Đợi 500ms sau khi người dùng dừng gõ mới gọi API
      const delayDebounceFn = setTimeout(() => {
        fetchOrders(1, activeTab, search);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }, [search, activeTab]); // Gọi lại khi từ khóa tìm kiếm hoặc tab thay đổi

    console.log("Data orders", orders)

    const handleStatusChange = async (orderId, newStatus) => {
      // Kiểm tra nếu newStatus trống hoặc undefined
      if (!newStatus) {
        console.error("Lỗi: newStatus bị thiếu hoặc undefined");
        return;
      }

      if (!window.confirm(`Bạn có chắc chắn muốn chuyển đơn hàng sang ${newStatus.toUpperCase()}?`)) {
        return;
      }

      try {
        // Gọi API với đúng cấu trúc { status: newStatus }
        await updateOrderStatusAdmin(orderId, { status: newStatus });
        
        alert("Cập nhật trạng thái thành công!");
        
        // Tải lại dữ liệu
        fetchOrders(pagination.page, activeTab, search);
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
        const msg = error.response?.data?.message || "Cập nhật thất bại!";
        alert(msg);
      }
    };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-400 flex items-center gap-2 mb-1">
            <span>Dashboard</span>
            <span className="text-[10px]">/</span>
            <span className="text-slate-600 font-medium">Orders</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 text-sm">Manage and track your customer orders.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
          <Plus size={18} /> New Order
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$12,450", icon: TrendingUp, color: "text-emerald-600" },
          { label: "Pending Orders", value: pagination.total || 0, icon: AlertCircle, color: "text-amber-600" },
          { label: "In Progress", value: "8", icon: Package, color: "text-blue-600" },
          { label: "COD Payments", value: "24", icon: Wallet, color: "text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/50">
        {["All", "Pending", "Processing", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)} // Thay đổi state search liên tục
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" 
            />
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"><Filter size={16} /> Filters</button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"><Download size={16} /> Export</button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-500">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-slate-300 accent-slate-900" /></th>
                  <th className="px-4 py-4">Order ID <ArrowUpDown size={12} className="inline ml-1 opacity-50" /></th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Payment</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Total</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 group">
                    <td className="px-6 py-5"><input type="checkbox" className="rounded border-slate-300 accent-slate-900" /></td>
                    <td className="px-4 py-5 text-sm font-bold text-slate-900">{order.orderCode}</td>
                    <td className="px-4 py-5 text-sm text-slate-600">{order.receiverName || "N/A"}</td>
                    <td className="px-4 py-5">
                    <span className={`inline-flex items-center justify-center min-w-[70px] text-xs font-semibold px-3 py-1.5 rounded-lg border uppercase tracking-wide ${
                        order.paymentMethod?.toLowerCase() === "stripe" 
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                        {order.paymentMethod || "COD"}
                    </span>
                    </td>
                    <td className="px-4 py-5 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-5 text-sm font-bold text-slate-900">${order.totalPrice}</td>
                    <td className="px-4 py-5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide cursor-pointer outline-none border-none ${
                          order.status === "pending" ? "bg-amber-100 text-amber-700" :
                          order.status === "paid" ? "bg-emerald-100 text-emerald-700" :
                          order.status === "processing" ? "bg-blue-100 text-blue-700" :
                          order.status === "shipping" ? "bg-cyan-100 text-cyan-700" :
                          order.status === "delivered" ? "bg-green-100 text-green-800" :
                          "bg-rose-100 text-rose-700"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-5 text-right pr-8"><button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"><MoreHorizontal size={20} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
           <span>Showing {orders.length} of {pagination.total} orders</span>
           <div className="flex gap-2">
             <button 
              disabled={pagination.page === 1}
              onClick={() => fetchOrders(pagination.page - 1, activeTab)}
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-50"
             >
               <ChevronLeft size={16} />
             </button>
             <button 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchOrders(pagination.page + 1, activeTab)}
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-50"
             >
               <ChevronRight size={16} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}