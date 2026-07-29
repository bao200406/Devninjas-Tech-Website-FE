import { useState } from "react";

const CANCEL_REASONS = [
  "Hết hàng (Sản phẩm tạm thời không đủ)",
  "Không liên lạc được với khách hàng",
  "Khách hàng yêu cầu hủy đơn",
  "Địa chỉ giao hàng không chính xác / Không giao được",
  "Lý do khác (Nhập bên dưới)"
];

export default function CancelOrderModal({ isOpen, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const finalReason = selectedReason.includes("Lý do khác") ? customReason : selectedReason;
    if (selectedReason.includes("Lý do khác") && !customReason.trim()) {
      alert("Vui lòng nhập chi tiết lý do khác!");
      return;
    }
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Chọn lý do hủy đơn hàng</h3>
        
        <div className="space-y-2">
          {CANCEL_REASONS.map((reason, idx) => (
            <label key={idx} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
              <input 
                type="radio" 
                name="cancelReason" 
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="accent-slate-900"
              />
              {reason}
            </label>
          ))}
        </div>

        {selectedReason.includes("Lý do khác") && (
          <textarea 
            placeholder="Nhập cụ thể lý do hủy..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none mt-2"
            rows={3}
          />
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 shadow-sm"
          >
            Xác nhận hủy đơn
          </button>
        </div>
      </div>
    </div>
  );
}