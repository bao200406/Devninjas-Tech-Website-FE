"use client";
import { useState, useEffect } from "react";
import { 
  ChevronRight, FileText, ImageIcon as ImageIconLucide, 
  Save, LayoutGrid, Star, ListOrdered, ArrowLeft, Plus
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation"; 
import { getCategoryById, editCategory } from "../../../../../services/categoryService";
import { toast } from "react-toastify";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isFeatured: false,
    icon: "",
    displayOrder: 0,
    status: "Active",
  });

  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  // 1. Fetch dữ liệu cũ để hiển thị
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategoryById(id);
        console.log("Fetched category data:", data); // Log dữ liệu nhận được
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          isFeatured: data.isFeatured,
          icon: data.icon || "",
          displayOrder: data.displayOrder || 0,
          status: data.status,
        });
        if (data.image) setPreviewImg(`https://devninjas-tech-website-be-1.onrender.com/uploads/categories/${data.image}`);
        setIsLoading(false);
      } catch (error) {
        toast.error("Không tìm thấy danh mục");
        router.push("/admin/categories");
      }
    };
    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append("image", image);

    try {
      await editCategory(id, data);
      toast.success("Cập nhật danh mục thành công!");
      router.push("/admin2/categories");
    } catch (error) {
      toast.error("Lỗi khi cập nhật danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="space-y-6 max-w-full mx-auto pb-20 px-4 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/admin/categories" className="hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-wider">Categories</Link>
        <ChevronRight size={12} />
        <span className="text-slate-900 font-bold text-xs uppercase tracking-wider">Edit Category</span>
      </nav>

      <div className="flex items-center gap-4">
        <Link href="/admin2/categories" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"><ArrowLeft size={20}/></Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Category</h1>
          <p className="text-slate-500 mt-1 font-medium">Cập nhật thông tin danh mục hiện tại.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    {/* CỘT TRÁI */}
    <div className="lg:col-span-9 w-full space-y-8">
      {/* Thông tin cơ bản */}
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
              <div className="w-[50px] h-[50px] flex items-center justify-center bg-slate-100 rounded-xl border border-slate-200 text-slate-600">
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
            {isSubmitting ? "Đang lưu..." : <><Save size={20} /> <span>Lưu thay đổi</span></>}
          </button>
          <Link href="/admin2/categories" className="block w-full text-center py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold hover:bg-slate-50">
            Hủy bỏ
          </Link>
        </div>
      </div>
    </div>
  </form>
    </div>
  );
}