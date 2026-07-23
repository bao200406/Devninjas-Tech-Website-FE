"use client";
import { useState } from "react";
import { 
  ChevronRight, 
  FileText, 
  ImageIcon as ImageIconLucide, 
  Plus, 
  Save, 
  Loader2,
  LayoutGrid,
  Star,
  ListOrdered
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { createCategory } from "../../../../services/categoryService";

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isFeatured: false,
    icon: "",
    displayOrder: 0,
    status: "Active",
  });

  // State quản lý file
  const [image, setImage] = useState(null);
  const [icon, setIcon] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);

  // Xử lý thay đổi file
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'image') {
      setImage(file);
      setPreviewImg(URL.createObjectURL(file));
    } else {
      setIcon(file);
      setPreviewIcon(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Chuẩn bị FormData
    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("isFeatured", formData.isFeatured);
    data.append("displayOrder", formData.displayOrder);
    data.append("status", formData.status);
    data.append("icon", formData.icon);
    
    if (image) data.append("image", image);

    try {
      // 2. Gọi hàm createCategory từ file API
      await createCategory(data);
      
      alert("Tạo danh mục thành công!");
      router.push("/admin2/categories"); // Chuyển hướng về trang danh sách
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      alert(error.message || "Có lỗi xảy ra khi tạo danh mục.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full mx-auto pb-20 px-4 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/admin/categories" className="hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-wider">
          Categories
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-900 font-bold text-xs uppercase tracking-wider">New Category</span>
      </nav>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Category</h1>
          <p className="text-slate-500 mt-1 font-medium">Quản lý danh mục và cấu hình hiển thị trang chủ.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* CỘT TRÁI */}
      <div className="lg:col-span-9 w-full space-y-8">
        <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-slate-400" size={20} />
            <h3 className="text-lg font-bold text-slate-800">Thông tin cơ bản</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Tên danh mục <span className="text-rose-500">*</span></label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl outline-none focus:border-slate-400" placeholder="Ví dụ: Điện thoại" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Slug (URL) <span className="text-rose-500">*</span></label>
              <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl outline-none focus:border-slate-400" placeholder="dien-thoai" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Mô tả</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl outline-none focus:border-slate-400 resize-none" placeholder="Nhập mô tả danh mục..." />
          </div>
        </div>

        {/* Cấu hình hiển thị */}
        <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="text-slate-400" size={20} />
            <h3 className="text-lg font-bold text-slate-800">Cấu hình hiển thị</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 flex items-center gap-2"><Star size={14}/> Danh mục nổi bật</label>
              <select value={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.value})} className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl outline-none">
                <option value="false">Không</option>
                <option value="true">Có</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 flex items-center gap-2"><ListOrdered size={14}/> Thứ tự hiển thị</label>
              <input type="number" value={formData.displayOrder} onChange={(e) => setFormData({...formData, displayOrder: e.target.value})} className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl outline-none" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <ImageIconLucide className="text-slate-400" size={20} />
            <h3 className="text-lg font-bold text-slate-800">Media (Ảnh & Icon)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="file" id="img-input" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
            <label htmlFor="img-input" className="border-2 border-dashed border-slate-200 rounded-[20px] flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-50 overflow-hidden">
              {previewImg ? <img src={previewImg} className="h-20 object-cover" /> : <><Plus className="text-slate-400 mb-2" /> <span className="text-xs font-bold text-slate-500">Tải ảnh đại diện</span></>}
            </label>
            
            {/* Input Icon + Xem trước */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Icon (Lucide)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={formData.icon} 
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl outline-none focus:border-slate-400 h-[50px]" 
                placeholder="Ví dụ: Smartphone" 
              />
              {/* Khung hiển thị icon xem trước */}
              <div className="w-[50px] h-[50px] flex items-center justify-center bg-slate-100 rounded-xl border border-slate-200 text-slate-600">
                {/* Nơi render icon từ Lucide */}
                {formData.icon ? <span className="text-xl">✨</span> : <span className="text-xs text-slate-400">?</span>}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Nhập tên icon từ thư viện Lucide.</p>
          </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="lg:col-span-3">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm sticky top-6 space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Xuất bản</h3>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-50">
            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
              {isSubmitting ? "Đang lưu..." : <><Save size={20} /> <span>Lưu danh mục</span></>}
            </button>
            <Link href="/admin/categories" className="block w-full text-center py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold hover:bg-slate-50">
              Hủy bỏ
            </Link>
          </div>
        </div>
      </div>
    </form>
    </div>
  );
}