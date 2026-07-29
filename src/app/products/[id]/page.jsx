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

  // NÂNG CẤP: Quản lý biến thể đang chọn
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await getProductById(id);
        const variantsRes = await getVariantsByProduct(id);

        // --- ĐẶT DEBUG Ở ĐÂY ---
        console.log("DEBUG [1. API Product Res]:", productRes);
        console.log("DEBUG [2. API Variants Res]:", variantsRes);

        setProduct(productRes); 
        setVariants(variantsRes);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Log debug 1: Kiểm tra giá trị của selectedVariant tại trang cha mỗi khi nó thay đổi
  useEffect(() => {
    console.log("DEBUG [Trang Cha]: Giá trị selectedVariant hiện tại là:", selectedVariant);
  }, [selectedVariant]);

  if (loading) return <div>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm!</div>;

  return (
    <div className="bg-app-bg min-h-screen w-full font-sans antialiased">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-10">
        
        <div className="w-full">
          <Breadcrumb />
        </div>

        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          <div className="lg:col-span-7 w-full flex justify-start">
            {/* Truyền selectedVariant vào Gallery */}
            <ProductGallery variants={variants} selectedVariant={selectedVariant}/>
          </div>
          
          <div className="lg:col-span-5 w-full flex justify-end lg:sticky lg:top-24">
            <ProductInfo 
              product={product} 
              variants={variants} 
              onVariantChange={(v) => {
                // Log debug 2: Kiểm tra tín hiệu truyền từ ProductInfo lên
                console.log("DEBUG [ProductInfo -> Cha]: Đã nhận được biến thể:", v);
                setSelectedVariant(v);
              }} 
            />
          </div>
        </section>

        <section className="w-full border-t border-gray-200/70 pt-8 mt-2">
          <ProductTabs product={product} productId={id}/>
        </section>

        <section className="w-full border-t border-gray-200/70 pt-8 mb-6">
          <RelatedProducts />
        </section>
      </div>
    </div>
  );
}