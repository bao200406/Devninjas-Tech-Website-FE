"use client";
import React from "react";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  MousePointer2,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

// --- Data giả định ---
const salesOverviewData = [
  { day: "1", revenue: 3200 },
  { day: "5", revenue: 4500 },
  { day: "10", revenue: 3800 },
  { day: "15", revenue: 2900 },
  { day: "20", revenue: 4100 },
  { day: "25", revenue: 5200 },
  { day: "30", revenue: 4800 },
];

const orderStatusData = [
  { name: "Completed", value: 584, color: "#C2410C" }, // Orange-700
  { name: "Processing", value: 234, color: "#0D9488" }, // Teal-600
  { name: "Pending", value: 127, color: "#FBBF24" }, // Amber-400
  { name: "Cancelled", value: 47, color: "#1E293B" }, // Slate-800
];

const topProducts = [
  {
    id: 1,
    name: "Pro Dashboard Template",
    category: "Templates",
    sold: 342,
    revenue: "$17,100",
    initials: "SC",
    color: "bg-slate-100",
    spark: [10, 25, 15, 30, 45],
  },
  {
    id: 2,
    name: "Enterprise License",
    category: "Licenses",
    sold: 156,
    revenue: "$12,480",
    initials: "MJ",
    color: "bg-slate-100",
    spark: [20, 18, 25, 40, 55],
  },
  {
    id: 3,
    name: "UI Component Kit",
    category: "Components",
    sold: 289,
    revenue: "$8,670",
    initials: "PS",
    color: "bg-slate-100",
    spark: [30, 35, 32, 38, 42],
  },
  {
    id: 4,
    name: "Admin Starter Pack",
    category: "Templates",
    sold: 198,
    revenue: "$7,920",
    initials: "AR",
    color: "bg-slate-100",
    spark: [15, 20, 18, 25, 30],
  },
];

const recentTransactions = [
  {
    customer: "Sarah Chen",
    email: "SC",
    product: "Pro Dashboard Template",
    amount: "$49.99",
    status: "Completed",
    date: "Feb 22",
  },
  {
    customer: "Marcus Johnson",
    email: "MJ",
    product: "Enterprise License",
    amount: "$199.99",
    status: "Completed",
    date: "Feb 22",
  },
  {
    customer: "Priya Sharma",
    email: "PS",
    product: "UI Component Kit",
    amount: "$29.99",
    status: "Processing",
    date: "Feb 21",
  },
  {
    customer: "Alex Rivera",
    email: "AR",
    product: "Admin Starter Pack",
    amount: "$39.99",
    status: "Completed",
    date: "Feb 21",
  },
  {
    customer: "Emma Taylor",
    email: "ET",
    product: "Analytics Module",
    amount: "$39.99",
    status: "Pending",
    date: "Feb 20",
  },
];

