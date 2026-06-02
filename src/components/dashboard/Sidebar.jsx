import {
  LayoutDashboard,
  Target,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
} from "lucide-react";

export default function SideBar() {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, active: true },
    { name: "Categories", icon: Target },
    { name: "Products", icon: Package },
    { name: "Accounts", icon: Users },
    { name: "Orders", icon: ShoppingCart },
    { name: "Analytics", icon: BarChart3 },
  ];

  return (
    <>
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-admin-border flex flex-col p-6 sticky top-0 h-screen">
        <div className="text-xl font-bold text-admin-accent mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-admin-accent rounded-lg"></div>
          Luminescent
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                item.active
                  ? "bg-admin-card text-admin-accent border border-admin-border"
                  : "text-admin-text-muted hover:text-admin-text-main hover:bg-admin-card/50"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </div>
          ))}
        </nav>

        <div className="pt-6 border-t border-admin-border">
          <div className="flex items-center gap-4 px-4 py-3 text-admin-text-muted hover:text-admin-text-main cursor-pointer">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </div>
          {/* User Profile Mini */}
          <div className="mt-6 flex items-center gap-3 p-2 bg-admin-card/40 rounded-2xl border border-admin-border">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-admin-accent to-blue-500"></div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Alex Sterling</p>
              <p className="text-xs text-admin-text-muted">Chief Officer</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
