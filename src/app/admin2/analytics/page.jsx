"use client";
import React from "react";
import {
  Calendar,
  Eye,
  Users,
  MousePointer2,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- Data giả cho biểu đồ ---
const lineData = [
  { name: "Jan", value: 250 },
  { name: "Feb", value: 310 },
  { name: "Mar", value: 280 },
  { name: "Apr", value: 410 },
  { name: "May", value: 390 },
  { name: "Jun", value: 480 },
  { name: "Jul", value: 510 },
  { name: "Aug", value: 490 },
  { name: "Sep", value: 520 },
  { name: "Oct", value: 580 },
  { name: "Nov", value: 610 },
  { name: "Dec", value: 620 },
];

const barData = [
  { name: "Templates", value: 28000 },
  { name: "Licenses", value: 15000 },
  { name: "Plans", value: 12000 },
  { name: "Modules", value: 8000 },
];

const topPages = [
  {
    path: "/products/pro-dashboard",
    views: "12,847",
    unique: "8,392",
    bounce: "28%",
  },
  {
    path: "/products/enterprise",
    views: "9,234",
    unique: "6,128",
    bounce: "31%",
  },
  { path: "/pricing", views: "8,456", unique: "5,843", bounce: "24%" },
  {
    path: "/docs/getting-started",
    views: "7,123",
    unique: "4,891",
    bounce: "18%",
  },
  {
    path: "/blog/nextjs-guide",
    views: "5,892",
    unique: "3,746",
    bounce: "35%",
  },
];

const countries = [
  { name: "United States", value: "12,847", percent: 30 },
  { name: "United Kingdom", value: "6,423", percent: 15 },
  { name: "Germany", value: "5,134", percent: 12 },
  { name: "Canada", value: "3,847", percent: 9 },
  { name: "France", value: "2,983", percent: 7 },
  { name: "Australia", value: "2,561", percent: 6 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500">
            Track your business performance and key metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            {["7d", "30d", "90d", "1y"].map((t) => (
              <button
                key={t}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${t === "90d" ? "bg-slate-100 text-slate-900 shadow-inner" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <Calendar size={16} />
            Feb 11, 2026 – May 12, 2026
          </button>
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Page Views"
          value="284,392"
          trend="+24.7%"
          trendUp={true}
          icon={Eye}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
        />
        <MetricCard
          title="Unique Visitors"
          value="42,847"
          trend="+12.3%"
          trendUp={true}
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
        />
        <MetricCard
          title="Bounce Rate"
          value="32.4%"
          trend="-5.2%"
          trendUp={false}
          icon={MousePointer2}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <MetricCard
          title="Avg. Session"
          value="4m 32s"
          trend="+8.1%"
          trendUp={true}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Page Views Over Time
          </h3>
          <p className="text-sm text-slate-400 mb-8">
            Monthly visitor traffic trends
          </p>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#F97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#lineColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart (Horizontal) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Revenue by Category
          </h3>
          <p className="text-sm text-slate-400 mb-8">
            Distribution across product types
          </p>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  width={80}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="value"
                  fill="#0D9488"
                  radius={[0, 8, 8, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-4 px-2 uppercase tracking-tighter">
              <span>$0k</span>
              <span>$8k</span>
              <span>$15k</span>
              <span>$23k</span>
              <span>$30k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Pages & Top Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8">
            <h3 className="text-lg font-bold text-slate-900">Top Pages</h3>
            <p className="text-sm text-slate-400">
              Most visited pages this period
            </p>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-100">
                <th className="px-8 py-4 font-bold">Page</th>
                <th className="px-4 py-4 text-right">Views</th>
                <th className="px-4 py-4 text-right">Unique</th>
                <th className="px-8 py-4 text-right">Bounce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topPages.map((page, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">
                    {page.path}
                  </td>
                  <td className="px-4 py-5 text-sm font-bold text-slate-900 text-right">
                    {page.views}
                  </td>
                  <td className="px-4 py-5 text-sm font-medium text-slate-400 text-right">
                    {page.unique}
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-400 text-right">
                    {page.bounce}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Countries Progress Bars */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Top Countries</h3>
          <p className="text-sm text-slate-400 mb-8">
            Where your visitors come from
          </p>
          <div className="space-y-7">
            {countries.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-28 text-sm font-bold text-slate-900">
                  {c.name}
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600 rounded-full"
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-medium text-slate-500">
                  {c.value}
                </span>
                <span className="w-10 text-right text-sm font-medium text-slate-400">
                  {c.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component cho Stat Card
function MetricCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tight mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${iconBg} ${iconColor}`}>
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
    </div>
  );
}
