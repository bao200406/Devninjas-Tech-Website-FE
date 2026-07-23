import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createAttribute } from "../../services/attributeService";
import { createAttributeValue } from "../../services/attributeValueService";
import { toast } from "react-toastify";

const AddAttributeModal = ({ isOpen, onClose, onAddSuccess }) => {
  const [data, setData] = useState({ name: "", value: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!data.name || !data.value) return alert("Vui lòng nhập đầy đủ");
    
    setLoading(true);
    try {
      // 1. Gọi API tạo Attribute
      const attrRes = await createAttribute({ name: data.name }); 
      
      // 2. Gọi API tạo Value bằng ID vừa nhận được
      await createAttributeValue({ 
        attributeId: attrRes.data._id, 
        value: data.value 
      });
      // 3. Thông báo thành công
      toast.success("Thêm thuộc tính thành công!");
 // Callback để load lại danh sách ở component cha
      onClose();
      setData({ name: "", value: "" }); // Reset form
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm thuộc tính");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Thêm thuộc tính mới</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-2">Tên thuộc tính</label>
            <input 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-slate-400"
              placeholder="VD: Màu sắc"
              value={data.name}
              onChange={(e) => setData({...data, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-2">Giá trị</label>
            <input 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-slate-400"
              placeholder="VD: Đỏ"
              value={data.value}
              onChange={(e) => setData({...data, value: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
        >
          {loading ? "Đang lưu..." : "Lưu thuộc tính"}
        </button>
      </div>
    </div>
  );
};

export default AddAttributeModal;