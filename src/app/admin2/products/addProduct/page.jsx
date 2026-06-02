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
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createProduct } from "../../../../services/productService";
import { getAllCategories } from "../../../../services/categoryService";
import { createVariants } from "../../../../services/variantsService";
import { getAllBrands } from "../../../../services/brandService";

export default function NewProductPage({ onSave }) {
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productOptions, setProductOptions] = useState([
    { name: "Màu sắc", values: [] },
  ]);

  // Hàm thêm một nhóm thuộc tính mới (Dùng cho nút "Thêm thuộc tính")
  const addOptionGroup = () => {
    setProductOptions([...productOptions, { name: "Kích cỡ", values: [] }]);
  };

  // Hàm xóa một nhóm thuộc tính
  const removeOptionGroup = (index) => {
    const newOptions = productOptions.filter((_, i) => i !== index);
    setProductOptions(newOptions);
  };

  // Hàm thêm giá trị khi nhấn Enter
  const handleAddTag = (optIdx, value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    const newOptions = [...productOptions];
    // Tránh trùng lặp giá trị trong cùng 1 nhóm
    if (!newOptions[optIdx].values.includes(trimmedValue)) {
      newOptions[optIdx].values.push(trimmedValue);
      setProductOptions(newOptions);
    }
  };

  // Hàm xóa một tag giá trị
  const removeTag = (optIdx, valIdx) => {
    const newOptions = [...productOptions];
    newOptions[optIdx].values.splice(valIdx, 1);
    setProductOptions(newOptions);
  };

  const [loadingCats, setLoadingCats] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    brandId: "",
    slug: "",
    image: null,
    status: "Active",
    isFeatured: false,
    variants: [
      {
        sku: "",
        isActive: true,
        price: "",
        compareAtPrice: "",
        stock: 0,
        attributes: {},
        image: null,
        isDefault: false,
      },
    ],
  });

  const initialState = {
    name: "",
    description: "",
    basePrice: "",
    categoryId: "",
    brandId: "",
    slug: "",
    image: null,
    status: "Active",
    isFeatured: false,
    variants: [
      {
        id: crypto.randomUUID(), // Nên tạo ID ngay từ đầu để tránh lỗi "key" prop
        sku: "",
        price: "",
        isActive: true,
        compareAtPrice: "",
        stock: 0,
        attributes: "", // Chỉnh lại thành chuỗi nếu bạn dùng input text
        image: null,
        isDefault: false,
      },
    ],
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
      setLoadingCats(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      const data = await getAllBrands();
      setBrands(data);
    };
    fetchBrands();
  }, []);

  const [variants, setVariants] = useState([
    { id: 1, key: "Size", value: "M", sku: "", price: "", stock: "" },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now(), key: "", value: "", sku: "", price: "", stock: "" },
    ]);
  };

  const removeVariant = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
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

  // Hàm xử lý cập nhật từng ô input trong bảng biến thể
  const handleUpdateVariant = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleVariantImageChange = (index, file) => {
    if (!file) return;

    const newVariants = [...formData.variants];
    // Giải phóng bộ nhớ preview cũ nếu có
    if (newVariants[index].preview) {
      URL.revokeObjectURL(newVariants[index].preview);
    }

    newVariants[index] = {
      ...newVariants[index],
      image: file, // Gửi lên backend
      preview: URL.createObjectURL(file), // Hiển thị UI
    };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleAddValue = (optionIndex, newValue) => {
    if (!newValue.trim()) return;

    const updatedOptions = [...productOptions];
    // Tránh trùng lặp
    if (!updatedOptions[optionIndex].values.includes(newValue.trim())) {
      updatedOptions[optionIndex].values.push(newValue.trim());
      setProductOptions(updatedOptions);
      // Sau khi update options, hàm useEffect (ở bước 3) sẽ tự tạo lại variants
    }
  };

  useEffect(() => {
    // Hàm tạo tổ hợp (Cartesian Product)
    const generateVariants = (options) => {
      return options.reduce((acc, curr) => {
        if (curr.values.length === 0) return acc;
        if (acc.length === 0) {
          return curr.values.map((val) => ({
            price: formData.basePrice || 0,
            stock: 0,
            sku: "",
            isActive: true,
            attributes: { [curr.name]: val }, // GÁN ATTRIBUTES Ở ĐÂY
            image: null,
          }));
        }
        return acc.flatMap((variant) =>
          curr.values.map((val) => ({
            ...variant,
            attributes: { ...variant.attributes, [curr.name]: val },
          })),
        );
      }, []);
    };

    const newVariants = generateVariants(productOptions);
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  }, [productOptions]);

  const validateProduct = (formData) => {
    const errors = [];

    if (formData.variants.length === 0) {
      errors.push("Bạn chưa có biến thể nào cho sản phẩm này");
    }

    formData.variants.forEach((variant, index) => {
      if (!variant.sku || variant.sku.trim() === "") {
        errors.push(`Biến thể thứ ${index + 1} đang thiếu mã SKU`);
      }
      if (variant.price <= 0) {
        errors.push(`Biến thể thứ ${index + 1} phải có giá lớn hơn 0`);
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. VALIDATION CƠ BẢN (Chặn sớm để tránh bật loading vô ích)
    if (!formData.name.trim())
      return toast.error("Tên sản phẩm không được để trống");
    if (!formData.categoryId) return toast.error("Vui lòng chọn danh mục");
    if (!formData.brandId) return toast.error("Vui lòng chọn Thương hiệu");
    if (!formData.basePrice || Number(formData.basePrice) < 0)
      return toast.error("Giá không hợp lệ");

    if (!formData.variants || formData.variants.length === 0) {
      return toast.error(
        "Vui lòng nhập thuộc tính để tạo ít nhất một biến thể!",
      );
    }

    const isInvalid = formData.variants.some((v) => !v.sku || !v.price);
    if (isInvalid) {
      return toast.error("Vui lòng điền đầy đủ SKU và Giá cho tất cả biến thể");
    }

    // Validate chuyên sâu (Nếu có lỗi thì thoát luôn trước khi setSubmitting)
    const clientErrors = validateProduct(formData);
    if (clientErrors.length > 0) return toast.error(clientErrors[0]);

    // 2. BẮT ĐẦU QUÁ TRÌNH LƯU
    setIsSubmitting(true);
    const toastId = toast.loading("Đang khởi tạo sản phẩm...");

    try {
      const dataToSend = new FormData();

      // Tính tổng tồn kho & Tạo Slug
      const totalStock = formData.variants.reduce(
        (acc, v) => acc + (Number(v.stock) || 0),
        0,
      );
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Append dữ liệu chính
      Object.entries({
        name: formData.name.trim(),
        stock: totalStock,
        description: formData.description,
        basePrice: Number(formData.basePrice),
        status: formData.status,
        slug: generatedSlug,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        isFeatured: formData.isFeatured,
      }).forEach(([key, value]) => dataToSend.append(key, value));

      if (formData.image) dataToSend.append("image", formData.image);

      // BƯỚC 1: TẠO SẢN PHẨM CHÍNH
      const createdProduct = await createProduct(dataToSend);
      const productId = createdProduct._id;

      // BƯỚC 2: TẠO CÁC BIẾN THỂ (Chạy song song)
      const variantsPromise = formData.variants.map((variant) => {
        const vData = new FormData();
        vData.append("productId", productId);
        vData.append("sku", variant.sku);
        vData.append("price", Number(variant.price));
        vData.append("stock", Number(variant.stock));
        vData.append("isDefault", !!variant.isDefault); // Ép kiểu boolean
        vData.append("isActive", variant.isActive ?? true); // Nullish coalescing
        vData.append("attributes", JSON.stringify(variant.attributes));

        if (variant.compareAtPrice)
          vData.append("compareAtPrice", Number(variant.compareAtPrice));
        if (variant.image) vData.append("image", variant.image);

        return createVariants(vData);
      });

      await Promise.all(variantsPromise);

      // BƯỚC 3: HOÀN TẤT
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.dismiss(toastId);
      toast.success("Sản phẩm và các biến thể đã được tạo thành công! 🎉");
      setFormData(initialState);
    } catch (error) {
      toast.dismiss(toastId);
      const serverMessage = error.response?.data?.message || error.message;
      toast.error("Thất bại: " + serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full mx-auto pb-20 px-4 lg:px-8">
      {/* Breadcrumb */}

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
        {/* CỘT TRÁI - CHIẾM 9 CỘT */}
        <div className="lg:col-span-9 w-full space-y-8">
          {/* 1. KHỐI THÔNG TIN CƠ BẢN */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold text-slate-800">
                Thông tin cơ bản
              </h3>
            </div>

            <div className="space-y-6">
              {/* Tên sản phẩm */}
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

              {/*giá sản phẩm */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-600">
                    Giá sản phẩm <span className="text-rose-500">*</span>
                  </label>
                  {/* <span className="text-xs text-slate-400 font-medium">
                    {formData.name.length} / 150
                  </span> */}
                </div>
                <input
                  type="text"
                  maxLength={150}
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                  placeholder="Nhập giá sản phẩm..."
                  className="w-full px-4 py-3 bg-[#F9F9F9] border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-slate-400 transition-all placeholder:text-slate-300"
                />
              </div>

              {/* Mô tả sản phẩm */}
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

              {/* Row: Danh mục & Thương hiệu (Cả 2 đều là Select) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Danh mục */}
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
                      {categories.map((cat) => (
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

                {/* Thương hiệu (Đã sửa thành Select) */}
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
                      {brands.map((brand) => (
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

          {/* 2. KHỐI HÌNH ẢNH SẢN PHẨM (FULL WIDTH) */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <ImageIconLucide className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold text-slate-800">
                Hình ảnh sản phẩm
              </h3>
            </div>

            <div className="space-y-4">
              {/* Khu vực Dropzone / Upload Full Width */}
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

              {/* Khu vực hiển thị Preview - Hiển thị ngay dưới nút bấm */}
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
                    {/* Label định danh ảnh chính */}
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

          {/* 2. KHỐI PHIÊN BẢN (Variants) */}
          {/* 3. KHỐI BIẾN THỂ SẢN PHẨM */}
          <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="text-slate-400" size={20} />
                <h3 className="text-lg font-bold text-slate-800">
                  Biến thể sản phẩm
                </h3>
              </div>
              <button
                type="button"
                onClick={addOptionGroup}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase hover:bg-slate-800 transition-all active:scale-95"
              >
                <Plus size={16} /> Thêm thuộc tính
              </button>
            </div>

            {/* GIAI ĐOẠN 1: THIẾT LẬP THUỘC TÍNH (OPTIONS) */}
            <div className="space-y-4">
              {productOptions.map((option, optIdx) => (
                <div
                  key={optIdx}
                  className="p-6 bg-[#F9F9F9] rounded-[20px] border border-slate-100 space-y-6 animate-in fade-in duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Tên thuộc tính */}
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Thuộc tính
                      </label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-slate-400 cursor-pointer"
                          value={option.name}
                          onChange={(e) => {
                            const newOpts = [...productOptions];
                            newOpts[optIdx].name = e.target.value;
                            setProductOptions(newOpts);
                          }}
                        >
                          <option value="Màu sắc">Màu sắc</option>
                          <option value="Kích cỡ">Kích cỡ</option>
                          <option value="Chất liệu">Chất liệu</option>
                          <option value="Dung lượng">Dung lượng</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          size={16}
                        />
                      </div>
                    </div>

                    {/* Giá trị thuộc tính (Tags) */}
                    <div className="md:col-span-8 space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Giá trị
                      </label>
                      <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-200 rounded-xl min-h-[46px] transition-all focus-within:border-slate-400">
                        {option.values.map((val, valIdx) => (
                          <span
                            key={valIdx}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold animate-in zoom-in duration-200"
                          >
                            {val}
                            <button
                              type="button"
                              onClick={() => removeTag(optIdx, valIdx)}
                              className="hover:text-rose-400 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Nhập giá trị và nhấn Enter..."
                          className="flex-1 min-w-[150px] px-3 text-sm font-medium outline-none bg-transparent"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Ngăn form submit linh tinh
                              handleAddTag(optIdx, e.target.value);
                              e.target.value = ""; // Clear input sau khi thêm
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Nút xóa thuộc tính */}
                    <div className="md:col-span-1 pt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() => removeOptionGroup(optIdx)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* GIAI ĐOẠN 2: BẢNG BIẾN THỂ (MATRIX TABLE) */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Danh sách phiên bản ({formData.variants.length})
                </h4>
                <button
                  type="button"
                  className="group flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg"
                >
                  <Settings2
                    size={13}
                    className="group-hover:rotate-45 transition-transform"
                  />
                  Chỉnh sửa hàng loạt
                </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left table-fixed">
                  {/* Dùng table-fixed để kiểm soát pixel tuyệt đối */}
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="w-[30%] px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Phiên bản
                      </th>
                      <th className="w-[18%] px-2 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Giá bán ($)
                      </th>
                      <th className="w-[15%] px-2 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Kho
                      </th>
                      <th className="w-[22%] px-2 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Mã SKU
                      </th>
                      <th className="w-[15%] px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Action
                      </th>
                      <th className="w-[15%] px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {formData.variants.map((variant, index) => (
                      <tr
                        key={index}
                        className="hover:bg-indigo-50/30 transition-colors group"
                      >
                        {/* CỘT 1: THÔNG TIN & ẢNH */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="relative w-10 h-10 flex-shrink-0 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group/img"
                              onClick={() =>
                                document
                                  .getElementById(`variant-image-${index}`)
                                  .click()
                              }
                            >
                              {variant.preview || variant.image ? (
                                <img
                                  src={
                                    variant.preview ||
                                    (typeof variant.image === "string"
                                      ? variant.image
                                      : "")
                                  }
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <ImageIconLucide
                                  size={14}
                                  className="text-slate-400"
                                />
                              )}
                              <input
                                type="file"
                                id={`variant-image-${index}`}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) =>
                                  handleVariantImageChange(
                                    index,
                                    e.target.files[0],
                                  )
                                }
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                <Plus size={12} className="text-white" />
                              </div>
                            </div>
                            <span className="text-[13px] font-bold text-slate-700 truncate">
                              {variant.attributes
                                ? Object.values(variant.attributes).join(" / ")
                                : "Mặc định"}
                            </span>
                          </div>
                        </td>

                        {/* CỘT 2: GIÁ BÁN */}
                        <td className="px-2 py-3">
                          <div className="relative max-w-[100px] mx-auto">
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) =>
                                handleUpdateVariant(
                                  index,
                                  "price",
                                  e.target.value,
                                )
                              }
                              className="w-full pl-2 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-black text-center outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 ring-indigo-500/10 transition-all"
                            />
                          </div>
                        </td>

                        {/* CỘT 3: KHO HÀNG */}
                        <td className="px-2 py-3">
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) =>
                              handleUpdateVariant(
                                index,
                                "stock",
                                e.target.value,
                              )
                            }
                            className="w-16 mx-auto block py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-bold text-center outline-none focus:bg-white focus:border-indigo-500 transition-all"
                          />
                        </td>

                        {/* CỘT 4: SKU */}
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            placeholder="SKU-..."
                            value={variant.sku}
                            onChange={(e) =>
                              handleUpdateVariant(index, "sku", e.target.value)
                            }
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-mono font-bold text-center outline-none focus:bg-white focus:border-indigo-500 uppercase transition-all"
                          />
                        </td>

                        {/* CỘT 5: THAO TÁC & TRẠNG THÁI GOM NHÓM */}

                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const newVariants = formData.variants.filter(
                                (_, i) => i !== index,
                              );
                              setFormData({
                                ...formData,
                                variants: newVariants,
                              });
                            }}
                            className="p-1.5 text-slate-300 hover:text-rose-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateVariant(
                                index,
                                "isActive",
                                !variant.isActive,
                              )
                            }
                            className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-all duration-300 ${variant.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${variant.isActive ? "translate-x-4" : "translate-x-1"}`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI - CHIẾM 3 CỘT */}
        {/* CỘT PHẢI - CHIẾM 3 CỘT */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm  sticky top-6">
            {/* 1. TRẠNG THÁI XUẤT BẢN */}
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

            {/* 2. TAGS (NHÃN SẢN PHẨM) */}
            {/* <div className="space-y-4 pt-6 border-t border-slate-50">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Tags / Nhãn
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Thêm nhãn (Enter...)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white transition-all"
                /> */}
            {/* <div className="flex flex-wrap gap-2"> */}
            {/* Ví dụ Tag mẫu */}
            {/* {["New Arrival", "Sale"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1"
                    >
                      {tag}{" "}
                      <X
                        size={10}
                        className="cursor-pointer hover:text-rose-500"
                      />
                    </span>
                  ))}
                </div> */}
            {/* </div>
            </div> */}

            {/* 3. NÚT HÀNH ĐỘNG (Lưu ở dưới cùng Sidebar) */}
            <div className="space-y-3 pt-6 border-t border-slate-50">
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
