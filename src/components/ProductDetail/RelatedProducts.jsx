"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRelatedProducts } from '../../services/productService';
import SafeImage from '../image/SafeImage';

export default function RelatedProducts({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const controller = new AbortController();

    const fetchRelated = async () => {
      try {
        setLoading(true);
        const data = await getRelatedProducts(productId, { signal: controller.signal });
        if (data) setProducts(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Lỗi khi tải sản phẩm tương tự:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRelated();

    return () => controller.abort();
  }, [productId]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <h3 className="text-sm font-bold uppercase text-gray-900 tracking-wider">
        Sản phẩm tương tự
      </h3>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col w-full animate-pulse h-64">
              <div className="bg-gray-100 aspect-square rounded-xl w-full mb-3" />
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {products.map((prod) => {
            // Lấy ảnh chính xác từ dữ liệu JSON (trường "image")
            const productImage = prod.image || "";
            
            // Lấy giá chuẩn xác từ trường "basePrice" trong dữ liệu JSON
            const rawPrice = prod.basePrice;
            const productPrice = rawPrice ? rawPrice.toLocaleString() + 'đ' : '';

            return (
              <Link 
                href={`/products/${prod._id}`} 
                key={prod._id} 
                className="group bg-white p-4 rounded-2xl border border-gray-100/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Khung chứa ảnh gọn gàng, sử dụng SafeImage */}
                <div className="w-full h-44 bg-gray-50/50 rounded-xl flex items-center justify-center p-3 overflow-hidden relative border border-gray-50">
                  <SafeImage 
                    src={productImage} 
                    alt={prod.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                
                {/* Thông tin tên và giá */}
                <div className="mt-3.5 space-y-1">
                  <h4 className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed">
                    {prod.name}
                  </h4>
                  {productPrice && (
                    <p className="text-xs font-bold text-red-600">
                      {productPrice}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}