import FeedbackCard from "../ui/FeedbackCard";

export default function FeedbackSection() {
  const feedbacks = [
    {
      quote: "Dịch vụ tuyệt vời! Tôi đã mua một chiếc MacBook ở đây và rất hài lòng với sự tư vấn nhiệt tình cũng như chế độ hậu mãi chu đáo.",
      name: "Nguyễn Huy",
      role: "Khách hàng thân thiết",
      initials: "NH",
      bgColor: "bg-blue-100"
    },
    {
      quote: "Sản phẩm chính hãng 100%, giao hàng cực nhanh chỉ trong vòng 2 tiếng. Đây chắc chắn là địa chỉ tin cậy cho đồ công nghệ.",
      name: "Minh Tú",
      role: "Đã mua iPhone 15",
      initials: "MT",
      bgColor: "bg-orange-100"
    },
    {
      quote: "Mua hàng online nhưng cảm giác rất an tâm. Nhân viên gọi xác nhận đơn nhanh, đóng gói rất kỹ càng và đẹp mắt.",
      name: "Anh Nam",
      role: "Đã mua Sony XM5",
      initials: "AN",
      bgColor: "bg-green-100"
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI</h2>
        <div className="w-16 h-1 bg-blue-900 mx-auto mb-12" />

        {/* Lưới đánh giá */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedbacks.map((item, i) => (
            <FeedbackCard key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}