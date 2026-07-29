"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Upload,
  X,
  Plus,
  Layers,
  Trash2,
  Image as ImageIconLucide,
  ArrowLeft,
  Save,
  Camera,
  Loader2,
  Settings2,
  Package,
  FileText,
  Sliders
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createProduct } from "../../../../services/productService";
import { getAllCategories } from "../../../../services/categoryService";
import { createVariants } from "../../../../services/variantsService";
import { getAllBrands } from "../../../../services/brandService";
import { getAllAttributes } from "../../../../services/attributeService";
import AddAttributeModal from "../../../../components/ui/AddAttributeModal";

export default function NewProductPage({ onSave }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attributeList, setAttributeList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    brandId: "",
    image: null,
    status: "Active",
    isFeatured: false,
    specifications: [
      { key: "", value: "" }
    ],
    // --- ĐÃ BỔ SUNG compareAtPrice VÀ isDefault VÀO MỖI VARIANT ---
    variants: [
      { sku: "", price: "", compareAtPrice: "", stock: "", image: null, isDefault: false, attributes: [] }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      const [cats, brds] = await Promise.all([getAllCategories(), getAllBrands()]);
      setCategories(cats);
      setBrands(brds);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await getAllAttributes();
        if (response && Array.isArray(response.data)) {
          setAttributeList(response.data);
        } else {
          setAttributeList([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải thuộc tính:", error);
        setAttributeList([]);
      }
    };
    fetchAttributes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Tên sản phẩm không được để trống");
    if (!formData.categoryId) return toast.error("Vui lòng chọn danh mục");
    if (!formData.brandId) return toast.error("Vui lòng chọn Thương hiệu");
    if (!formData.basePrice || Number(formData.basePrice) < 0) return toast.error("Giá không hợp lệ");

    setIsSubmitting(true);
    const toastId = toast.loading("Đang tạo sản phẩm...");

    try {
      const dataToSend = new FormData();
      
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");

      Object.entries({
        name: formData.name.trim(),
        description: formData.description,
        basePrice: Number(formData.basePrice),
        status: formData.status,
        slug: generatedSlug,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        isFeatured: formData.isFeatured,
      }).forEach(([key, value]) => dataToSend.append(key, value));

      if (formData.image) dataToSend.append("image", formData.image);

      const validSpecs = formData.specifications.filter(s => s.key.trim() && s.value.trim());
      if (validSpecs.length > 0) {
        dataToSend.append("specifications", JSON.stringify(validSpecs));
      }

      const productRes = await createProduct(dataToSend);

      if (!productRes) {
        throw new Error("Server không trả về dữ liệu sản phẩm!");
      }

      const productId = productRes?.data?._id || productRes?._id;

      const variantsData = new FormData();
      variantsData.append("productId", productId);

      formData.variants.forEach((v, index) => {
        variantsData.append(`variants[${index}][sku]`, v.sku);
        variantsData.append(`variants[${index}][price]`, v.price);
        // --- GỬI compareAtPrice LÊN BACKEND ---
        variantsData.append(`variants[${index}][compareAtPrice]`, v.compareAtPrice);
        variantsData.append(`variants[${index}][stock]`, v.stock);
        // --- GỬI isDefault LÊN BACKEND ---
        variantsData.append(`variants[${index}][isDefault]`, v.isDefault);
        
        if (v.image instanceof File) {
          variantsData.append("variantImages", v.image);
          variantsData.append(`variants[${index}][imageIndex]`, index);
        }

        v.attributes.forEach((attr, attrIdx) => {
          variantsData.append(`variants[${index}][attributes][${attrIdx}][attributeId]`, attr.attributeId);
          variantsData.append(`variants[${index}][attributes][${attrIdx}][attributeValueId]`, attr.attributeValueId);
        });
      });

      await createVariants(variantsData);

      toast.dismiss(toastId);
      toast.success("Sản phẩm đã được tạo thành công!");
      
      setFormData({
        name: "",
        description: "",
        basePrice: "",
        categoryId: "",
        brandId: "",
        image: null,
        status: "Active",
        isFeatured: false,
        specifications: [{ key: "", value: "" }],
        variants: [{ sku: "", price: "", compareAtPrice: "", stock: "", image: null, isDefault: false, attributes: [] }]
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Thất bại: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value
      };
      return { ...prev, variants: newVariants };
    });
  };

  return (
    <div className="space-y-6 max-w-full mx-auto pb-20 px-4 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link
          href="/admin/products"
          className="hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-wider"
        >
          Products
        </Link>
        <ChevronRight size={12} />
        <span className="text-slate-900 font-bold text-xs uppercase tracking-wider">
          New Product
        </span>
      </nav>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Create Product
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Thiết lập thông tin và quản lý kho hàng sản phẩm.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-9 w-full space-y-8">
          {/* 1. KHỐI THÔNG TIN CƠ BẢN */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold text-slate-800">
                Thông tin cơ bản
              </h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-600">
                    Tên sản phẩm <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 font-medium">
                    {formData.name.length} / 150
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={150}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-slate-400 transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Giá sản phẩm <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                  placeholder="Nhập giá sản phẩm..."
                  className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-slate-400 transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-600">
                    Mô tả sản phẩm
                  </label>
                  <span className="text-xs text-slate-400 font-medium">
                    {formData.description?.length || 0} / 2000
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả..."
                  className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-slate-400 transition-all resize-none placeholder:text-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Danh mục <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.categoryId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="w-full appearance-none px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-slate-400 transition-all cursor-pointer"
                    >
                      <option value="" disabled>
                        Chọn danh mục
                      </option>
                      {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Thương hiệu
                  </label>
                  <div className="relative">
                    <select
                      value={formData.brandId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, brandId: e.target.value })
                      }
                      className="w-full appearance-none px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-slate-400 transition-all cursor-pointer"
                    >
                      <option value="" disabled>
                        Chọn thương hiệu
                      </option>
                      {brands?.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* THÔNG SỐ KỸ THUẬT */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="text-slate-400" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Thông số kỹ thuật</h3>
              </div>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  specifications: [...formData.specifications, { key: "", value: "" }]
                })}
                className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                + Thêm thông số
              </button>
            </div>

            <div className="space-y-3">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <input
                    type="text"
                    placeholder="Tên thông số (VD: Màn hình)"
                    value={spec.key}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].key = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Giá trị (VD: OLED 6.7 inch)"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].value = e.target.value;
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium"
                  />
                  {formData.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newSpecs = formData.specifications.filter((_, i) => i !== index);
                        setFormData({ ...formData, specifications: newSpecs });
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* HÌNH ẢNH SẢN PHẨM */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <ImageIconLucide className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold text-slate-800">
                Hình ảnh sản phẩm
              </h3>
            </div>

            <div className="space-y-4">
              <label
                htmlFor="file-upload"
                className="group w-full min-h-[200px] border-2 border-dashed border-slate-200 rounded-[20px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all"
              >
                <div className="p-4 bg-slate-50 rounded-full group-hover:scale-110 transition-transform">
                  <Plus
                    size={32}
                    className="text-slate-400 group-hover:text-slate-600"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-600">
                    Bấm để tải ảnh lên hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    PNG, JPG hoặc JPEG (Tối đa 2MB)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </label>

              {formData.image && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="aspect-square relative rounded-2xl overflow-hidden border border-slate-200 group shadow-md">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt="preview"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, image: null })
                        }
                        className="p-2 bg-white rounded-full text-rose-500 shadow-xl hover:scale-110 transition-transform"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 py-1 bg-white/90 backdrop-blur rounded-lg text-center shadow-sm">
                      <span className="text-[10px] font-black text-slate-900 uppercase">
                        Ảnh chính
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div> 

          {/* 3. KHỐI BIẾN THỂ SẢN PHẨM (ĐÃ CÓ SKU, PRICE, COMPAREATPRICE, STOCK, ISDEFAULT) */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800">Biến thể sản phẩm</h3>
              </div>
             <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Thêm thuộc tính
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, variants: [...formData.variants, { sku: "", price: "", compareAtPrice: "", stock: "", image: null, isDefault: false, attributes: [] }] })}
                className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                + Thêm biến thể
              </button>
              <AddAttributeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
              />
            </div>
            </div>

            {formData?.variants?.map((variant, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Biến thể #{index + 1}</span>
                  {formData.variants.length > 1 && (
                    <button type="button" onClick={() => setFormData({...formData, variants: formData.variants.filter((_, i) => i !== index)})} className="text-rose-500">
                      <X size={18} />
                    </button>
                  )}
                </div>
                
                {/* Các trường nhập liệu cho biến thể gồm SKU, Giá bán, Giá so sánh (compareAtPrice), Tồn kho */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    placeholder="SKU" 
                    className="px-4 py-3 rounded-xl border border-slate-200"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, "sku", e.target.value)}
                  />
                  <input 
                    placeholder="Giá bán" 
                    type="number"
                    className="px-4 py-3 rounded-xl border border-slate-200"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, "price", e.target.value)}
                  />
                  <input 
                    placeholder="Giá gốc (Compare At Price)" 
                    type="number"
                    className="px-4 py-3 rounded-xl border border-slate-200"
                    value={variant.compareAtPrice}
                    onChange={(e) => updateVariant(index, "compareAtPrice", e.target.value)}
                  />
                  <input 
                    placeholder="Tồn kho" 
                    type="number"
                    className="px-4 py-3 rounded-xl border border-slate-200"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, "stock", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {attributeList?.map((attr) => (
                    <div key={attr._id} className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">{attr.name}</label>
                      <select
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                        value={variant.attributes.find(a => a.attributeId === attr._id)?.attributeValueId || ""}
                        onChange={(e) => {
                          const selectedValueId = e.target.value;
                          const newVariants = [...formData.variants];
                          const attrIndex = newVariants[index].attributes.findIndex(a => a.attributeId === attr._id);
                          
                          if (attrIndex > -1) {
                            newVariants[index].attributes[attrIndex].attributeValueId = selectedValueId;
                          } else {
                            newVariants[index].attributes.push({ 
                              attributeId: attr._id, 
                              attributeValueId: selectedValueId 
                            });
                          }
                          setFormData({ ...formData, variants: newVariants });
                        }}
                      >
                        <option value="">Chọn {attr.name}</option>
                        {attr?.values?.map((val) => (
                          <option key={val._id} value={val._id}>{val.value}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Ảnh biến thể</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const newVariants = [...formData.variants];
                          newVariants[index].image = file;
                          setFormData({ ...formData, variants: newVariants });
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                        checked={variant.isDefault}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants.forEach((v, i) => v.isDefault = (i === index ? e.target.checked : false));
                          setFormData({ ...formData, variants: newVariants });
                        }}
                      />
                      <span className="text-sm font-bold text-slate-700">Đặt làm mặc định</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>        
        </div>

        {/* CỘT PHẢI - XUẤT BẢN */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm sticky top-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg font-bold text-slate-900">Xuất bản</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Trạng thái sản phẩm
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full appearance-none px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-slate-100 text-sm font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="Active">Đang bán (Active)</option>
                      <option value="Draft">Bản nháp (Draft)</option>
                      <option value="Inactive">Không bán (Inactive)</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-50 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-2
                  ${
                    isSubmitting
                      ? "bg-slate-700 cursor-not-allowed opacity-80"
                      : "bg-slate-900 hover:bg-slate-800 active:scale-95 shadow-slate-200 text-white"
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Lưu sản phẩm</span>
                  </>
                )}
              </button>
              <Link
                href="/admin2/products"
                className="block w-full text-center py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 hover:text-slate-600 transition-all text-sm"
              >
                Hủy bỏ
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}