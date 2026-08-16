import { useState, useEffect } from "react";
// Đảm bảo bạn đã có file ratingService hoặc đổi đường dẫn import này cho khớp với dự án của bạn
import { createRating } from "../../services/rating"; 

export default function ReviewModal({ isOpen, onClose, orderDetailId, productInfo, onSuccess }) {
  const [detailedRatings, setDetailedRatings] = useState({
    quality: 5,         // Chất lượng sản phẩm
    descriptionMatch: 5, // Đúng với mô tả
    priceValue: 5,       // Giá cả / Giá trị
  });

  // State lưu giá trị đánh giá chung (tự động tính toán)
  const [overallRating, setOverallRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false); // State xử lý trạng thái đang gửi

  // Tự động tính điểm trung bình cộng từ "Theo trải nghiệm" để quy ra "Đánh giá chung"
  useEffect(() => {
    const values = Object.values(detailedRatings);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = Math.round(sum / values.length); // Làm tròn thành số nguyên từ 1 đến 5
    setOverallRating(average);
  }, [detailedRatings]);

  const ratingLabels = {
    1: "Rất Tệ",
    2: "Tệ",
    3: "Bình thường",
    4: "Tốt",
    5: "Tuyệt vời",
  };

  // Helper xử lý đường dẫn ảnh sản phẩm đồng bộ với OrderCard
  const getPublicUrl = (path) => {
    if (!path) return "https://via.placeholder.com/60";
    if (path.startsWith("http")) return path;
    const index = path.indexOf('uploads');
    if (index === -1) return path;
    const relativePath = path.substring(index).replace(/\\/g, '/');
    return `https://devninjas-tech-website-be-1.onrender.com/${relativePath}`;
  };

  // Hàm xử lý gửi đánh giá thật lên Backend
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (comment.trim().length < 15) {
      alert("Vui lòng nhập nội dung đánh giá tối thiểu 15 ký tự!");
      return;
    }

    try {
      setLoading(true);

      const ratingPayload = {
        orderDetailId, // Truyền chính xác orderDetailId của sản phẩm
        overallRating,
        detailedRatings,
        comment: comment.trim(),
      };

      const result = await createRating(ratingPayload);

      if (result) {
        alert("Gửi đánh giá thành công!");
        if (onSuccess) onSuccess(); // Callback làm mới dữ liệu bên ngoài nếu có
        onClose(); // Đóng modal
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans overflow-y-auto">
      {/* Khung Modal chính được đổi thành thẻ form và thêm max-h-[90vh], flex flex-col, my-auto để không bị dính mép trên/dưới */}
      <form 
        onSubmit={handleSubmitForm} 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 my-auto"
      >
        
        {/* Header Modal (Cố định ở trên, dùng shrink-0 để không bị bóp méo) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Đánh giá & nhận xét</h3>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Nội dung bên trong Modal (Thêm flex-1 và overflow-y-auto để cuộn độc lập) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

        {/* KHỐI THÔNG TIN SẢN PHẨM (Hiển thị động theo productInfo) */}
          <div className="flex items-center gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <img 
              src={getPublicUrl(productInfo?.image)} 
              alt={productInfo?.name || "Product"} 
              className="w-14 h-14 object-contain rounded-lg bg-white border border-gray-200 p-1 shrink-0"
            />
            <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
              {productInfo?.name || "Sản phẩm chính hãng"}
            </h4>
          </div>
          
          {/* 1. Phần Đánh giá chung (Hiển thị tự động dựa theo điểm trung bình, vô hiệu hóa việc click chọn thủ công) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900">Đánh giá chung</h4>
            <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className="flex flex-col items-center gap-1 group"
                >
                  <span className={`text-3xl transition-transform ${star <= overallRating ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                  <span className={`text-xs font-medium ${star === overallRating ? "text-[#d70018] font-bold" : "text-gray-500"}`}>
                    {ratingLabels[star]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Phần Theo trải nghiệm (Tiêu chí dùng để chấm điểm và tự động quy đổi ra đánh giá chung) */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900">Theo trải nghiệm</h4>
            
            <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              {[
                { key: "quality", label: "Chất lượng sản phẩm", text: "Tuyệt vời, bền đẹp" },
                { key: "descriptionMatch", label: "Đúng với mô tả", text: "Chuẩn như quảng cáo" },
                { key: "priceValue", label: "Giá cả / Giá trị", text: "Hợp lý, đáng tiền" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 font-medium w-40">{item.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setDetailedRatings({ ...detailedRatings, [item.key]: s })}
                        className={`text-base ${s <= detailedRatings[item.key] ? "text-yellow-400" : "text-gray-200"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="text-gray-500 font-medium w-40 text-right">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Ô Textarea nhập bình luận */}
          <div className="relative">
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 kí tự)"
              className="w-full p-4 text-xs text-gray-900 placeholder-gray-400 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#d70018] resize-none shadow-sm"
            ></textarea>
          </div>

          {/* 4. Nút Thêm hình ảnh */}
          <div>
            <button 
              type="button"
              className="flex flex-col items-center justify-center w-28 h-24 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#d70018] hover:bg-red-50/10 transition-all group"
            >
              <span className="text-xl text-gray-400 group-hover:text-[#d70018] mb-1">📷</span>
              <span className="text-[11px] font-medium text-gray-600 group-hover:text-[#d70018]">Thêm hình ảnh</span>
            </button>
          </div>

        </div>

        {/* Footer Modal với Nút Gửi Đánh Giá (Dùng shrink-0 để giữ cố định ở dưới) */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#d70018] hover:bg-[#c50016] text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "ĐANG GỬI..." : "GỬI ĐÁNH GIÁ"}
          </button>
        </div>

      </form>
    </div>
  );
}