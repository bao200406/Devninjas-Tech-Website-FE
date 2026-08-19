"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  ShoppingCart,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
} from "lucide-react";

const faqItems = [
  {
    icon: ShoppingCart,
    question: "Làm thế nào để đặt hàng trên DevNinjas?",
    answer:
      "Bạn có thể tìm kiếm sản phẩm mình muốn mua, thêm sản phẩm vào giỏ hàng, kiểm tra thông tin đơn hàng và tiến hành thanh toán theo hướng dẫn trên website.",
  },
  {
    icon: CreditCard,
    question: "DevNinjas hỗ trợ những phương thức thanh toán nào?",
    answer:
      "DevNinjas hỗ trợ các phương thức thanh toán được hiển thị tại bước thanh toán. Bạn có thể lựa chọn phương thức phù hợp trước khi hoàn tất đơn hàng.",
  },
  {
    icon: Truck,
    question: "Thời gian giao hàng là bao lâu?",
    answer:
      "Thời gian giao hàng phụ thuộc vào khu vực nhận hàng và phương thức vận chuyển mà bạn lựa chọn khi đặt hàng.",
  },
  {
    icon: ShieldCheck,
    question: "Sản phẩm có được bảo hành không?",
    answer:
      "Sản phẩm được áp dụng chính sách bảo hành tùy theo từng sản phẩm và thương hiệu. Bạn có thể xem thêm thông tin tại trang Chính sách bảo hành.",
  },
  {
    icon: RotateCcw,
    question: "Tôi có thể đổi hoặc trả sản phẩm không?",
    answer:
      "Việc đổi hoặc trả sản phẩm được thực hiện theo điều kiện và chính sách đổi trả của DevNinjas. Nếu cần hỗ trợ, bạn có thể liên hệ với chúng tôi.",
  },
  {
    icon: MessageCircle,
    question: "Tôi cần hỗ trợ thì liên hệ với ai?",
    answer:
      "Bạn có thể liên hệ với DevNinjas thông qua trang Liên hệ để được hỗ trợ và giải đáp các vấn đề trong quá trình mua sắm.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA]">

      {/* HEADER */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 xl:px-0 py-12">

          <p className="text-sm font-medium text-[#0052A3] mb-2">
            DEVNINJAS TECHNOLOGY STORE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Câu hỏi thường gặp
          </h1>

          <p className="text-gray-500 max-w-2xl leading-7">
            Những câu hỏi thường gặp sẽ giúp bạn nhanh chóng tìm được
            thông tin cần thiết trong quá trình mua sắm tại DevNinjas.
          </p>

        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 xl:px-0 py-12">

        <div className="max-w-3xl mx-auto">

          {/* TITLE */}
          <div className="text-center mb-8">

            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <HelpCircle
                size={28}
                className="text-[#0052A3]"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Bạn đang cần tìm thông tin?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Chọn câu hỏi bên dưới để xem câu trả lời.
            </p>

          </div>

          {/* FAQ LIST */}
          <div className="space-y-4">

            {faqItems.map((item, index) => {
              const Icon = item.icon;
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >

                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Icon
                          size={20}
                          className="text-[#0052A3]"
                        />
                      </div>

                      <span className="font-semibold text-gray-900">
                        {item.question}
                      </span>

                    </div>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-gray-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />

                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">

                      <div className="ml-14 pt-1 border-t border-gray-100">

                        <p className="text-sm text-gray-500 leading-7 pt-4">
                          {item.answer}
                        </p>

                        {index === 3 && (
                          <Link
                            href="/warranty"
                            className="inline-block mt-3 text-sm font-medium text-[#0052A3] hover:underline"
                          >
                            Xem chính sách bảo hành →
                          </Link>
                        )}

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {/* CONTACT */}
          <div className="mt-10 bg-[#0052A3] rounded-xl p-8 text-center text-white">

            <MessageCircle
              size={30}
              className="mx-auto mb-4"
            />

            <h2 className="text-2xl font-bold mb-3">
              Bạn chưa tìm thấy câu trả lời?
            </h2>

            <p className="text-blue-100 mb-6">
              Hãy liên hệ với DevNinjas để được hỗ trợ trực tiếp.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-[#0052A3] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Liên hệ với chúng tôi
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}