import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  FileCheck,
  Wrench,
  AlertCircle,
  PhoneCall,
} from "lucide-react";

const warrantyItems = [
  {
    icon: ShieldCheck,
    title: "Điều kiện bảo hành",
    description:
      "Sản phẩm được bảo hành khi còn trong thời hạn bảo hành và đáp ứng các điều kiện bảo hành của sản phẩm.",
  },
  {
    icon: Clock,
    title: "Thời gian bảo hành",
    description:
      "Thời gian bảo hành được áp dụng theo chính sách của từng sản phẩm và thương hiệu.",
  },
  {
    icon: FileCheck,
    title: "Kiểm tra thông tin",
    description:
      "Khách hàng cần cung cấp thông tin đơn hàng hoặc hóa đơn mua hàng để được hỗ trợ.",
  },
  {
    icon: Wrench,
    title: "Quy trình bảo hành",
    description:
      "Sản phẩm sẽ được kiểm tra tình trạng trước khi tiến hành sửa chữa hoặc xử lý bảo hành.",
  },
];

export default function WarrantyPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">

      {/* HEADER */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 xl:px-0 py-12">

          <p className="text-sm font-medium text-[#0052A3] mb-2">
            DEVNINJAS TECHNOLOGY STORE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Chính sách bảo hành
          </h1>

          <p className="text-gray-500 max-w-2xl leading-7">
            DevNinjas luôn cố gắng mang đến cho khách hàng chính sách
            bảo hành rõ ràng và thuận tiện trong quá trình sử dụng sản phẩm.
          </p>

        </div>
      </section>

      {/* WARRANTY ITEMS */}
      <section className="container mx-auto px-6 xl:px-0 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {warrantyItems.map((item, index) => {
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

        {/* CONDITIONS */}
        <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 md:p-8">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 shrink-0 rounded-lg bg-yellow-50 flex items-center justify-center">
              <AlertCircle
                size={21}
                className="text-yellow-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Lưu ý khi bảo hành
              </h2>

              <ul className="space-y-3 text-sm text-gray-600 leading-6">
                <li>
                  • Sản phẩm cần còn trong thời hạn bảo hành.
                </li>

                <li>
                  • Sản phẩm cần có thông tin mua hàng hoặc hóa đơn hợp lệ.
                </li>

                <li>
                  • Không áp dụng bảo hành đối với các trường hợp hư hỏng
                  do sử dụng sai hướng dẫn hoặc tác động bên ngoài.
                </li>

                <li>
                  • Thời gian xử lý có thể thay đổi tùy theo tình trạng
                  sản phẩm và đơn vị bảo hành.
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* CONTACT */}
        <div className="mt-10 bg-[#0052A3] rounded-xl p-8 text-center text-white">

          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <PhoneCall size={23} />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Cần hỗ trợ bảo hành?
          </h2>

          <p className="text-blue-100 mb-6">
            Liên hệ với DevNinjas để được tư vấn và hỗ trợ nhanh chóng.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white text-[#0052A3] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Liên hệ ngay
          </Link>

        </div>

      </section>

    </main>
  );
}