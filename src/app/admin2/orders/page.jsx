"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  ArrowUpDown,
  Wallet,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

import OrderDetailModal from "../../../components/orders/OrderDetailModal";
import CancelOrderModal from "../../../components/modals/CancelOrderModal";
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../../../services/orderService";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Thêm state phục vụ cho modal hủy đơn hàng
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const STATUS_FLOW = {
    pending: ["processing", "cancelled"],
    processing: ["shipping", "cancelled"],
    shipping: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  // Hàm fetch dữ liệu từ API
  const fetchOrders = async (
    page = 1,
    status = "",
    searchTerm = ""
  ) => {
    setLoading(true);

    try {
      const params = {
        page,
        limit: 10,
        status: status === "All" ? "" : status,
        search: searchTerm,
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
  }, [search, activeTab]);

  console.log("Data orders", orders);

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    // Kiểm tra nếu newStatus trống hoặc undefined
    if (!newStatus) {
      console.error(
        "Lỗi: newStatus bị thiếu hoặc undefined"
      );
      return;
    }

    // Nếu chuyển sang trạng thái cancelled thì mở Modal chọn lý do
    if (newStatus === "cancelled") {
      setOrderToCancel(orderId);
      setCancelModalOpen(true);
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn chuyển đơn hàng sang ${getStatusLabel(
          newStatus
        )}?`
      )
    ) {
      return;
    }

    // Xử lý các trạng thái bình thường khác
    executeStatusUpdate(orderId, newStatus, "");
  };

  // Hàm thực thi gọi API cập nhật trạng thái
  const executeStatusUpdate = async (
    orderId,
    newStatus,
    cancellationReason
  ) => {
    try {
      await updateOrderStatusAdmin(orderId, {
        status: newStatus,
        cancellation_reason: cancellationReason,
      });

      alert("Cập nhật trạng thái thành công!");
      setCancelModalOpen(false);

      // Tải lại dữ liệu
      fetchOrders(
        pagination.page,
        activeTab,
        search
      );
    } catch (error) {
      console.error("Chi tiết lỗi:", error);

      const msg =
        error.response?.data?.message ||
        "Cập nhật thất bại!";

      alert(msg);
    }
  };

  // Chuyển trạng thái sang tiếng Việt chỉ để hiển thị
  // Không thay đổi giá trị status thực tế gửi lên API
  const getStatusLabel = (status) => {
    const labels = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipping: "Đang giao hàng",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy",
    };

    return labels[status] || status;
  };

  // Chuyển trạng thái thanh toán sang tiếng Việt chỉ để hiển thị
  const getPaymentStatusLabel = (status) => {
    const labels = {
      paid: "Đã thanh toán",
      unpaid: "Chưa thanh toán",
      pending: "Đang chờ thanh toán",
      failed: "Thanh toán thất bại",
      refunded: "Đã hoàn tiền",
    };

    return labels[status] || status || "Chưa thanh toán";
  };

  // Chuyển phương thức thanh toán sang tiếng Việt chỉ để hiển thị
  const getPaymentMethodLabel = (method) => {
    if (!method) return "COD";

    const labels = {
      stripe: "Stripe",
      cod: "COD",
      momo: "MoMo",
      vnpay: "VNPay",
      bank: "Chuyển khoản",
      banking: "Chuyển khoản",
    };

    return labels[method.toLowerCase()] || method;
  };

  return (
    <div className="space-y-6">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <nav className="text-xs text-slate-400 flex items-center gap-2 mb-1">

            <span>
              Bảng điều khiển
            </span>

            <span className="text-[10px]">
              /
            </span>

            <span className="text-slate-600 font-medium">
              Đơn hàng
            </span>

          </nav>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Đơn hàng
          </h1>

          <p className="text-slate-500 text-sm">
            Quản lý và theo dõi các đơn hàng của khách hàng.
          </p>

        </div>

        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">

          <Plus size={18} />

          Đơn hàng mới

        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {[
          {
            label: "Tổng doanh thu",
            value: "12.450.000 ₫",
            icon: TrendingUp,
            color: "text-emerald-600",
          },
          {
            label: "Đơn hàng chờ xử lý",
            value: pagination.total || 0,
            icon: AlertCircle,
            color: "text-amber-600",
          },
          {
            label: "Đang xử lý",
            value: "8",
            icon: Package,
            color: "text-blue-600",
          },
          {
            label: "Thanh toán COD",
            value: "24",
            icon: Wallet,
            color: "text-purple-600",
          },
        ].map((stat, i) => (

          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
          >

            <div
              className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}
            >
              <stat.icon size={20} />
            </div>

            <div>

              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {stat.label}
              </p>

              <p className="text-xl font-bold text-slate-900">
                {stat.value}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/50">

        {[
          {
            value: "All",
            label: "Tất cả",
          },
          {
            value: "Pending",
            label: "Chờ xử lý",
          },
          {
            value: "Processing",
            label: "Đang xử lý",
          },
          {
            value: "Completed",
            label: "Hoàn thành",
          },
          {
            value: "Cancelled",
            label: "Đã hủy",
          },
        ].map((tab) => (

          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            }`}
          >
            {tab.label}
          </button>

        ))}

      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center">

          <div className="relative flex-1 w-full lg:max-w-xs">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />

            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />

          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">

            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">

              <Filter size={16} />

              Bộ lọc

            </button>

            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">

              <Download size={16} />

              Xuất dữ liệu

            </button>

          </div>

        </div>

        {loading ? (

          <div className="p-20 text-center text-slate-500">
            Đang tải dữ liệu...
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="text-center">

                <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">

                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 accent-slate-900"
                    />
                  </th>

                  <th className="px-4 py-4">

                    Mã đơn hàng

                    <ArrowUpDown
                      size={12}
                      className="inline ml-1 opacity-50"
                    />

                  </th>

                  <th className="px-4 py-4">
                    Khách hàng
                  </th>

                  <th className="px-4 py-4">
                    Thanh toán
                  </th>

                  <th className="px-4 py-4">
                    Ngày đặt
                  </th>

                  <th className="px-4 py-4">
                    Tổng tiền
                  </th>

                  <th className="px-4 py-4">
                    Trạng thái thanh toán
                  </th>

                  <th className="px-4 py-4">
                    Trạng thái đơn hàng
                  </th>

                  <th className="px-4 py-4">
                    Thao tác
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-50 text-center">

                {orders.map((order) => (

                  <tr
                    key={order._id}
                    className="hover:bg-slate-50/50 group"
                  >

                    <td className="px-6 py-5">

                      <input
                        type="checkbox"
                        className="rounded border-slate-300 accent-slate-900"
                      />

                    </td>

                    <td
                      className="px-4 py-5 text-sm font-bold text-slate-900 cursor-pointer"
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                    >
                      {order.orderCode}
                    </td>

                    <td className="px-4 py-5 text-sm text-slate-600">

                      {order.receiverName || "Chưa có"}

                    </td>

                    <td className="px-4 py-5">

                      <span
                        className={`inline-flex items-center justify-center min-w-[70px] text-xs font-semibold px-3 py-1.5 rounded-lg border uppercase tracking-wide ${
                          order.paymentMethod?.toLowerCase() ===
                          "stripe"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >

                        {getPaymentMethodLabel(
                          order.paymentMethod
                        )}

                      </span>

                    </td>

                    <td className="px-4 py-5 text-sm text-slate-500">

                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("vi-VN")}

                    </td>

                    <td className="px-4 py-5 text-sm font-bold text-slate-900">

                      {Number(
                        order.totalPrice || 0
                      ).toLocaleString("vi-VN")} ₫

                    </td>

                    <td className="px-4 py-5">

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        }`}
                      >

                        {getPaymentStatusLabel(
                          order.paymentStatus
                        )}

                      </span>

                    </td>

                    <td className="px-4 py-5">

                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide cursor-pointer outline-none border-none ${
                          order.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "shipping"
                            ? "bg-cyan-100 text-cyan-700"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >

                        <option value={order.status}>
                          {getStatusLabel(order.status)}
                        </option>

                        {STATUS_FLOW[
                          order.status
                        ]?.map((nextStatus) => (

                          <option
                            key={nextStatus}
                            value={nextStatus}
                          >
                            {getStatusLabel(
                              nextStatus
                            )}
                          </option>

                        ))}

                      </select>

                    </td>

                    <td className="px-4 py-5">

                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl">

                        <MoreHorizontal
                          size={20}
                        />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">

          <span>
            Hiển thị {orders.length} trong tổng số{" "}
            {pagination.total} đơn hàng
          </span>

          <div className="flex gap-2">

            <button
              disabled={pagination.page === 1}
              onClick={() =>
                fetchOrders(
                  pagination.page - 1,
                  activeTab
                )
              }
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={
                pagination.page >=
                pagination.totalPages
              }
              onClick={() =>
                fetchOrders(
                  pagination.page + 1,
                  activeTab
                )
              }
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

      </div>

      <OrderDetailModal
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) =>
          !open && setSelectedOrder(null)
        }
      />

      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={() =>
          setCancelModalOpen(false)
        }
        onConfirm={(reason) =>
          executeStatusUpdate(
            orderToCancel,
            "cancelled",
            reason
          )
        }
      />

    </div>
  );
}