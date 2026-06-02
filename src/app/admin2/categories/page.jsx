"use client";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import { useState } from "react";

const categories = [
  {
    id: "CAT-001",
    thumb: null,
    name: "Electronics",
    count: 154,
    status: "Active",
    created: "Jan 10, 2026",
  },
  {
    id: "CAT-002",
    thumb: null,
    name: "Fashion & Apparel",
    count: 82,
    status: "Active",
    created: "Dec 20, 2025",
  },
  {
    id: "CAT-003",
    thumb: null,
    name: "Home Appliances",
    count: 45,
    status: "Draft",
    created: "Dec 15, 2025",
  },
  {
    id: "CAT-004",
    thumb: null,
    name: "Beauty & Health",
    count: 120,
    status: "Active",
    created: "Nov 28, 2025",
  },
  {
    id: "CAT-005",
    thumb: null,
    name: "Books & Stationery",
    count: 32,
    status: "Archived",
    created: "Nov 15, 2025",
  },
];

export default function CategoryPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-400 flex items-center gap-2 mb-1">
            <span>Dashboard</span>
            <span className="text-[10px]">/</span>
            <span className="text-slate-600 font-medium">Categories</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Categories
          </h1>
          <p className="text-slate-500 text-sm">
            Organize your products into structured groups.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
          <Plus size={18} />
          New Category
        </button>
      </div>

      {/* Segmented Control Tabs (Giống hình mẫu 100%) */}
      <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/50">
        {["All", "Active", "Draft", "Archived"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/10"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full lg:max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-100 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Filter size={16} /> Filters
            </button>
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 accent-slate-900"
                  />
                </th>
                <th className="px-4 py-4 w-24">ID</th>
                <th className="px-4 py-4 w-28 text-center">Image</th>
                <th className="px-4 py-4">
                  Category Name{" "}
                  <ArrowUpDown size={12} className="inline ml-1 opacity-50" />
                </th>
                <th className="px-4 py-4">Products Count</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 accent-slate-900"
                    />
                  </td>
                  <td className="px-4 py-5 text-xs font-bold text-slate-400 uppercase">
                    {cat.id}
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400 shadow-inner group-hover:scale-105 transition-transform">
                        <FolderTree size={22} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-[14px] font-bold text-slate-900 leading-tight">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium italic">
                      Primary Category
                    </p>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-slate-300" />
                      <span className="text-sm font-bold text-slate-700">
                        {cat.count} Items
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        cat.status === "Active"
                          ? "bg-emerald-500 text-white"
                          : cat.status === "Draft"
                            ? "bg-amber-400 text-white"
                            : "bg-slate-300 text-slate-600"
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-right pr-8">
                    <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50">
          <p className="text-xs font-semibold text-slate-400 italic">
            Showing 1-5 of 12 categories
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
              <button className="w-9 h-9 rounded-lg bg-slate-900 text-white text-xs font-bold">
                1
              </button>
              <button className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                2
              </button>
            </div>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
