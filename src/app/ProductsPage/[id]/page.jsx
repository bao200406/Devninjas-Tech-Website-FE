"use client";

import Breadcrumb from "@/components/ProductDetail/Breadcrumb";
import ProductGallery from "@/components/ProductDetail/ProductGallery";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import ProductTabs from "@/components/ProductDetail/ProductTabs";
import RelatedProducts from "@/components/ProductDetail/RelatedProducts";

export default function ProductDetailPage() {
  return (
    <div className="bg-app-bg min-h-screen w-full font-sans antialiased">
      {/* ĐỒNG BỘ TUYỆT ĐỐI VỚI HEADER VÀ FOOTER:
          Sử dụng duy nhất "container mx-auto px-4" để tạo điểm dóng lề trái/phải đồng nhất.
          Xóa bỏ các class padding tĩnh cũ để không gian trang được bung đều đặn nhịp nhàng.
      */}
      <div className="container mx-auto px-4 py-8 flex flex-col gap-10">
        
        {/* Section 1: Breadcrumb (Dóng thẳng hàng tăm tắp với Logo) */}
        <div className="w-full">
          <Breadcrumb />
        </div>

        {/* Section 2: Khối nội dung chính (Ảnh lớn + Mua hàng)
            - Chia tỷ lệ 7:5 (Gallery chiếm 7 phần rộng rãi để ảnh iPhone phình to sắc nét, Info chiếm 5 phần).
            - items-start kết hợp lg:sticky (ở khối Info con) sẽ giúp giữ nút Mua luôn trong tầm mắt.
            - justify-start và justify-end ép 2 khối dạt về 2 biên của "bờ đê" container.
         */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          <div className="lg:col-span-7 w-full flex justify-start">
            <ProductGallery />
          </div>
          
          {/* BỔ SUNG CHIẾN LƯỢC STICKY TẠI ĐÂY:
              - lg:sticky: Chỉ kích hoạt bám dính trên các màn hình lớn (Desktop).
              - lg:top-24: Khoảng đệm an toàn từ mép trên trình duyệt xuống form chữ là 96px, 
                giúp khối thông tin không bị che mất hoặc dính chặt vào Header trắng của bạn.
          */}
          <div className="lg:col-span-5 w-full flex justify-end lg:sticky lg:top-24">
            <ProductInfo />
          </div>
        </section>

        {/* Section 3: Khối Tabs nội dung chi tiết phía dưới - Dàn đều kịch khung */}
        <section className="w-full border-t border-gray-200/70 pt-8 mt-2">
          <ProductTabs />
        </section>

        {/* Section 4: Sản phẩm tương tự - Bung trải đều ra 2 biên cạnh */}
        <section className="w-full border-t border-gray-200/70 pt-8 mb-6">
          <RelatedProducts />
        </section>

      </div>
    </div>
  );
}