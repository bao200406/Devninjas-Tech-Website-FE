import ProductCard from "../ui/ProductCard";

export default function ProductSection({ title, products, showCart = false }) {
  // Nếu không truyền mảng sản phẩm, sử dụng dữ liệu mẫu
  const displayProducts = products || [
    { name: "MacBook Pro M2", price: "31.990.000đ", rating: 5.0, tag: title === "SẢN PHẨM MỚI" ? "MỚI" : null },
    { name: "MacBook Pro M2", price: "31.990.000đ", rating: 5.0, tag: title === "SẢN PHẨM MỚI" ? "MỚI" : null },
    { name: "MacBook Pro M2", price: "31.990.000đ", rating: 5.0, tag: title === "SẢN PHẨM MỚI" ? "MỚI" : null },
    { name: "MacBook Pro M2", price: "31.990.000đ", rating: 5.0, tag: title === "SẢN PHẨM MỚI" ? "MỚI" : null },
  ];

  

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button className="text-xs font-bold text-blue-700 hover:underline">XEM TẤT CẢ</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayProducts.map((p, i) => (
            <ProductCard 
              key={i} 
              name={p.name}
              price={p.price}
              rating={p.rating}
              tag={p.tag}
              soldCount={p.soldCount} // Truyền thêm số lượng đã bán
              showCart={showCart}     // Truyền biến ẩn/hiện giỏ hàng
            />
          ))}
        </div>
      </div>
    </section>
  );
}