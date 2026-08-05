"use client";
import { useState, useEffect, use } from "react";
import { getVariantsByProduct } from "../../../services/productVariantService";
import { getProductById } from "../../../services/productService";
import Breadcrumb from "@/components/ProductDetail/Breadcrumb";
import ProductGallery from "@/components/ProductDetail/ProductGallery";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import ProductTabs from "@/components/ProductDetail/ProductTabs";
import RelatedProducts from "@/components/ProductDetail/RelatedProducts";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Tối ưu tốc độ: Gọi song song cả 2 API cùng lúc bằng Promise.all thay vì gọi lần lượt
        const [productRes, variantsRes] = await Promise.all([
          getProductById(id),
          getVariantsByProduct(id)
        ]);

        setProduct(productRes); 
        setVariants(variantsRes || []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Không tìm thấy sản phẩm!
      </div>
    );
  }

  return (
    <div className="bg-app-bg min-h-screen w-full font-sans antialiased">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-10">
        
        {/* Phần Breadcrumb phân cấp đã được đổ dữ liệu chuẩn xác từ API */}
        <div className="w-full">
          <Breadcrumb 
            category={product.categoryId} 
            brand={product.brandId} 
            productName={product.name} 
          />
        </div>

        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          <div className="lg:col-span-7 w-full flex justify-start">
            <ProductGallery variants={variants} selectedVariant={selectedVariant} />
          </div>
          
          <div className="lg:col-span-5 w-full flex justify-end lg:sticky lg:top-24">
            <ProductInfo 
              product={product} 
              variants={variants} 
              onVariantChange={(v) => setSelectedVariant(v)} 
            />
          </div>
        </section>

        <section className="w-full border-t border-gray-200/70 pt-8 mt-2">
          <ProductTabs product={product} productId={id} />
        </section>

        <section className="w-full border-t border-gray-200/70 pt-8 mb-6">
          <RelatedProducts />
        </section>
      </div>
    </div>
  );
}