import { useState, useEffect, useMemo } from "react";
import { getRatingsByProduct } from "../../services/rating"; 

export default function ProductReviews({ productId }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const ratingLabels = useMemo(() => ({
    1: "Rất Tệ",
    2: "Tệ",
    3: "Bình thường",
    4: "Tốt",
    5: "Tuyệt vời",
  }), []);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const data = await getRatingsByProduct(productId);
        if (isMounted) {
          const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : data?.reviews || [];
          setReviews(list);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách đánh giá:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReviews();
    return () => { isMounted = false; };
  }, [productId]);

  // --- TÍNH TOÁN DỮ LIỆU TỔNG QUAN BẰNG USEMEMO (TỐI ƯU HIỆU SUẤT) ---
  const { totalReviews, averageRating, starProgressData, experienceData } = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        totalReviews: 0,
        averageRating: "0.0",
        starProgressData: [5, 4, 3, 2, 1].map(star => ({ star, count: "0 đánh giá", percent: "0%" })),
        experienceData: [
          { label: "Chất lượng sản phẩm", score: "5.0/5", count: "(0 đánh giá)" },
          { label: "Đúng với mô tả", score: "5.0/5", count: "(0 đánh giá)" },
          { label: "Giá cả / Giá trị", score: "5.0/5", count: "(0 đánh giá)" },
        ]
      };
    }

    // 1. Điểm trung bình tổng quan
    const sumRating = reviews.reduce((acc, r) => acc + (r.overallRating || r.rating || 5), 0);
    const avg = (sumRating / total).toFixed(1);

    // 2. Mốc sao
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalQuality = 0, totalDescription = 0, totalValue = 0, countDetailed = 0;

    reviews.forEach((r) => {
      const star = r.overallRating || r.rating || 5;
      if (starCounts[star] !== undefined) starCounts[star] += 1;

      if (r.detailedRatings) {
        countDetailed++;
        totalQuality += r.detailedRatings.quality || 5;
        totalDescription += r.detailedRatings.descriptionMatch || 5;
        totalValue += r.detailedRatings.priceValue || 5;
      }
    });

    const progress = [5, 4, 3, 2, 1].map((star) => {
      const count = starCounts[star];
      const percent = Math.round((count / total) * 100);
      return {
        star,
        count: `${count} đánh giá`,
        percent: `${percent}%`,
      };
    });

    // 3. Điểm trải nghiệm
    const avgQuality = countDetailed > 0 ? (totalQuality / countDetailed).toFixed(1) : "5.0";
    const avgDescription = countDetailed > 0 ? (totalDescription / countDetailed).toFixed(1) : "5.0";
    const avgValue = countDetailed > 0 ? (totalValue / countDetailed).toFixed(1) : "5.0";

    const exp = [
      { label: "Chất lượng sản phẩm", score: `${avgQuality}/5`, count: `(${total} đánh giá)` },
      { label: "Đúng với mô tả", score: `${avgDescription}/5`, count: `(${total} đánh giá)` },
      { label: "Giá cả / Giá trị", score: `${avgValue}/5`, count: `(${total} đánh giá)` },
    ];

    return { totalReviews: total, averageRating: avg, starProgressData: progress, experienceData: exp };
  }, [reviews]);

  // --- LỌC DANH SÁCH ĐÁNH GIÁ NGAY TRÊN CLIENT (CỰC KỲ NHANH) ---
  const filteredReviews = useMemo(() => {
    if (selectedFilter === "all") return reviews;
    if (selectedFilter === "has_image") {
      return reviews.filter(r => (r.images && r.images.length > 0) || (r.image && r.image.length > 0));
    }
    if (selectedFilter === "purchased") {
      return reviews.filter(r => r.isPurchased || r.orderDetailId);
    }
    // Lọc theo số sao ("5", "4", "3", "2", "1")
    const starNum = parseInt(selectedFilter, 10);
    if (!isNaN(starNum)) {
      return reviews.filter(r => (r.overallRating || r.rating || 5) === starNum);
    }
    return reviews;
  }, [reviews, selectedFilter]);

  return (
    <div className="space-y-6">
      {/* KHỐI TỔNG QUAN ĐÁNH GIÁ */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-6">
          Đánh giá sản phẩm chính hãng
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Cột trái: Điểm trung bình */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center lg:border-r border-gray-100 pr-0 lg:pr-6">
            <div className="text-5xl font-black text-gray-900 tracking-tight">
              {averageRating}<span className="text-2xl font-normal text-gray-400">/5</span>
            </div>
            <div className="flex text-yellow-400 text-base my-2">★★★★★</div>
            <span className="text-xs text-gray-500 font-medium">{totalReviews} lượt đánh giá</span>
          </div>

          {/* Cột giữa: Progress bar */}
          <div className="lg:col-span-4 space-y-2">
            {starProgressData.map((item) => (
              <div key={item.star} className="flex items-center text-xs gap-3">
                <span className="w-3 text-gray-700 font-medium">{item.star}</span>
                <span className="text-yellow-400 text-xs">★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all duration-300" style={{ width: item.percent }}></div>
                </div>
                <span className="w-20 text-right text-gray-400 text-[11px]">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Cột phải: Trải nghiệm */}
          <div className="lg:col-span-5 lg:border-l border-gray-100 pl-0 lg:pl-6 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 mb-3">Đánh giá theo trải nghiệm</h4>
            {experienceData.map((exp, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{exp.label}</span>
                <div className="flex items-center gap-2">
                  <div className="text-yellow-400 text-xs">★★★★★</div>
                  <span className="font-bold text-gray-800">{exp.score}</span>
                  <span className="text-gray-400 text-[11px]">{exp.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KHỐI LỌC VÀ DANH SÁCH BÌNH LUẬN */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-bold text-gray-900">Lọc đánh giá theo</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Tất cả" },
              { id: "has_image", label: "Có hình ảnh" },
              { id: "purchased", label: "Đã mua hàng" },
              { id: "5", label: "5 sao" },
              { id: "4", label: "4 sao" },
              { id: "3", label: "3 sao" },
              { id: "2", label: "2 sao" },
              { id: "1", label: "1 sao" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  selectedFilter === filter.id
                    ? "border-[#d70018] text-[#d70018] bg-red-50/30"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="text-center py-8 text-xs text-gray-500">Đang tải đánh giá...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500">Không tìm thấy đánh giá phù hợp với bộ lọc này.</div>
          ) : (
            filteredReviews.map((review) => {
              const ratingVal = review.overallRating || review.rating || 5;
              const reviewName = review.orderDetailId?.orderId?.userId?.name || review.userName || "Khách hàng";
              const reviewAvatarBg = review.avatarBg || "bg-red-700";

              return (
                <div key={review._id || review.id} className="py-4 space-y-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${reviewAvatarBg} text-white font-bold flex items-center justify-center text-xs`}>
                        {reviewName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-gray-900">{reviewName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-yellow-400 text-xs">
                        {"★".repeat(ratingVal)}{"☆".repeat(5 - ratingVal)}
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        {review.ratingText || ratingLabels[ratingVal] || "Tuyệt vời"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {review.detailedRatings ? (
                      <>
                        {review.detailedRatings.quality && (
                          <span className="bg-gray-100 text-gray-700 text-[11px] px-2.5 py-1 rounded-md font-medium">
                            Chất lượng sản phẩm: {review.detailedRatings.quality}/5★
                          </span>
                        )}
                        {review.detailedRatings.descriptionMatch && (
                          <span className="bg-gray-100 text-gray-700 text-[11px] px-2.5 py-1 rounded-md font-medium">
                            Đúng với mô tả: {review.detailedRatings.descriptionMatch}/5★
                          </span>
                        )}
                        {review.detailedRatings.priceValue && (
                          <span className="bg-gray-100 text-gray-700 text-[11px] px-2.5 py-1 rounded-md font-medium">
                            Giá cả / Giá trị: {review.detailedRatings.priceValue}/5★
                          </span>
                        )}
                      </>
                    ) : (
                      review.experienceTags?.map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-[11px] px-2.5 py-1 rounded-md font-medium">
                          {tag}
                        </span>
                      ))
                    )}
                  </div>

                  <p className="text-xs text-gray-800 leading-relaxed">{review.comment}</p>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1">
                    <span>⏱</span> {review.createdAt ? new Date(review.createdAt).toLocaleDateString("vi-VN") : (review.timeAgo || "Vừa xong")}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}