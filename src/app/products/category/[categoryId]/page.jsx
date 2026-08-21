"use client";
import { useState, useEffect, use } from "react"; 
import FilterSidebar from "../../../../components/CategoryProductCard/FilterSidebar";
import CategoryProductCard from "../../../../components/CategoryProductCard/ProductList";
import Pagination from "../../../../components/ui/Pagination";
import { X, ChevronDown, LayoutGrid, List, Filter } from "lucide-react"; 
import { getProductsByCategory } from "../../../../services/productService"; // Đảm bảo import đúng đường dẫn service của bạn
import ProductCard from "../../../../components/ui/ProductCard";

export default function ProductsPage({ params }) {
  // State quản lý trạng thái sidebar trên mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({ 
    minPrice: null, 
    maxPrice: 20000000, 
    attributeValueIds: [] 
  });
  
  // State quản lý dữ liệu sản phẩm
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Lấy categoryId từ params (giả sử cấu trúc thư mục là category/[categoryId])
  const { categoryId } = use(params);
  const categoryName =
  products.length > 0 ? products[0].categoryId.name : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFilters({ minPrice: null, maxPrice: 20000000, attributeValueIds: [] });
        setLoading(true);
        const data = await getProductsByCategory(categoryId);
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);


  // 2. Hàm áp dụng bộ lọc (gọi lại API)
  const handleApplyFilter = async () => {
    setIsFilterOpen(false); // Đóng sidebar
    // Gọi hàm fetch sản phẩm với state filters hiện tại
    const data = await getProductsByCategory(categoryId, 1, 8, filters);
    setProducts(data.products); // Cập nhật danh sách hiển thị
  };

  // 3. Hàm reset bộ lọc
  const handleResetFilter = async () => {
    const resetFilters = { minPrice: null, maxPrice: 20000000, attributeValueIds: [] };
    setFilters(resetFilters);
    const data = await getProductsByCategory(categoryId, 1, 8, resetFilters);
    setProducts(data.products);
  };

  return (
    <div className="bg-app-bg min-h-screen p-4 md:p-8">

      {/* Container: Sử dụng flex-col trên mobile, flex-row trên desktop */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 flex-wrap">
        
        {/* Breadcrumb */}
        <div className="w-full text-sm text-gray-400 mb-2 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          <span className="hover:text-gray-600 cursor-pointer">Trang chủ</span>
          <span>›</span>
          <span className="hover:text-gray-600 cursor-pointer">Danh mục</span>
          <span>›</span>
          <span className="text-gray-700 font-medium">
            {products.length > 0 ? products[0].categoryId.name : "Đang tải..."}
          </span>
        </div>
        
        {/* Nút mở bộ lọc trên mobile */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700"
        >
          <Filter size={18} /> Lọc sản phẩm
        </button>

        {/* Sidebar: Ẩn trên mobile để tối ưu không gian, hiện trên lg */}
        <div className="hidden lg:block w-80 flex-shrink-0">
           <FilterSidebar 
            categoryId={categoryId}           // <--- Truyền thêm prop này
            categoryName={categoryName}     
            priceGroupName="desktop-price"
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)}
            filters={filters} 
            setFilters={setFilters} 
            onApply={handleApplyFilter} 
            onReset={handleResetFilter}
          />
        </div>
        
        {/* Lớp Overlay cho mobile khi sidebar mở */}
        {isFilterOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsFilterOpen(false)} />
        )}
        
        {/* Sidebar di động */}
        <div className="lg:hidden">
          <FilterSidebar 
            categoryId={categoryId}         // <--- Truyền thêm prop này
            categoryName={categoryName}     
            priceGroupName="mobile-price"
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)} 
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilter}
            onReset={handleResetFilter}
          />
        </div>

        {/* Nội dung chính */}
        <main className="flex-1 w-full">
            {/* Header danh mục */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Tiêu đề & Tag lọc */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {products.length > 0 ? products[0].categoryId.name : "Sản phẩm"}
                    </h1>
                    <span className="text-gray-500 text-sm">{totalProducts} sản phẩm</span>
                </div>
                
                <div className="flex gap-2">
                {['Apple', 'Trên 20tr'].map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-900 text-xs font-medium rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                    {tag}
                    <X size={12} strokeWidth={2.5} />
                    </span>
                ))}
                </div>
            </div>

            {/* Bộ lọc sắp xếp & View mode */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                <button className="flex items-center justify-between gap-4 sm:gap-8 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300">
                Mới nhất
                <ChevronDown size={16} className="text-gray-400" />
                </button>

                <div className="hidden md:flex bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                <button className="p-1.5 rounded bg-white text-blue-900 shadow-sm border border-gray-100">
                    <LayoutGrid size={18} />
                </button>
                <button className="p-1.5 rounded text-gray-400 hover:text-gray-600">
                    <List size={18} />
                </button>
                </div>
            </div>
            </div>

            {/* Grid sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
                <p className="text-gray-500">Đang tải sản phẩm...</p>
            ) : products.length === 0 ? (
                <div className="col-span-full py-16 text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    Không có sản phẩm này
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Vui lòng thử lại.
                  </p>
                </div>
            ) : (
                products.map((product) => (
                    <ProductCard // Bây giờ dùng chung 1 component ProductCard
                     key={product._id}
                      id={product._id}
                      name={product.name} // Đảm bảo product có trường name
                      price={product.basePrice} // Chỉ truyền số, không truyền chuỗi
                      rating={5}
                      soldCount={product.soldCount}
                      tag="MỚI"
                      image={product.image}
                    />
                ))
            )}
            </div>

            {/* Phân trang */}
            <Pagination />
        </main>
      </div>
    </div>
  );
}