"use client";
import { useState, useEffect } from 'react';
import { updateProfile } from '../../services/userService'; // Hoặc đường dẫn api update profile của bạn

const UpdateProfileModal = ({ isOpen, onClose, currentUser, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthday: '',
    gender: 'male',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Khi modal mở lên, điền sẵn thông tin hiện tại của user vào form
  useEffect(() => {
    if (currentUser && isOpen) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        birthday: currentUser.birthday ? currentUser.birthday.split('T')[0] : '',
        gender: currentUser.gender || 'male',
      });
      setPreviewAvatar(currentUser.avatar ? `http://localhost:5000/uploads/users/${currentUser.avatar}` : '');
      setAvatarFile(null);
      setMessage({ type: '', text: '' });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // Xử lý khi chọn file ảnh mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file)); // Tạo URL tạm để preview ảnh ngay lập tức
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Dùng FormData vì có đính kèm file ảnh (multipart/form-data)
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('birthday', formData.birthday);
      data.append('gender', formData.gender);
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      // Gọi API cập nhật (Giả sử bạn gọi service update profile truyền FormData)
      const response = await updateProfile(data); 

      setMessage({ type: 'success', text: "Cập nhật thông tin thành công!" });
      
      // Báo về component cha để cập nhật lại state user nếu cần
      if (onUpdateSuccess) {
        onUpdateSuccess(response); 
      }

      setTimeout(() => { 
        onClose(); 
      }, 1500);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || "Lỗi khi cập nhật thông tin" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
        
        <h2 className="text-xl font-bold mb-6">Cập nhật thông tin cá nhân</h2>
        
        {message.text && (
          <div className={`p-3 mb-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Phần chọn Avatar */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 border border-gray-300 mb-2">
                <img 
                  src={previewAvatar || "https://via.placeholder.com/150"} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline">
                <span>Chọn ảnh đại diện mới</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            {/* Họ và tên */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Họ và tên</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none text-sm" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Số điện thoại</label>
              <input 
                type="text" 
                value={formData.phone}
                className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none text-sm" 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Giới tính</label>
              <select 
                value={formData.gender}
                className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none text-sm"
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Ngày sinh</label>
              <input 
                type="date" 
                value={formData.birthday}
                className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none text-sm" 
                onChange={(e) => setFormData({...formData, birthday: e.target.value})} 
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading} 
            className="w-full mt-6 bg-[#004A7C] text-white py-3 rounded-lg font-bold hover:bg-[#003d66] transition-colors"
          >
            {loading ? "Đang xử lý..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;