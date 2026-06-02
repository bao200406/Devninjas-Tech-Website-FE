import BlogCard from "../blog/BlogCard";

export default function BlogSection() {
  const news = [
    { category: "ĐÁNH GIÁ", date: "24 THÁNG 05, 2024", title: "Đánh giá chi tiết iPhone 15 Pro Max sau 6 tháng sử dụng", description: "Liệu siêu phẩm của Apple có còn giữ vững phong độ nửa năm trải nghiệm thực tế?" },
    { category: "THỦ THUẬT", date: "20 THÁNG 05, 2024", title: "Top 5 mẫu laptop sinh viên đáng mua nhất năm 2024", description: "Lựa chọn hoàn hảo cân bằng giữa hiệu năng, thiết kế và giá thành cho năm học mới." },
    { category: "THỦ THUẬT", date: "20 THÁNG 05, 2024", title: "Top 5 mẫu laptop sinh viên đáng mua nhất năm 2024", description: "Lựa chọn hoàn hảo cân bằng giữa hiệu năng, thiết kế và giá thành cho năm học mới." },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">TIN TỨC & KIẾN THỨC CÔNG NGHỆ</h2>
        <p className="text-gray-500 text-sm mb-8">Cập nhật những thông tin mới nhất, thủ thuật hữu ích và xu hướng công nghệ hàng đầu hiện nay.</p>
        <div className="w-16 h-1 bg-blue-900 mx-auto mb-10" />

        {/* Lưới bài viết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <BlogCard key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}