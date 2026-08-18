import Link from "next/link";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

const supportItems = [
  {
    icon: ShoppingCart,
    title: "Hướng dẫn đặt hàng",
    description:
      "Tìm hiểu cách tìm kiếm sản phẩm, thêm sản phẩm vào giỏ hàng và hoàn tất đơn hàng.",
  },
  {
    icon: CreditCard,
    title: "Thanh toán",
    description:
      "Thông tin về các phương thức thanh toán và hướng dẫn xử lý khi thanh toán.",
  },
  {
    icon: Truck,
    title: "Giao hàng",
    description:
      "Tìm hiểu về phương thức giao hàng, thời gian giao hàng và phí vận chuyển.",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả sản phẩm",
    description:
      "Thông tin về điều kiện và quy trình đổi trả sản phẩm.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành",
    description:
      "Tìm hiểu chính sách bảo hành và cách yêu cầu hỗ trợ bảo hành.",
  },
  {
    icon: MessageCircle,
    title: "Liên hệ hỗ trợ",
    description:
      "Nếu bạn cần hỗ trợ thêm, hãy liên hệ với đội ngũ DevNinjas.",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">

      {/* HEADER */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 xl:px-0 py-12">
          <p className="text-sm font-medium text-[#0052A3] mb-2">
            DEVNINJAS TECHNOLOGY STORE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trung tâm hỗ trợ
          </h1>

          <p className="text-gray-500 max-w-2xl leading-7">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình mua sắm
            và sử dụng sản phẩm tại DevNinjas.
          </p>
        </div>
      </section>

      {/* SUPPORT CONTENT */}
      <section className="container mx-auto px-6 xl:px-0 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {supportItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5">
                  <Icon
                    size={24}
                    className="text-[#0052A3]"
                  />
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {item.title}
                </h2>

                <p className="text-sm text-gray-500 leading-6">
                  {item.description}
                </p>
              </div>
            );
          })}

        </div>

        {/* CONTACT */}
        <div className="mt-10 bg-white rounded-xl border border-gray-200 p-8 text-center">

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Bạn vẫn cần hỗ trợ?
          </h2>

          <p className="text-gray-500 mb-6">
            Đội ngũ DevNinjas luôn sẵn sàng giải đáp các vấn đề của bạn.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-[#0052A3] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition"
          >
            Liên hệ với chúng tôi
          </Link>

        </div>

      </section>

    </main>
  );
}