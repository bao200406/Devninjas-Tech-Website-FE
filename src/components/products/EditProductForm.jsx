import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Info,
  Image as ImageIcon,
  LayoutGrid,
  Layers,
  Upload,
  Plus,
  Trash2,
  ChevronDown,
  Check,
  ImagePlus,
  Box,
} from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { getAllCategories } from "../../services/categoryService";
import {
  getVariantsByProduct,
  updateVariants,
} from "../../services/variantsService";
import { updateProduct } from "../../services/productService";

export default function EditProductForm({
  product,
  onClose,
  productId,
  onSave,
}) {
  const [activeTab, setActiveTab] = useState("general");
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    slug: "",
    image: null,
    status: "Active",
    isFeatured: false,
    variants: [
      {
        sku: "",
        price: "",
        compareAtPrice: "",
        stock: 0,
        attributes: {},
        image: null,
        isDefault: false,
      },
    ],
  });

  useEffect(() => {
    const fetchVariants = async () => {
      if (!productId) return; // Nếu chưa có ID sản phẩm thì thoát

      try {
        setLoading(true);
        const data = await getVariantsByProduct(productId);
        console.log("Biến thể đã lấy về:", data);
        // Cập nhật dữ liệu vào formData để hiển thị
        setFormData((prev) => ({
          ...prev,
          variants: data || [], // Đảm bảo luôn là mảng để không bị lỗi .map()
        }));
      } catch (error) {
        console.error("Không thể lấy biến thể:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [productId]); // Chạy lại nếu productId thay đổi

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCats(true);
      const data = await getAllCategories();
      setCategories(data);
      setLoadingCats(false);
    };
    fetchCategories();

    if (product) {
      setFormData(product);
    }
  }, [product]);

  useEffect(() => {
    // 1. Nếu không có ảnh (null/undefined)
    if (!formData.image) {
      setPreviewUrl(null);
      return;
    }

    // 2. Nếu là ảnh MỚI (người dùng vừa chọn từ máy tính)
    if (formData.image instanceof File) {
      const objectUrl = URL.createObjectURL(formData.image);
      setPreviewUrl(objectUrl);

      // Dọn dẹp bộ nhớ
      return () => URL.revokeObjectURL(objectUrl);
    }

    // 3. Nếu là ảnh CŨ (đã có trên server, kiểu dữ liệu là String)
    if (typeof formData.image === "string") {
      // Thay 'https://devninjas-tech-website-be-1.onrender.com/uploads/' bằng domain API thực tế của bạn
      const serverImageUrl = `https://devninjas-tech-website-be-1.onrender.com/uploads/products/${formData.image}`;
      setPreviewUrl(serverImageUrl);
    }
  }, [formData.image]);

  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      sku: "",
      price: "",
      compareAtPrice: "",
      stock: 0,
      weight: 0,
      attributes: {}, // Sẽ lưu dạng { color: "Red", size: "XL" }
      image: null,
      isActive: true,
      isDefault: formData.variants.length === 0, // Cái đầu tiên là mặc định
      dimensions: { length: 0, width: 0, height: 0 },
    };

    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const updateVariant = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => {
        if (v.id === id) {
          // Nếu trường là isDefault, ta nên reset các variant khác về false
          if (field === "isDefault" && value === true) {
            // Việc này xử lý ở bước map tổng thể bên dưới
            return { ...v, [field]: value };
          }
          return { ...v, [field]: value };
        }

        // Nếu có một cái được đặt làm mặc định, các cái còn lại phải là false
        if (field === "isDefault" && value === true) {
          return { ...v, isDefault: false };
        }

        return v;
      }),
    }));
  };

  const removeVariant = (id) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Bắt đầu hiện Loading Toast
    const toastLoading = toast.loading("Đang xử lý dữ liệu...");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const productId = formData._id;
    if (!productId) {
      toast.error("Không tìm thấy ID sản phẩm để cập nhật");
      return;
    }

    // Chốt chặn: Kiểm tra tên sản phẩm
    if (!formData.name?.trim()) {
      toast.error("Tên sản phẩm không được để trống");
      return; // Phải return ở đây để dừng thực thi
    }

    try {
      const newData = new FormData();

      // Tạo Slug chuyên nghiệp hơn
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Append dữ liệu Product
      newData.append("name", formData.name.trim());
      newData.append("description", formData.description || "");
      newData.append("basePrice", Number(formData.basePrice) || 0);
      newData.append("status", formData.status);
      newData.append("slug", generatedSlug);

      // FIX LỖI categoryId tại đây:
      const finalCategoryId = formData.categoryId?._id || formData.categoryId;
      if (!finalCategoryId || finalCategoryId === "undefined") {
        toast.error("Danh mục không hợp lệ");
        return;
      }
      newData.append("categoryId", finalCategoryId);

      newData.append("isFeatured", formData.isFeatured);

      if (formData.image instanceof File) {
        newData.append("image", formData.image);
      }

      // 1. Cập nhật thông tin sản phẩm chính
      await updateProduct(productId, newData);

      // 2. Cập nhật các biến thể (Variants)
      if (formData.variants && formData.variants.length > 0) {
        const variantsPromise = formData.variants.map((variant) => {
          const vId = variant._id || variant.id;
          if (!vId) return Promise.resolve(); // Bỏ qua nếu variant không có ID

          const vData = new FormData();
          vData.append("productId", productId);
          vData.append("sku", variant.sku || "");
          vData.append("price", Number(variant.price) || 0);
          vData.append("stock", Number(variant.stock) || 0);
          vData.append("isDefault", String(variant.isDefault)); // FormData nên gửi string

          // Gửi attributes dưới dạng chuỗi JSON (Nhớ check Backend đã có JSON.parse chưa)
          vData.append("attributes", JSON.stringify(variant.attributes || {}));

          if (variant.compareAtPrice) {
            vData.append("compareAtPrice", Number(variant.compareAtPrice));
          }

          if (variant.image instanceof File) {
            vData.append("image", variant.image);
          }

          return updateVariants(vData, vId);
        });

        await Promise.all(variantsPromise);
      }

      toast.update(toastLoading, {
        render: "Cập nhật sản phẩm và biến thể thành công! 🎉",
        type: "success",
        isLoading: false, // Quan trọng: Tắt icon xoay xoay
        autoClose: 3000, // Thanh progress bắt đầu chạy từ đây
      });

      await onSave();
      onClose(); // Đóng modal/form sau khi thành công
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      // 4. Cập nhật Toast cũ thành Error
      toast.update(toastLoading, {
        render: "Thất bại: " + (error.message || "Đã có lỗi xảy ra"),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#12181f] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 pb-0 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="inline-block px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 mb-2">
            <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase">
              ● Edit Mode
            </span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Sửa Sản phẩm
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Chỉnh sửa thông tin sản phẩm hiện có trong hệ thống.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                Trạng thái công khai
              </span>
              <div className="w-10 h-5 bg-cyan-500 rounded-full relative shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex gap-6 mt-8 border-b border-white/5">
            {[
              {
                id: "general",
                label: "Thông tin chung",
                icon: <Info size={16} />,
              },
              {
                id: "images",
                label: "Hình ảnh",
                icon: <ImageIcon size={16} />,
              },
              {
                id: "category",
                label: "Danh mục",
                icon: <LayoutGrid size={16} />,
              },
              { id: "variants", label: "Biến thể", icon: <Layers size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? "text-cyan-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto flex-1 flex flex-col"
        >
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "general" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Tên sản phẩm <span className="text-red-400">*</span>
                      </label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        type="text"
                        placeholder="Nhập tên sản phẩm..."
                        className={`w-full bg-white/5 border rounded-lg p-3 text-white focus:outline-none transition-colors ${
                          errors.name
                            ? "border-red-500/70 focus:border-red-500"
                            : "border-white/10 focus:border-cyan-500/50"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                          Giá sản phẩm (VNĐ)
                          <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            value={formData.basePrice}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                basePrice: e.target.value,
                              });
                              if (errors.basePrice)
                                setErrors({ ...errors, basePrice: "" });
                            }}
                            type="number"
                            min="0"
                            placeholder="0"
                            className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full bg-white/5 border rounded-lg p-3 text-white focus:outline-none transition-colors ${
                              errors.basePrice
                                ? "border-red-500/70 focus:border-red-500"
                                : "border-white/10 focus:border-cyan-500/50"
                            }`}
                          />
                          <span className="absolute right-3 top-3.5 text-gray-500 text-sm">
                            ₫
                          </span>
                        </div>
                        {errors.basePrice && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.basePrice}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                          Danh mục <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <select
                            required
                            value={formData.categoryId}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                categoryId: e.target.value,
                              });
                              if (errors.categoryId)
                                setErrors({ ...errors, categoryId: "" });
                            }}
                            disabled={loadingCats}
                            className={`w-full bg-[#1a202c] border rounded-lg p-3 text-white appearance-none focus:outline-none transition-colors disabled:opacity-50 ${
                              errors.categoryId
                                ? "border-red-500/70 focus:border-red-500"
                                : "border-white/10 focus:border-cyan-500/50"
                            }`}
                          >
                            <option value="" disabled>
                              {loadingCats
                                ? "Đang tải..."
                                : "-- Chọn danh mục --"}
                            </option>
                            {categories.map((cat) => (
                              <option
                                key={cat._id}
                                value={cat._id}
                                className="bg-[#1a202c]"
                              >
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute right-3 top-3.5 text-gray-500 pointer-events-none"
                            size={18}
                          />
                        </div>
                        {errors.categoryId && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.categoryId}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Mô tả chi tiết
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Nhập mô tả sản phẩm..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Tab: Hình ảnh - giữ nguyên */}
                {activeTab === "images" && (
                  <div className="space-y-4">
                    <input
                      type="file"
                      id="product-image"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({ ...formData, image: file });
                        }
                      }}
                    />
                    <label
                      htmlFor="product-image"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-12 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-all"
                    >
                      <div className="p-4 bg-cyan-500/10 rounded-full mb-4">
                        <Upload className="text-cyan-400" size={32} />
                      </div>
                      <p className="text-white font-medium">
                        {formData.image instanceof File
                          ? formData.image.name
                          : "Tải lên hình ảnh sản phẩm"}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        PNG, JPG tối đa 5MB
                      </p>
                    </label>

                    {/* Thay đổi quan trọng ở đây: dùng 'preview' thay vì gọi hàm URL.createObjectURL */}
                    {previewUrl && (
                      <div className="relative w-full rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={previewUrl}
                          alt="previewUrl"
                          className="w-full max-h-48 object-contain bg-white/5"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, image: null })
                          }
                          className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 text-white rounded-full p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Biến thể - giữ nguyên */}
                {activeTab === "variants" && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Header & Nút Thêm */}
                    <div className="flex justify-between items-end">
                      <div>
                        <label className="block text-[11px] font-bold text-cyan-500/80 uppercase tracking-[0.2em] mb-1">
                          Cấu hình biến thể
                        </label>
                        <p className="text-[10px] text-gray-500 italic">
                          Quản lý SKU, giá bán và thuộc tính riêng biệt cho từng
                          phiên bản
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="group text-[11px] font-bold px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center gap-2 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-lg shadow-cyan-500/5"
                      >
                        <Plus
                          size={16}
                          className="group-hover:rotate-90 transition-transform duration-300"
                        />
                        THÊM BIẾN THỂ
                      </button>
                    </div>

                    {/* Danh sách cuộn */}
                    <div className="max-h-[450px] overflow-y-auto pr-3 space-y-4 custom-scrollbar">
                      {formData.variants.map((v, index) => (
                        <div
                          key={v.id || index}
                          className={`relative group border rounded-2xl p-5 transition-all duration-300 ${
                            v.isDefault
                              ? "bg-cyan-500/[0.03] border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                              : "bg-[#16191d] border-white/5 hover:border-white/20"
                          }`}
                        >
                          {/* Header Card: SKU & Actions */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center justify-center w-6 h-6 text-[10px] font-black bg-white/5 border border-white/10 rounded-lg text-gray-400">
                                {index + 1}
                              </span>
                              <div className="relative">
                                <input
                                  value={v.sku}
                                  onChange={(e) =>
                                    updateVariant(v.id, "sku", e.target.value)
                                  }
                                  placeholder="MÃ SKU (VD: IP15-PRO-BLK)"
                                  className="bg-transparent border-b border-white/10 py-1 text-xs font-mono text-cyan-400 w-64 focus:border-cyan-500 outline-none transition-all placeholder:text-gray-700"
                                />
                                <div className="absolute -bottom-[1px] left-0 w-0 h-[1px] bg-cyan-500 group-hover:w-full transition-all duration-500"></div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <label className="flex items-center gap-2 cursor-pointer group/label">
                                <div className="relative flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={v.isDefault}
                                    onChange={(e) =>
                                      updateVariant(
                                        v.id,
                                        "isDefault",
                                        e.target.checked,
                                      )
                                    }
                                    className="peer appearance-none w-4 h-4 rounded border border-white/20 bg-white/5 checked:bg-cyan-500 checked:border-cyan-500 transition-all cursor-pointer"
                                  />
                                  <Check
                                    size={10}
                                    className="absolute left-0.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                  />
                                </div>
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest group-hover/label:text-white transition-colors">
                                  Mặc định
                                </span>
                              </label>

                              <button
                                type="button"
                                onClick={() => removeVariant(v.id)}
                                className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          {/* Body Card */}
                          <div className="grid grid-cols-12 gap-6">
                            {/* Left: Financials */}
                            <div className="col-span-8 grid grid-cols-3 gap-4">
                              {[
                                {
                                  label: "Giá bán",
                                  key: "price",
                                  placeholder: "0.00",
                                },
                                {
                                  label: "Tồn kho",
                                  key: "stock",
                                  placeholder: "0",
                                },
                                {
                                  label: "Giá gốc",
                                  key: "compareAtPrice",
                                  placeholder: "0.00",
                                },
                              ].map((field) => (
                                <div key={field.key} className="space-y-2">
                                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                                    {field.label}
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      value={v[field.key] || ""}
                                      onChange={(e) =>
                                        updateVariant(
                                          v.id,
                                          field.key,
                                          e.target.value,
                                        )
                                      }
                                      placeholder={field.placeholder}
                                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500/50 outline-none transition-all"
                                    />
                                  </div>
                                </div>
                              ))}

                              {/* Attributes: Dạng Tag UI */}
                              <div className="col-span-3 space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                                  Thuộc tính định dạng (Key-Value)
                                </label>
                                <div className="flex flex-wrap gap-2 p-3 bg-black/20 border border-dashed border-white/10 rounded-xl min-h-[42px]">
                                  {v.attributes &&
                                    Object.entries(v.attributes).map(
                                      ([key, val]) => (
                                        <span
                                          key={key}
                                          className="flex items-center gap-1.5 bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-1 rounded-md border border-cyan-500/20"
                                        >
                                          <span className="opacity-60">
                                            {key}:
                                          </span>{" "}
                                          {String(val)}
                                          <X
                                            size={10}
                                            className="cursor-pointer hover:text-white"
                                            onClick={() => {
                                              const newAttr = {
                                                ...v.attributes,
                                              };
                                              delete newAttr[key];
                                              updateVariant(
                                                v.id,
                                                "attributes",
                                                newAttr,
                                              );
                                            }}
                                          />
                                        </span>
                                      ),
                                    )}
                                  <input
                                    placeholder="+ Thêm (VD: Color:Red)"
                                    className="bg-transparent border-none text-[10px] text-gray-400 outline-none w-32"
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        e.target.value.includes(":")
                                      ) {
                                        const [key, val] =
                                          e.target.value.split(":");
                                        updateVariant(v.id, "attributes", {
                                          ...v.attributes,
                                          [key.trim()]: val.trim(),
                                        });
                                        e.target.value = "";
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Right: Image Dropzone */}
                            <div className="col-span-4 space-y-2">
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-tighter block text-center">
                                Ảnh phiên bản
                              </label>
                              <div className="relative group/img h-[105px] bg-white/[0.02] border-2 border-dashed border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all cursor-pointer">
                                {v.image ? (
                                  <div className="relative w-full h-full">
                                    <img
                                      src={
                                        typeof v.image === "string"
                                          ? v.image
                                          : URL.createObjectURL(v.image)
                                      }
                                      className="w-full h-full object-cover opacity-60 group-hover/img:scale-110 transition-transform duration-500"
                                      alt="variant"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                      <label className="cursor-pointer text-[10px] font-bold text-white bg-cyan-500 px-3 py-1 rounded-full">
                                        THAY ĐỔI
                                      </label>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-full gap-2">
                                    <ImagePlus
                                      size={20}
                                      className="text-gray-700 group-hover/img:text-cyan-500 transition-colors"
                                    />
                                    <span className="text-[9px] text-gray-600">
                                      Upload Image
                                    </span>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    updateVariant(
                                      v.id,
                                      "image",
                                      e.target.files[0],
                                    )
                                  }
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {formData.variants.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Box size={24} className="text-gray-700" />
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            Chưa có biến thể nào được khởi tạo
                          </p>
                          <button
                            onClick={addVariant}
                            className="mt-4 text-[10px] text-cyan-400 hover:underline"
                          >
                            Nhấp để thêm mới
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}
