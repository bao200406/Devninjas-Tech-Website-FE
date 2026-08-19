import Link from "next/link";
import {
  Briefcase,
  Users,
  Code2,
  Palette,
  ShoppingBag,
  TrendingUp,
  Send,
} from "lucide-react";

const positions = [
  {
    icon: Code2,
    title: "Web Developer",
    description:
      "Tham gia phát triển và cải thiện các tính năng trên website DevNinjas.",
  },
  {
    icon: Palette,
    title: "UI/UX Designer",
    description:
      "Thiết kế giao diện hiện đại, thân thiện và mang lại trải nghiệm tốt cho khách hàng.",
  },
  {
    icon: ShoppingBag,
    title: "Nhân viên bán hàng",
    description:
      "Tư vấn sản phẩm công nghệ và hỗ trợ khách hàng lựa chọn sản phẩm phù hợp.",
  },
  {
    icon: TrendingUp,
    title: "Marketing",
    description:
      "Xây dựng nội dung và các hoạt động quảng bá sản phẩm, thương hiệu DevNinjas.",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">

      {/* HEADER */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 xl:px-0 py-12">

          <p className="text-sm font-medium text-[#0052A3] mb-2">
            DEVNINJAS TECHNOLOGY STORE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tuyển dụng
          </h1>

          <p className="text-gray-500 max-w-2xl leading-7">
            Cùng DevNinjas xây dựng một môi trường công nghệ năng động,
            sáng tạo và phát triển.
          </p>

        </div>
      </section>

      {/* INTRO */}
      <section className="container mx-auto px-6 xl:px-0 py-12">

        <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10">

          <div className="flex items-start gap-5">

            <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
              <Briefcase
                size={28}
                className="text-[#0052A3]"
              />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cơ hội làm việc tại DevNinjas
              </h2>

              <p className="text-gray-600 leading-7 mb-4">
                DevNinjas luôn tìm kiếm những thành viên có niềm đam mê
                với công nghệ, tinh thần học hỏi và mong muốn phát triển
                bản thân.
              </p>

              <p className="text-gray-600 leading-7">
                Nếu bạn yêu thích công nghệ và muốn tham gia vào quá trình
                xây dựng một cửa hàng công nghệ hiện đại, hãy cùng trở thành
                một phần của DevNinjas.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* JOBS */}
      <section className="container mx-auto px-6 xl:px-0 pb-12">

        <div className="text-center mb-8">

          <p className="text-sm font-medium text-[#0052A3] mb-2">
            VỊ TRÍ TUYỂN DỤNG
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Cơ hội dành cho bạn
          </h2>

          <p className="text-gray-500 mt-2">
            Một số vị trí bạn có thể tham gia cùng DevNinjas.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {positions.map((position, index) => {
            const Icon = position.icon;

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon
                      size={24}
                      className="text-[#0052A3]"
                    />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {position.title}
                    </h3>

                    <p className="text-sm text-gray-500 leading-6">
                      {position.description}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  className="mt-5 w-full border border-[#0052A3] text-[#0052A3] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                >
                  Xem vị trí
                </button>

              </div>
            );
          })}

        </div>

      </section>

      {/* WHY JOIN */}
      <section className="container mx-auto px-6 xl:px-0 pb-12">

        <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10">

          <div className="flex items-center gap-3 mb-8">

            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users
                size={23}
                className="text-[#0052A3]"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Vì sao làm việc tại DevNinjas?
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Môi trường năng động
              </h3>

              <p className="text-sm text-gray-500 leading-6">
                Làm việc trong môi trường trẻ, năng động và khuyến khích
                sự sáng tạo.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Học hỏi và phát triển
              </h3>

              <p className="text-sm text-gray-500 leading-6">
                Có cơ hội học hỏi thêm kiến thức và phát triển kỹ năng
                trong lĩnh vực công nghệ.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Cùng xây dựng sản phẩm
              </h3>

              <p className="text-sm text-gray-500 leading-6">
                Cùng đóng góp ý tưởng và xây dựng trải nghiệm mua sắm
                công nghệ tốt hơn.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 xl:px-0 pb-12">

        <div className="bg-[#0052A3] rounded-xl p-8 md:p-10 text-center text-white">

          <Send
            size={30}
            className="mx-auto mb-4"
          />

          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Muốn gia nhập DevNinjas?
          </h2>

          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            Hãy gửi thông tin của bạn cho chúng tôi để tìm hiểu thêm
            về các cơ hội làm việc tại DevNinjas.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#0052A3] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Liên hệ ngay
          </Link>

        </div>

      </section>

    </main>
  );
}