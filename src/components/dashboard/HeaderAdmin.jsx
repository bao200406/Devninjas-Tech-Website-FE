import { Bell, Moon, CalendarDays, Search } from "lucide-react";

export default function HeaderAdmin() {
  return (
    <>
      {/* HEADER */}
      <header className="h-20 border-b border-admin-border flex items-center justify-between px-8 sticky top-0 bg-admin-bg/80 backdrop-blur-md z-10">
        <div className="relative w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted"
            size={18}
          />
          <input
            type="text"
            placeholder="Search analytics, orders, or users..."
            className="w-full bg-admin-card border border-admin-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-admin-accent transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-admin-card border border-admin-border rounded-xl p-1">
            <button className="p-2 text-admin-text-muted hover:text-admin-accent">
              <Bell size={18} />
            </button>
            <button className="p-2 text-admin-text-muted hover:text-admin-accent">
              <Moon size={18} />
            </button>
            <button className="p-2 text-admin-text-muted hover:text-admin-accent">
              <CalendarDays size={18} />
            </button>
          </div>
          <button className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase">
            System Online •
          </button>
        </div>
      </header>
    </>
  );
}
