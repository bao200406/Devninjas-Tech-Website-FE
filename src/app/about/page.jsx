import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Headphones,
  Monitor,
  Mouse,
  Keyboard,
  ShieldCheck,
  Truck,
  Award,
  ShoppingBag,
} from "lucide-react";

const products = [
  {
    icon: Smartphone,
    title: "Điện thoại",
    description:
      "Các sản phẩm điện thoại phục vụ nhu cầu liên lạc, giải trí và sử dụng công nghệ hằng ngày.",
  },
  {
    icon: Laptop,
    title: "Laptop",
    description:
      "Laptop phù hợp cho học tập, làm việc, giải trí và các nhu cầu sử dụng cá nhân.",
  },
  {
    icon: Monitor,
    title: "Màn hình",
    description:
      "Các mẫu màn hình phục vụ học tập, làm việc, giải trí và nhu cầu gaming.",
  },
  {
    icon: Headphones,
    title: "Tai nghe",
    description:
      "Tai nghe và các thiết bị âm thanh dành cho giải trí, làm việc và chơi game.",
  },
  {
    icon: Mouse,
    title: "Chuột",
    description:
      "Các dòng chuột máy tính đáp ứng nhu cầu văn phòng, học tập và gaming.",
  },
  {
    icon: Keyboard,
    title: "Bàn phím",
    description:
      "Bàn phím với nhiều lựa chọn phù hợp cho công việc, học tập và giải trí.",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Sản phẩm đáng tin cậy",
    description:
      "Mang đến những sản phẩm công nghệ được lựa chọn phù hợp với nhu cầu sử dụng.",
  },
  {
    icon: Truck,
    title: "Giao hàng thuận tiện",
    description:
      "Hỗ trợ nhiều phương thức giao hàng để khách hàng dễ dàng nhận sản phẩm.",
  },
  {
    icon: Award,
    title: "Trải nghiệm mua sắm",
    description:
      "Không ngừng cải thiện trải nghiệm mua sắm trực tuyến cho khách hàng.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">

      {/* HEADER */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 xl:px-0 py-12">

          <p className="text-sm font-medium text-[#0052A3] mb-2">
            DEVNINJAS TECHNOLOGY STORE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Về DevNinjas
          </h1>

          <p className="text-gray-500 max-w-2xl leading-7">
            DevNinjas là cửa hàng chuyên cung cấp các sản phẩm công nghệ,
            mang đến cho khách hàng những lựa chọn phù hợp cho học tập,
            làm việc, giải trí và nhu cầu sử dụng hằng ngày.
          </p>

        </div>
      </section>

      {/* GIỚI THIỆU */}
      <section className="container mx-auto px-6 xl:px-0 py-12">

        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-10">

          <div className="flex items-start gap-5">

            <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShoppingBag
                size={28}
                className="text-[#0052A3]"
              />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                DevNinjas Technology Store
              </h2>

              <p className="text-gray-600 leading-7 mb-4">
                DevNinjas là cửa hàng công nghệ được xây dựng với mong muốn
                mang đến một không gian mua sắm trực tuyến hiện đại, thuận tiện
                và dễ sử dụng cho những người yêu thích công nghệ.
              </p>

              <p className="text-gray-600 leading-7 mb-4">
                Cửa hàng cung cấp nhiều nhóm sản phẩm công nghệ như điện thoại,
                laptop, màn hình, tai nghe, chuột, bàn phím và các phụ kiện
                công nghệ khác.
              </p>

              <p className="text-gray-600 leading-7">
                DevNinjas hướng đến việc giúp khách hàng dễ dàng tìm kiếm,
                lựa chọn và mua sắm sản phẩm phù hợp với nhu cầu của mình.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* SẢN PHẨM */}
      <section className="container mx-auto px-6 xl:px-0 pb-12">

        <div className="text-center mb-8">

          <p className="text-sm font-medium text-[#0052A3] mb-2">
            SẢN PHẨM
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Các sản phẩm công nghệ
          </h2>

          <p className="text-gray-500 mt-2">
            Những nhóm sản phẩm đang được cung cấp tại DevNinjas.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {products.map((product, index) => {
            const Icon = product.icon;

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >

                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5">
                  <Icon
                    size={24}
                    className="text-[#0052A3]"
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {product.title}
                </h3>

                <p className="text-sm text-gray-500 leading-6">
                  {product.description}
                </p>

              </div>
            );
          })}

        </div>

      </section>

      {/* GIÁ TRỊ */}
      <section className="container mx-auto px-6 xl:px-0 pb-12">

        <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10">

          <div className="text-center mb-8">

            <p className="text-sm font-medium text-[#0052A3] mb-2">
              DEVNINJAS
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Vì sao lựa chọn DevNinjas?
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {benefits.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="text-center"
                >

                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Icon
                      size={24}
                      className="text-[#0052A3]"
                    />
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-6">
                    {item.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 xl:px-0 pb-12">

        <div className="bg-[#0052A3] rounded-xl p-8 md:p-10 text-center text-white">

          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Khám phá sản phẩm công nghệ
          </h2>

          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            Tìm kiếm sản phẩm phù hợp với nhu cầu của bạn và bắt đầu
            trải nghiệm mua sắm tại DevNinjas.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center bg-white text-[#0052A3] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Mua sắm ngay
          </Link>

        </div>

      </section>

    </main>
  );
}