"use client";
import { useState, useEffect } from "react";
import {
  Plus, Search, Filter, Download, ChevronLeft, ChevronRight,
  User, UserCheck, Trash2, ShieldAlert, ShieldCheck
} from "lucide-react";
import { getAllUsersAdmin, updateUserStatus, updateUserRole } from "../../../services/userService"; // Import service của bạn

// TODO: Sau này thay bằng import { UserDetailModal } from "../../../components/users/UserDetailModal";
const UserDetailModal = ({ open, user, onOpenChange }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96">
        <h2 className="text-lg font-bold mb-4">User Detail: {user.name}</h2>
        <p>Email: {user.email}</p>
        <button onClick={() => onOpenChange(false)} className="mt-4 bg-slate-900 text-white px-4 py-2 rounded-lg">Close</button>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("All"); 
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Bổ sung State để lưu dữ liệu từ API
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // Hàm fetch dữ liệu
  const fetchUsers = async (page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search: searchTerm, role: activeTab === "All" ? "" : activeTab };
      const res = await getAllUsersAdmin(params);
      setUsers(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lắng nghe thay đổi của search hoặc tab
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1, search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, activeTab]);

  // 2. Bên trong component UsersPage, thêm hàm handle
const handleToggleStatus = async (user) => {
  const newStatus = user.status === "active" ? "block" : "active";
  try {
    await updateUserStatus(user._id, newStatus);
    // Sau khi update thành công, load lại danh sách
    fetchUsers(pagination.page, search); 
  } catch (error) {
    // Debug lỗi cụ thể từ server trả về
    console.error("Lỗi chi tiết:", error.response?.data || error.message);
    
    // Thông báo lỗi thân thiện hơn
    alert(`Lỗi: ${error.response?.data?.message || "Không thể cập nhật trạng thái"}`);
  }
};

const handleRoleChange = async (userId, newRole) => {
  try {
    await updateUserRole(userId, newRole);
    // Sau khi update thành công, load lại danh sách
    fetchUsers(pagination.page, search); 
  } catch (error) {
    console.error("Lỗi cập nhật role:", error);
    alert("Không thể cập nhật quyền!");
  }
};

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-400 flex items-center gap-2 mb-1">
            <span>Dashboard</span>
            <span className="text-[10px]">/</span>
            <span className="text-slate-600 font-medium">Users</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users</h1>
          <p className="text-slate-500 text-sm">Manage and track your platform users.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
          <Plus size={18} /> Add New User
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: pagination.total || 0, icon: User, color: "text-blue-600" },
          { label: "Active Users", value: "12", icon: UserCheck, color: "text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/50">
        {["All", "Admin", "Customer", "Blocked"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" 
            />
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-center">
                <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Joined Date</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-center">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 group">
                    <td className="px-6 py-5 text-sm font-bold text-slate-900 cursor-pointer" onClick={() => setSelectedUser(user)}>
                      {user.name}
                    </td>
                    <td className="px-4 py-5 text-sm text-slate-600">{user.email}</td>
                   {/* Cột Role trong bảng */}
                    <td className="px-4 py-5">
                    <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer outline-none ${
                        user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-slate-100 text-slate-700'
                        }`}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    </td>
                    <td className="px-4 py-5 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-5">
                    <button 
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2 rounded-xl transition-all ${
                        user.status === 'block' 
                        ? "text-emerald-600 hover:bg-emerald-50" 
                        : "text-rose-500 hover:bg-rose-50"
                        }`}
                        title={user.status === 'block' ? "Unblock User" : "Block User"}
                    >
                        {user.status === 'block' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
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
           <span>Showing {users.length} of {pagination.total} results</span>
           <div className="flex gap-2">
             <button 
               disabled={pagination.page === 1}
               onClick={() => fetchUsers(pagination.page - 1, search)}
               className="p-2 border border-slate-200 rounded-lg disabled:opacity-50"
             >
               <ChevronLeft size={16} />
             </button>
             <button 
               disabled={pagination.page >= pagination.totalPages}
               onClick={() => fetchUsers(pagination.page + 1, search)}
               className="p-2 border border-slate-200 rounded-lg disabled:opacity-50"
             >
               <ChevronRight size={16} />
             </button>
           </div>
        </div>
      </div>

      <UserDetailModal 
        user={selectedUser} 
        open={!!selectedUser} 
        onOpenChange={(open) => !open && setSelectedUser(null)} 
      />
    </div>
  );
}