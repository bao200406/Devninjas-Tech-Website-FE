import { Search, Plus, Moon, Bell, Maximize2 } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b p-4 border-slate-200 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center bg-slate-50 rounded-lg px-3 py-1.5 w-full max-w-md border border-slate-100">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent border-none outline-none text-sm ml-2 w-full"
        />
        <kbd className="hidden sm:block bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-400">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm">
          <Plus size={16} />
          New Order
        </button>
        <div className="flex items-center gap-2 text-slate-500 border-l pl-4 border-slate-200">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Moon size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Maximize2 size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold ml-2">
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
