import {
  ArrowUpRight,
  DollarSign,
  ShoppingBag,
  Box,
  Users,
  Download,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "$1,248,500",
      trend: "+12.5%",
      icon: DollarSign,
      color: "text-cyan-400",
    },
    {
      title: "Tổng số đơn hàng",
      value: "4,582",
      trend: "+5.2%",
      icon: ShoppingBag,
      color: "text-purple-400",
    },
    {
      title: "Tổng số sản phẩm",
      value: "1,240",
      sub: "65 New SKUs",
      icon: Box,
      color: "text-blue-400",
    },
    {
      title: "Số lượng khách hàng",
      value: "25,431",
      sub: "2.2k Active",
      icon: Users,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Bar inside Content */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="text-admin-text-muted mt-1">
            Số liệu hiệu suất thực tế năm tài chính 2026.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-admin-card border border-admin-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-admin-border transition-all">
            <Download size={16} /> Export Report
          </button>
          <button className="flex items-center gap-2 bg-admin-accent text-gray-900 px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="admin-card group hover:border-admin-accent/50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl bg-admin-bg border border-admin-border ${s.color}`}
              >
                <s.icon size={24} />
              </div>
              {s.trend && (
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg text-xs font-bold">
                  {s.trend} <ArrowUpRight size={12} />
                </div>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-admin-text-muted font-bold">
                {s.title}
              </p>
              <h3 className="text-2xl font-black mt-1">{s.value}</h3>
              {s.sub && (
                <p className="text-xs text-admin-text-muted mt-1">{s.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance (Main Chart) */}
        <div className="lg:col-span-2 admin-card min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Revenue Performance</h3>
            <div className="flex bg-admin-bg border border-admin-border rounded-lg p-1 text-xs">
              <button className="px-3 py-1 rounded-md bg-admin-accent text-gray-900 font-bold">
                1D
              </button>
              <button className="px-3 py-1 text-admin-text-muted">30D</button>
              <button className="px-3 py-1 text-admin-text-muted">1Y</button>
            </div>
          </div>
          {/* Placeholder for Chart */}
          <div className="flex-1 w-full bg-gradient-to-t from-admin-bg to-transparent rounded-xl border border-admin-border/50 flex items-center justify-center border-dashed">
            <p className="text-admin-text-muted italic text-sm text-center">
              [ Biểu đồ thanh (Bar Chart) sẽ hiển thị ở đây. <br /> Bạn có thể
              dùng thư viện Recharts để vẽ ]
            </p>
          </div>
        </div>

        {/* Category Share (Donut Chart) */}
        <div className="admin-card flex flex-col">
          <h3 className="text-lg font-bold mb-6">Category Share</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Vẽ vòng tròn giả bằng CSS */}
            <div className="w-48 h-48 rounded-full border-[16px] border-admin-bg border-t-admin-accent border-r-purple-500 border-l-blue-500 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-black">85%</p>
                <p className="text-[10px] text-admin-text-muted uppercase">
                  Capacity
                </p>
              </div>
            </div>

            <div className="mt-8 w-full space-y-3">
              {[
                { name: "Electronics", color: "bg-admin-accent", val: "42%" },
                { name: "Fashion", color: "bg-purple-500", val: "30%" },
                { name: "Home", color: "bg-blue-500", val: "18%" },
              ].map((cat) => (
                <div
                  key={cat.name}
                  className="flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                    <span className="text-admin-text-muted">{cat.name}</span>
                  </div>
                  <span className="font-bold">{cat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