export default function EcommerceDashboard() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          eCommerce
        </h1>
        <p className="text-slate-500 mt-1">
          Track your sales performance and commerce metrics.
        </p>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value="$128,430"
          trend="+18.2%"
          trendUp={true}
          icon={DollarSign}
          color="orange"
        />
        <StatCard
          title="Avg. Order Value"
          value="$64.50"
          trend="+4.8%"
          trendUp={true}
          icon={ShoppingBag}
          color="teal"
        />
        <StatCard
          title="Conversion Rate"
          value="3.24%"
          trend="+0.8%"
          trendUp={true}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Refund Rate"
          value="2.1%"
          trend="-0.3%"
          trendUp={false}
          icon={RefreshCcw}
          color="amber"
        />
      </div>

      {/* Main Charts: Sales Overview & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Sales Overview
              </h3>
              <p className="text-sm text-slate-400">
                Daily performance for the current month
              </p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl">
              {["Revenue", "Orders", "Profit"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === "Revenue" ? "bg-white shadow-sm text-slate-900" : "text-slate-400"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesOverviewData}>
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#C2410C" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#C2410C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis dataKey="day" hide />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C2410C"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900">Order Status</h3>
          <p className="text-sm text-slate-400 mb-8">
            Distribution of current orders
          </p>
          <div className="relative flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900">992</span>
              <span className="text-xs text-slate-400 font-medium">Orders</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {orderStatusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
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

      {/* Middle Section: Top Selling & Sales by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Top Selling Products
              </h3>
              <p className="text-sm text-slate-400">
                Best performers this month
              </p>
            </div>
            <button className="text-sm font-bold text-slate-900 flex items-center hover:text-orange-600 transition-colors">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-y border-slate-100">
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4"># Product</th>
                <th className="px-4 py-4 text-right">Sold</th>
                <th className="px-4 py-4 text-right">Revenue</th>
                <th className="px-8 py-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-300">
                        {p.id}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-400">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-sm font-bold text-slate-900 text-right">
                    {p.sold}
                  </td>
                  <td className="px-4 py-5 text-sm font-bold text-slate-900 text-right">
                    {p.revenue}
                  </td>
                  <td className="px-8 py-5 text-right w-24">
                    <ResponsiveContainer width="100%" height={24}>
                      <LineChart data={p.spark.map((v) => ({ v }))}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke="#C2410C"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Sales by Category
          </h3>
          <p className="text-sm text-slate-400 mb-8">
            Revenue distribution across product types
          </p>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { n: "Templates", v: 28000 },
                  { n: "Licenses", v: 16000 },
                  { n: "Components", v: 12000 },
                  { n: "Modules", v: 7000 },
                ]}
                layout="vertical"
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="n"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  width={90}
                />
                <Bar
                  dataKey="v"
                  fill="#0D9488"
                  radius={[0, 6, 6, 0]}
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-4 uppercase tracking-tighter">
              <span>$0k</span>
              <span>$8k</span>
              <span>$15k</span>
              <span>$23k</span>
              <span>$30k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions & Revenue Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Recent Transactions
              </h3>
              <p className="text-sm text-slate-400">Latest customer orders</p>
            </div>
            <button className="text-sm font-bold text-slate-900 flex items-center hover:text-orange-600 transition-colors">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-y border-slate-100">
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Customer</th>
                <th className="px-4 py-4">Product</th>
                <th className="px-4 py-4 text-right">Amount</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentTransactions.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {t.email}
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {t.customer}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-sm font-medium text-slate-500">
                    {t.product}
                  </td>
                  <td className="px-4 py-5 text-sm font-bold text-slate-900 text-right">
                    {t.amount}
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                      ${
                        t.status === "Completed"
                          ? "bg-emerald-500 text-white"
                          : t.status === "Processing"
                            ? "bg-slate-900 text-white"
                            : t.status === "Pending"
                              ? "bg-amber-500 text-white"
                              : "bg-rose-500 text-white"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-400 text-right">
                    {t.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Revenue Targets</h3>
          <p className="text-sm text-slate-400 mb-8">
            Monthly progress toward goals
          </p>
          <div className="space-y-8">
            <TargetProgress
              label="Monthly Revenue"
              current="$128,430"
              target="$150,000"
              percent={86}
              color="bg-orange-700"
            />
            <TargetProgress
              label="Orders"
              current="992"
              target="1,200"
              percent={83}
              color="bg-teal-600"
            />
            <TargetProgress
              label="New Customers"
              current="347"
              target="500"
              percent={69}
              color="bg-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ title, value, trend, trendUp, icon: Icon, color }) {
  const colorStyles = {
    orange: "bg-orange-50 text-orange-600",
    teal: "bg-teal-50 text-teal-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tight mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${colorStyles[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div
        className={`flex items-center text-sm font-bold ${trendUp ? "text-emerald-500" : "text-rose-500"}`}
      >
        {trendUp ? (
          <TrendingUp size={16} className="mr-1" />
        ) : (
          <TrendingDown size={16} className="mr-1" />
        )}
        {trend}
      </div>
      <div
        className={`absolute bottom-0 left-0 w-full h-1 opacity-20 ${color === "orange" ? "bg-orange-600" : color === "teal" ? "bg-teal-600" : color === "blue" ? "bg-blue-600" : "bg-amber-600"}`}
      />
    </div>
  );
}

function TargetProgress({ label, current, target, percent, color }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-sm font-bold text-slate-900">{label}</span>
        <span className="text-xs font-bold text-slate-400">{percent}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight">
        <span className="text-slate-900">{current}</span>
        <span className="text-slate-400">Target: {target}</span>
      </div>
    </div>
  );
}
