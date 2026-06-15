import ProductCard from "../ui/ProductCard";

export default function ProductSection({ title, products, showCart = false, tag }) {
  // Thay vì dùng dữ liệu mẫu cứng, ta kiểm tra nếu có products thì dùng, không thì mảng rỗng
  // Điều này tránh lỗi khi API đang tải hoặc trả về rỗng
  const displayProducts = products || [];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button className="text-xs font-bold text-blue-700 hover:underline">XEM TẤT CẢ</button>
        </div>

        {/* Kiểm tra nếu không có sản phẩm thì thông báo hoặc không hiển thị gì cả */}
        {displayProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayProducts.map((p) => (
              <ProductCard 
                key={p._id} // Dùng ID từ DB là tốt nhất cho React key
                id={p._id}
                name={p.name}
                // Dùng giá trị số từ API, ProductCard sẽ tự format hiển thị
                price={p.basePrice} 
                rating={p.rating || 5} 
                // Truyền trực tiếp các thuộc tính từ API
                tag={tag || (p.isFeatured ? "NỔI BẬT" : null)} 
                soldCount={p.soldCount} 
                showCart={showCart}
                image={p.image} // Nhớ truyền thêm ảnh nếu ProductCard cần
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}