"use client";

import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookMessenger,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function ContactPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "Làm cách nào để tôi có thể đặt hàng?",
      answer:
        "Bạn chỉ cần chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán.",
    },
    {
      question: "Chính sách đổi trả sản phẩm như thế nào?",
      answer:
        "Bạn có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng.",
    },
    {
      question: "Thời gian giao hàng mất bao lâu?",
      answer:
        "Thông thường từ 2 - 5 ngày làm việc tùy khu vực.",
    },
    {
      question: "Tôi có thể hủy đơn hàng sau khi thanh toán không?",
      answer:
        "Vui lòng liên hệ bộ phận hỗ trợ để được kiểm tra trạng thái đơn hàng.",
    },
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">

        <h1 className="text-5xl md:text-7xl font-extrabold text-[#1b1f27] mb-6">
          Liên hệ với chúng tôi
        </h1>

        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn.
          Hãy kết nối để Devninjas đồng hành cùng thành công của bạn.
        </p>

        <div className="mt-16">

          <p className="text-[#0052A3] font-semibold mb-3">
            Devninjas Support
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#1b1f27]">
            Chúng tôi có thể giúp gì cho bạn?
          </h2>

        </div>

      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 mb-16">

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl p-10 min-h-[190px] border border-gray-200">
            <h3 className="text-5xl font-bold text-[#0052A3] mb-4">
              5-10'
            </h3>

            <p className="font-bold uppercase mb-3">
              THỜI GIAN PHẢN HỒI
            </p>

            <p className="text-gray-600">
              Tốc độ xử lý yêu cầu trung bình mỗi ngày.
            </p>
          </div>

          <div className="bg-white rounded-xl p-10 min-h-[190px] border border-gray-200">
            <h3 className="text-5xl font-bold text-[#0052A3] mb-4">
              98%
            </h3>

            <p className="font-bold uppercase mb-3">
              TỶ LỆ HÀI LÒNG
            </p>

            <p className="text-gray-600">
              Phản hồi tích cực từ khách hàng doanh nghiệp.
            </p>
          </div>

          <div className="bg-white rounded-xl p-10 min-h-[190px] border border-gray-200">
            <h3 className="text-5xl font-bold text-[#0052A3] mb-4">
              24/7
            </h3>

            <p className="font-bold uppercase mb-3">
              HỖ TRỢ KỸ THUẬT
            </p>

            <p className="text-gray-600">
              Luôn trực tuyến bất kể múi giờ hay ngày lễ.
            </p>
          </div>

          <div className="bg-white rounded-xl p-10 min-h-[190px] border border-gray-200">
            <h3 className="text-5xl font-bold text-[#0052A3] mb-4">
              100k+
            </h3>

            <p className="font-bold uppercase mb-3">
              KHÁCH HÀNG
            </p>

            <p className="text-gray-600">
              Tin tưởng sử dụng giải pháp của Devninjas
            </p>
          </div>

        </div>

      </section>

      {/* CONTACT */}
      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid lg:grid-cols-[480px_1fr] gap-12">

          {/* LEFT */}
          <div>

            <div className="space-y-5">

              {/* HOTLINE */}
              <div className="bg-white rounded-xl p-6 flex gap-5 border border-gray-200">
                <div className="w-14 h-14 bg-[#0052A3] rounded-lg flex items-center justify-center">
                  <FaPhoneAlt className="text-white" />
                </div>

                <div>
                  <h4 className="text-2xl font-semibold">
                    Hotline
                  </h4>

                  <p className="text-lg text-gray-600">
                    1900 8888 99 (Miễn phí)
                  </p>

                  <p className="text-[#0052A3] font-bold mt-4">
                    GHI NGAY
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="bg-white rounded-xl p-6 flex gap-5 border border-gray-200">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-[#0052A3]" />
                </div>

                <div>
                  <h4 className="text-2xl font-semibold">
                    Email
                  </h4>

                  <p className="text-lg text-gray-600">
                    support@devninjaslogic.vn
                  </p>

                  <p className="text-[#0052A3] font-bold mt-4">
                    GỬI EMAIL
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="bg-white rounded-xl p-6 flex gap-5 border border-gray-200">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-[#0052A3]" />
                </div>

                <div>
                  <h4 className="text-2xl font-semibold">
                    Văn phòng chính
                  </h4>

                  <p className="text-lg text-gray-600">
                    Tầng 24, Tòa nhà Bitexco,
                    TP. Hồ Chí Minh
                  </p>

                  <p className="text-[#0052A3] font-bold mt-4">
                    XEM BẢN ĐỒ
                  </p>
                </div>
              </div>

              {/* WORKING TIME */}
              <div className="bg-white rounded-xl p-6 flex gap-5 border border-gray-200">
                <div className="w-14 h-14 bg-orange-50 rounded-lg flex items-center justify-center">
                  <FaClock className="text-[#0052A3]" />
                </div>

                <div>
                  <h4 className="text-2xl font-semibold">
                    Giờ làm việc
                  </h4>

                  <p className="text-lg text-gray-600">
                    Thứ 2 - Thứ 6: 08:00 - 18:00
                  </p>

                  <p className="text-lg text-gray-600">
                    Thứ 7: 09:00 - 12:00
                  </p>
                </div>
              </div>

            </div>

            {/* SUPPORT CHANNEL */}
            <div className="mt-12">

              <p className="text-sm tracking-[5px] text-gray-600 mb-5">
                KÊNH HỖ TRỢ NHANH
              </p>

              <div className="flex flex-wrap gap-4">

                <button
                  type="button"
                  className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 hover:border-[#0052A3] hover:text-[#0052A3] transition"
                >
                  Chat trực tuyến
                </button>

                <button
                  type="button"
                  className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2 hover:border-[#0052A3] hover:text-[#0052A3] transition"
                >
                  <FaFacebookMessenger />
                  Messenger
                </button>

                <button
                  type="button"
                  className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 hover:border-[#0052A3] hover:text-[#0052A3] transition"
                >
                  Zalo Official
                </button>

              </div>

            </div>

          </div>

          {/* RIGHT - FORM */}
          <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-200">

            <form className="space-y-6">

              <div className="grid md:grid-cols-2 gap-6">

                {/* NAME */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    HỌ VÀ TÊN
                  </label>

                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-md px-4 py-4 outline-none focus:border-[#0052A3] focus:ring-1 focus:ring-[#0052A3]"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    EMAIL
                  </label>

                  <input
                    type="email"
                    placeholder="email@vi-du.vn"
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-md px-4 py-4 outline-none focus:border-[#0052A3] focus:ring-1 focus:ring-[#0052A3]"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    SỐ ĐIỆN THOẠI
                  </label>

                  <input
                    type="text"
                    placeholder="090 123 4567"
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-md px-4 py-4 outline-none focus:border-[#0052A3] focus:ring-1 focus:ring-[#0052A3]"
                  />
                </div>

                {/* SUBJECT */}
                <div>
                  <label className="block text-sm font-bold mb-2">
                    CHỦ ĐỀ
                  </label>

                  <select className="w-full bg-[#F8F9FA] border border-gray-200 rounded-md px-4 py-4 outline-none focus:border-[#0052A3] focus:ring-1 focus:ring-[#0052A3]">
                    <option>Hỗ trợ đơn hàng</option>
                    <option>Khiếu nại</option>
                    <option>Góp ý</option>
                  </select>
                </div>

              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  LỜI NHẮN
                </label>

                <textarea
                  rows={5}
                  placeholder="Hãy mô tả chi tiết yêu cầu của bạn..."
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-md px-4 py-4 outline-none focus:border-[#0052A3] focus:ring-1 focus:ring-[#0052A3]"
                />
              </div>

              {/* FILE */}
              <div>
                <label className="block text-sm font-bold mb-3">
                  ĐÍNH KÈM TÀI LIỆU (HÌNH ẢNH, PDF)
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg py-12 text-center hover:border-[#0052A3] transition">

                  <p className="text-4xl mb-2">
                    ☁
                  </p>

                  <p className="text-gray-500">
                    Kéo thả file hoặc
                    <span className="text-[#0052A3] font-medium">
                      {" "}nhấn vào đây
                    </span>
                  </p>

                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-[#0052A3] hover:bg-blue-800 text-white py-4 rounded-lg font-semibold transition"
              >
                GỬI YÊU CẦU
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 pb-24">

        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-[#1b1f27]">
          Câu hỏi thường gặp
        </h2>

        <div className="space-y-4">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden border border-gray-200"
            >

              <button
                type="button"
                onClick={() =>
                  setOpenFAQ(
                    openFAQ === index ? null : index
                  )
                }
                className="w-full flex justify-between items-center px-6 py-5 hover:bg-gray-50 transition"
              >

                <span className="font-medium text-left text-gray-900">
                  {faq.question}
                </span>

                {openFAQ === index ? (
                  <FaChevronUp className="text-[#0052A3]" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}

              </button>

              {openFAQ === index && (
                <div className="px-6 pb-5 text-gray-600 leading-7 border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              )}

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}