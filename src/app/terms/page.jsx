import Link from "next/link";
import {
  FileText,
  ShoppingCart,
  CreditCard,
  Truck,
  UserCheck,
  AlertCircle,
} from "lucide-react";

const terms = [
  {
    icon: ShoppingCart,
    title: "Đặt hàng",
    description:
      "Khách hàng cần cung cấp thông tin chính xác khi thực hiện đặt hàng trên website DevNinjas.",
  },
  {
    icon: CreditCard,
    title: "Thanh toán",
    description:
      "Khách hàng lựa chọn phương thức thanh toán được hỗ trợ và hoàn tất thanh toán theo hướng dẫn.",
  },
  {
    icon: Truck,
    title: "Giao hàng",
    description:
      "Đơn hàng được giao theo phương thức vận chuyển mà khách hàng lựa chọn trong quá trình đặt hàng.",
  },
  {
    icon: UserCheck,
    title: "Tài khoản",
    description:
      "Khách hàng có trách nhiệm bảo mật thông tin tài khoản và không chia sẻ thông tin đăng nhập cho người khác.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">

      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 xl:px-0 py-12">

          <p className="text-sm font-medium text-[#0052A3] mb-2">
            DEVNINJAS TECHNOLOGY STORE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Điều khoản dịch vụ
          </h1>

          <p className="text-gray-500 max-w-2xl leading-7">
            Các điều khoản dưới đây giúp đảm bảo quá trình mua sắm và sử dụng
            dịch vụ tại DevNinjas được thuận tiện và minh bạch.
          </p>

        </div>
      </section>

      <section className="container mx-auto px-6 xl:px-0 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {terms.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5">
                  <Icon size={24} className="text-[#0052A3]" />
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

        <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 md:p-8">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 shrink-0 rounded-lg bg-yellow-50 flex items-center justify-center">
              <AlertCircle size={21} className="text-yellow-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Lưu ý
              </h2>

              <p className="text-sm text-gray-600 leading-7">
                Khi sử dụng website và đặt hàng tại DevNinjas, khách hàng
                được xem là đã đọc và đồng ý với các điều khoản dịch vụ
                được cung cấp trên website.
              </p>
            </div>

          </div>

        </div>

        <div className="mt-10 text-center">

          <p className="text-gray-500 mb-5">
            Bạn cần thêm thông tin?
          </p>

          <Link
            href="/contact"
            className="inline-flex bg-[#0052A3] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition"
          >
            Liên hệ DevNinjas
          </Link>

        </div>

      </section>

    </main>
  );
}