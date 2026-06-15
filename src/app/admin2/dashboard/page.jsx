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
  MessageSquare,
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
  BarChart, Bar
} from "recharts";

// Data mẫu cho Chart
const revenueData = [
  { month: "Jan", revenue: 5000 },
  { month: "Feb", revenue: 10000 },
  { month: "Mar", revenue: 7000 },
  { month: "Apr", revenue: 18000 },
  { month: "May", revenue: 22000 },
  { month: "Jun", revenue: 15000 },
  { month: "Jul", revenue: 25000 },
  { month: "Aug", revenue: 32000 },
  { month: "Sep", revenue: 28000 },
  { month: "Oct", revenue: 42000 },
  { month: "Nov", revenue: 48000 },
  { month: "Dec", revenue: 48295 },
];

const trafficData = [
  { name: "Direct", value: 35, color: "#F97316" },
  { name: "Organic", value: 28, color: "#10B981" },
  { name: "Referral", value: 22, color: "#3B82F6" },
  { name: "Social", value: 15, color: "#FBBF24" },
];

// 2. Data mẫu cho hai mục mới
const recentOrders = [
  {
    id: "ORD-7891",
    customer: "Emma Wilson",
    email: "emma@example.com",
    product: "Pro Dashboard License",
    status: "Completed",
    amount: "$299.00",
    initials: "EW",
    color: "bg-orange-500",
  },
  {
    id: "ORD-7890",
    customer: "James Chen",
    email: "james@company.io",
    product: "Team Plan Upgrade",
    status: "Processing",
    amount: "$599.00",
    initials: "JC",
    color: "bg-emerald-500",
  },
  {
    id: "ORD-7889",
    customer: "Sofia Garcia",
    email: "sofia@startup.co",
    product: "Enterprise License",
    status: "Completed",
    amount: "$1,499.00",
    initials: "SG",
    color: "bg-blue-500",
  },
  {
    id: "ORD-7888",
    customer: "Alex Thompson",
    email: "alex@dev.com",
    product: "Single License",
    status: "Pending",
    amount: "$79.00",
    initials: "AT",
    color: "bg-amber-500",
  },
  {
    id: "ORD-7887",
    customer: "Maria Santos",
    email: "maria@agency.co",
    product: "Pro Dashboard License",
    status: "Completed",
    amount: "$299.00",
    initials: "MS",
    color: "bg-orange-400",
  },
  {
    id: "ORD-7886",
    customer: "David Kim",
    email: "david@tech.io",
    product: "Team Plan Upgrade",
    status: "Cancelled",
    amount: "$599.00",
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
    desc: "$1,499 from Sofia Garcia",
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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl front-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm">
          Welcome back, Aigars. Here&apos;s what&apos;s happening with your
          business today.
        </p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$48,295"
          trend="+12.5%"
          trendUp={true}
          icon={DollarSign}
          color="orange"
        />
        <StatCard
          title="Active Users"
          value="2,847"
          trend="+8.2%"
          trendUp={true}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value="1,432"
          trend="-3.1%"
          trendUp={false}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Page Views"
          value="284K"
          trend="+24.7%"
          trendUp={true}
          icon={Eye}
          color="yellow"
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
       <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-slate-900">Overview</h3>
                <p className="text-xs text-slate-400">
                  Monthly performance for the current year
                </p>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-lg gap-1">
                {["Revenue", "Orders", "Profit"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      tab === "Revenue" ? "bg-white shadow-sm text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Bar
                    dataKey="revenue"
                    fill="#F97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900">Traffic Sources</h3>
          <p className="text-xs text-slate-400 mb-6">
            Where your visitors come from
          </p>

          <div className="relative h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">284K</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Visits
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {trafficData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-slate-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* // 4. Update trong phần return của function Dashboard() // Thêm đoạn này
      ngay sau Grid chứa Chart và Traffic Sources */}
      {/* Bottom Section: Recent Orders & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-50">
            <div>
              <h3 className="font-bold text-slate-900">Recent Orders</h3>
              <p className="text-xs text-slate-400">
                Latest transactions from your store
              </p>
            </div>
            <button className="flex items-center text-xs font-bold text-slate-900 hover:text-orange-500 transition-colors">
              View all <ArrowUpRight size={14} className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
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
                      <StatusBadge status={order.status} />
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
            <h3 className="font-bold text-slate-900">Recent Activity</h3>
            <button className="text-xs font-bold text-slate-900 hover:text-orange-500 transition-colors">
              View all
            </button>
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div
                  className={`w-10 h-10 rounded-xl ${activity.bgColor} flex-shrink-0 flex items-center justify-center`}
                >
                  <activity.icon className={activity.iconColor} size={18} />
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon: Icon, color }) {
  const colors = {
    orange: "text-orange-500 bg-orange-50",
    green: "text-emerald-500 bg-emerald-50",
    blue: "text-blue-500 bg-blue-50",
    yellow: "text-amber-500 bg-amber-50",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-xs font-bold tracking-tight mb-1 uppercase">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center text-xs font-bold ${trendUp ? "text-emerald-500" : "text-rose-500"}`}
        >
          {trendUp ? (
            <TrendingUp size={14} className="mr-1" />
          ) : (
            <TrendingDown size={14} className="mr-1" />
          )}
          {trend}
        </div>
        <span className="text-slate-400 text-[10px]">vs last month</span>
      </div>
      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-20" />
    </div>
  );
}

// 3. Component bổ sung (Thêm vào bên dưới cùng của file)
function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-emerald-500 text-white",
    Processing: "bg-slate-900 text-white",
    Pending: "bg-amber-500 text-white",
    Cancelled: "bg-rose-500 text-white",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}
