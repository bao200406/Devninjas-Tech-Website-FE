"use client";

import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  Eye,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  CreditCard,
  Box,
  MessageSquare,
  Calendar
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar
} from "recharts";

import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getChartData,
  getCategoryStats
} from "../../../services/dashboardService";

// Import DatePicker và CSS của nó
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Import format từ date-fns để gửi dữ liệu đúng định dạng cho Backend
import { format } from "date-fns";

const trafficData = [
  { name: "Direct", value: 35, color: "#F97316" },
  { name: "Organic", value: 28, color: "#10B981" },
  { name: "Referral", value: 22, color: "#3B82F6" },
  { name: "Social", value: 15, color: "#FBBF24" },
];

// Data mẫu cho hai mục mới
const recentOrders = [
  {
    id: "ORD-7891",
    customer: "Emma Wilson",
    email: "emma@example.com",
    product: "Pro Dashboard License",
    status: "Completed",
    amount: "299.000 ₫",
    initials: "EW",
    color: "bg-orange-500",
  },
  {
    id: "ORD-7890",
    customer: "James Chen",
    email: "james@company.io",
    product: "Team Plan Upgrade",
    status: "Processing",
    amount: "599.000 ₫",
    initials: "JC",
    color: "bg-emerald-500",
  },
  {
    id: "ORD-7889",
    customer: "Sofia Garcia",
    email: "sofia@startup.co",
    product: "Enterprise License",
    status: "Completed",
    amount: "1.499.000 ₫",
    initials: "SG",
    color: "bg-blue-500",
  },
  {
    id: "ORD-7888",
    customer: "Alex Thompson",
    email: "alex@dev.com",
    product: "Single License",
    status: "Pending",
    amount: "79.000 ₫",
    initials: "AT",
    color: "bg-amber-500",
  },
  {
    id: "ORD-7887",
    customer: "Maria Santos",
    email: "maria@agency.co",
    product: "Pro Dashboard License",
    status: "Completed",
    amount: "299.000 ₫",
    initials: "MS",
    color: "bg-orange-400",
  },
  {
    id: "ORD-7886",
    customer: "David Kim",
    email: "david@tech.io",
    product: "Team Plan Upgrade",
    status: "Cancelled",
    amount: "599.000 ₫",
    initials: "DK",
    color: "bg-rose-500",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "order",
    title: "New order placed",
    desc: "Emma Wilson purchased Pro Dashboard License",
    time: "2 min ago",
    icon: ShoppingBag,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    id: 2,
    type: "user",
    title: "New customer registered",
    desc: "James Chen created an account",
    time: "15 min ago",
    icon: Users,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    id: 3,
    type: "review",
    title: "5-star review received",
    desc: '"Amazing template, exactly what I needed!"',
    time: "1 hour ago",
    icon: Star,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    id: 4,
    type: "payment",
    title: "Payment received",
    desc: "1.499.000 ₫ from Sofia Garcia",
    time: "2 hours ago",
    icon: CreditCard,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 5,
    type: "support",
    title: "Support ticket resolved",
    desc: "Ticket #4521 marked as resolved",
    time: "3 hours ago",
    icon: MessageSquare,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
];

export default function Dashboard() {
  const [days, setDays] = useState("30");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryData, setCategoryData] = useState([]);

  // GIỮ NGUYÊN giá trị tiếng Anh để khớp với dữ liệu API
  const [activeTab, setActiveTab] = useState("Revenue");

  const [chartData, setChartData] = useState([]);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Chặn các trường hợp ngày tháng chưa sẵn sàng
    if (days === "custom" && (!startDate || !endDate)) return;

    // 2. Nếu days != "custom", ta nên tạo ngày mặc định hoặc xử lý riêng
    // Nếu vẫn gọi API khi chưa có startDate/endDate cho các mode "30", "7"...,
    // hãy chắc chắn service của bạn tự xử lý mặc định ở phía Backend.

    const fetchData = async () => {
      setLoading(true);

      try {
        // Đảm bảo startDate/endDate được format đúng định dạng trước khi gửi
        // Dùng optional chaining hoặc kiểm tra tồn tại
        const sDate = startDate
          ? new Date(startDate).toISOString()
          : null;

        const eDate = endDate
          ? new Date(endDate).toISOString()
          : null;

        const [statsResult, chartResult, categories] =
          await Promise.all([
            getDashboardStats(days, sDate, eDate),
            getChartData(days, sDate, eDate),
            getCategoryStats(days, sDate, eDate)
          ]);

        const colors = [
          "#F97316",
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#8B5CF6"
        ];

        const formattedCategoryData = (categories?.data || []).map(
          (item, index) => ({
            ...item,
            color: colors[index % colors.length]
          })
        );

        setCategoryData(formattedCategoryData);
        setStats(statsResult.data);
        setChartData(chartResult.data);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days, startDate, endDate]);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Bảng điều khiển
        </h1>

        <div className="flex justify-between items-center">
          <p className="text-slate-500 text-sm">
            Chào mừng bạn quay trở lại, Aigars...
          </p>

          {/* Bộ lọc thời gian */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">

            <Calendar
              size={16}
              className="text-slate-400"
            />

            <select
              className="text-sm font-bold text-slate-900 outline-none bg-transparent cursor-pointer"
              onChange={(e) => {
                const value = e.target.value;

                setDays(value);

                // Reset ngày nếu chuyển sang chế độ khác
                if (value !== "custom") {
                  setStartDate("");
                  setEndDate("");
                }
              }}
              value={days}
            >
              <option value="7">
                7 ngày qua
              </option>

              <option value="30">
                30 ngày qua
              </option>

              <option value="90">
                90 ngày qua
              </option>

              <option value="custom">
                Tùy chọn ngày
              </option>
            </select>

            {/* DatePicker */}
            {days === "custom" && (
              <div className="flex items-center gap-2 border-l pl-4 ml-2 border-slate-200">

                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Từ ngày"
                  dateFormat="dd/MM/yyyy"
                  className="w-24 text-sm font-bold text-slate-900 outline-none bg-transparent cursor-pointer"
                />

                <span className="text-slate-400">
                  -
                </span>

                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Đến ngày"
                  dateFormat="dd/MM/yyyy"
                  className="w-24 text-sm font-bold text-slate-900 outline-none bg-transparent cursor-pointer"
                />

              </div>
            )}

          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Tổng doanh thu"
          value={`${stats.totalRevenue.toLocaleString("vi-VN")} ₫`}
          trend="+12.5%"
          trendUp={true}
          icon={DollarSign}
          color="orange"
        />

        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          trend="-3.1%"
          trendUp={false}
          icon={ShoppingBag}
          color="blue"
        />

        <StatCard
          title="Tổng sản phẩm"
          value={stats.totalProducts}
          trend="+2.4%"
          trendUp={true}
          icon={Box}
          color="yellow"
        />

        <StatCard
          title="Tổng khách hàng"
          value={stats.totalCustomers}
          trend="+5.7%"
          trendUp={true}
          icon={Users}
          color="green"
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Main Revenue Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h3 className="font-bold text-slate-900">
                Tổng quan
              </h3>

              <p className="text-xs text-slate-400">
                Hiệu suất theo tháng trong năm hiện tại
              </p>
            </div>

            <div className="flex bg-slate-50 p-1 rounded-lg gap-1">

              {/* 
                QUAN TRỌNG:
                Không đổi Revenue / Orders / AOV thành tiếng Việt
                vì activeTab được dùng để lấy dataKey từ API.
              */}

              {[
                {
                  value: "Revenue",
                  label: "Doanh thu"
                },
                {
                  value: "Orders",
                  label: "Đơn hàng"
                },
                {
                  value: "AOV",
                  label: "Giá trị đơn trung bình"
                }
              ].map((tab) => (

                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    tab.value === activeTab
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {tab.label}
                </button>

              ))}

            </div>
          </div>

          <div className="h-[300px] w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={chartData}>

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#94a3b8"
                  }}
                  dy={10}
                />

                <YAxis hide />

                <Tooltip
                formatter={(value) => {
                  if (activeTab === "Revenue" || activeTab === "AOV") {
                    return [
                      `${Number(value).toLocaleString("vi-VN")} ₫`,
                      activeTab === "Revenue"
                        ? "Doanh thu"
                        : "Giá trị đơn trung bình"
                    ];
                  }

                  return [
                    Number(value).toLocaleString("vi-VN"),
                    "Đơn hàng"
                  ];
                }}
              />

                <Bar
                  /*
                    GIỮ NGUYÊN:
                    Revenue -> revenue
                    Orders -> orders
                    AOV -> aov

                    để lấy đúng dữ liệu từ API
                  */
                  dataKey={activeTab.toLowerCase()}

                  fill={
                    activeTab === "Revenue"
                      ? "#F97316"
                      : activeTab === "Orders"
                      ? "#3B82F6"
                      : "#10B981"
                  }

                  radius={[
                    4,
                    4,
                    0,
                    0
                  ]}

                  animationDuration={500}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">

          <h3 className="font-bold text-slate-900">
            Danh mục sản phẩm
          </h3>

          <p className="text-xs text-slate-400 mb-6">
            Phân bổ doanh số theo danh mục
          </p>

          <div className="relative h-[200px] flex items-center justify-center">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={4}
                >

                  {categoryData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    )
                  )}

                </Pie>

              </PieChart>

            </ResponsiveContainer>

            {/* Hiển thị tổng số lượng sản phẩm bán ra ở giữa */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

              <span className="text-2xl font-bold">
                {categoryData.reduce(
                  (sum, item) =>
                    sum + item.value,
                  0
                )}
              </span>

              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Sản phẩm đã bán
              </span>

            </div>
          </div>

          {/* Danh sách các danh mục */}
          <div className="mt-6 space-y-3">

            {categoryData.map((item) => (

              <div
                key={item.name}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-2">

                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        item.color
                    }}
                  />

                  <span className="text-sm font-medium text-slate-600">
                    {item.name}
                  </span>

                </div>

                <span className="text-sm font-bold text-slate-900">
                  {item.value}
                </span>

              </div>

            ))}

          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Orders & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="p-6 flex items-center justify-between border-b border-slate-50">

            <div>

              <h3 className="font-bold text-slate-900">
                Đơn hàng gần đây
              </h3>

              <p className="text-xs text-slate-400">
                Các giao dịch mới nhất từ cửa hàng của bạn
              </p>

            </div>

            <button className="flex items-center text-xs font-bold text-slate-900 hover:text-orange-500 transition-colors">
              Xem tất cả
              <ArrowUpRight
                size={14}
                className="ml-1"
              />
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">

                  <th className="px-6 py-4">
                    Khách hàng
                  </th>

                  <th className="px-6 py-4">
                    Mã đơn hàng
                  </th>

                  <th className="px-6 py-4">
                    Sản phẩm
                  </th>

                  <th className="px-6 py-4">
                    Trạng thái
                  </th>

                  <th className="px-6 py-4 text-right">
                    Số tiền
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-50">

                {recentOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className={`w-8 h-8 rounded-full ${order.color} flex items-center justify-center text-white text-[10px] font-bold`}
                        >
                          {order.initials}
                        </div>

                        <div>

                          <p className="text-sm font-bold text-slate-900">
                            {order.customer}
                          </p>

                          <p className="text-xs text-slate-400">
                            {order.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                      {order.id}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {order.product}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={order.status}
                      />
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {order.amount}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">

          <div className="p-6 flex items-center justify-between border-b border-slate-50">

            <h3 className="font-bold text-slate-900">
              Hoạt động gần đây
            </h3>

            <button className="text-xs font-bold text-slate-900 hover:text-orange-500 transition-colors">
              Xem tất cả
            </button>

          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">

            {recentActivity.map(
              (activity) => (

                <div
                  key={activity.id}
                  className="flex gap-4"
                >

                  <div
                    className={`w-10 h-10 rounded-xl ${activity.bgColor} flex-shrink-0 flex items-center justify-center`}
                  >

                    <activity.icon
                      className={
                        activity.iconColor
                      }
                      size={18}
                    />

                  </div>

                  <div className="flex flex-col">

                    <h4 className="text-sm font-bold text-slate-900">
                      {activity.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      {activity.desc}
                    </p>

                    <span className="text-[10px] font-medium text-slate-300 mt-2 uppercase tracking-wider">
                      {activity.time}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  color
}) {

  const colors = {
    orange:
      "text-orange-500 bg-orange-50",

    green:
      "text-emerald-500 bg-emerald-50",

    blue:
      "text-blue-500 bg-blue-50",

    yellow:
      "text-amber-500 bg-amber-50",
  };

  return (

    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">

      <div className="flex justify-between items-start mb-4">

        <div>

          <p className="text-slate-400 text-xs font-bold tracking-tight mb-1 uppercase">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-slate-900">
            {value}
          </h3>

        </div>

        <div
          className={`p-2 rounded-lg ${colors[color]}`}
        >
          <Icon size={20} />
        </div>

      </div>

      <div className="flex items-center gap-2">

        <div
          className={`flex items-center text-xs font-bold ${
            trendUp
              ? "text-emerald-500"
              : "text-rose-500"
          }`}
        >

          {trendUp ? (
            <TrendingUp
              size={14}
              className="mr-1"
            />
          ) : (
            <TrendingDown
              size={14}
              className="mr-1"
            />
          )}

          {trend}

        </div>

        <span className="text-slate-400 text-[10px]">
          so với tháng trước
        </span>

      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-20" />

    </div>

  );
}

function StatusBadge({ status }) {

  const styles = {
    Completed:
      "bg-emerald-500 text-white",

    Processing:
      "bg-slate-900 text-white",

    Pending:
      "bg-amber-500 text-white",

    Cancelled:
      "bg-rose-500 text-white",
  };

  const labels = {
    Completed: "Hoàn thành",
    Processing: "Đang xử lý",
    Pending: "Đang chờ",
    Cancelled: "Đã hủy",
  };

  return (

    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        styles[status]
      }`}
    >
      {labels[status] || status}
    </span>

  );
}