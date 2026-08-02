"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/account/Sidebar';
import { useAuth } from "../../context/AuthContext";
import ChangePasswordModal from '../../components/account/ChangePasswordModal'; 
import UpdateProfileModal from '../../components/modals/UpdateProfileModal';
import AddAddressModal from '../../components/modals/addAddressModal';
import EditAddressModal from '../../components/modals/EditAddressModal'; // <-- 1. Import Modal Cập nhật địa chỉ
import { getAddresses } from "../../services/addressService"; // Import hàm lấy danh sách địa chỉ

const AccountInfoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  // State quản lý Modal Cập nhật địa chỉ và địa chỉ đang chọn để sửa
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // State lưu danh sách địa chỉ của user
  const [addressList, setAddressList] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const { user, setUser } = useAuth(); // Lấy trực tiếp user từ AuthContext

  // Hàm gọi API lấy danh sách địa chỉ
  const fetchUserAddresses = async () => {
    try {
      setLoadingAddress(true);
      const res = await getAddresses();
      // Tùy thuộc vào cấu trúc trả về của backend (res.data hoặc res), gán dữ liệu cho phù hợp
      setAddressList(res.data || res || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách địa chỉ:", error);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Gọi API lấy địa chỉ khi vừa vào trang
  useEffect(() => {
    fetchUserAddresses();
  }, []);

  // Format ngày sinh từ dạng Date của MongoDB sang DD/MM/YYYY
  const formatBirthday = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('vi-VN');
  };

  // Format giới tính sang tiếng Việt
  const formatGender = (gender) => {
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    if (gender === 'other') return 'Khác';
    return '-';
  };

  // Lọc ra địa chỉ mặc định từ danh sách addressList để hiển thị ở thông tin cá nhân
  const defaultAddressObj = addressList.find(addr => addr.isDefault);
  const defaultAddressString = defaultAddressObj 
    ? `${defaultAddressObj.detail}, ${defaultAddressObj.ward}, ${defaultAddressObj.district}, ${defaultAddressObj.province}`
    : (user?.address || '-');

  return (
    <div className="flex gap-6 p-6 bg-[#f4f4f4] min-h-screen">
      <Sidebar user={user} />
      
      <main className="flex-1 space-y-6">
        {/* Khối 1: Thông tin cá nhân */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Thông tin cá nhân</h2>
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="text-red-500 text-sm flex items-center gap-1 font-medium hover:underline cursor-pointer"
            >
              <span>✎</span> Cập nhật
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
           <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.avatar ? (
                <img 
                  src={`https://devninjas-tech-website-be.onrender.com/uploads/users/${user.avatar}`} 
                  alt={user?.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-800">{user?.name || '-'}</h3>
              <p className="text-sm text-gray-500">{user?.email || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Họ và tên:</span> 
              <span className="font-medium text-gray-800">{user?.name || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Số điện thoại:</span> 
              <span className="font-medium text-gray-800">{user?.phone || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Giới tính:</span> 
              <span className="font-medium text-gray-800">{formatGender(user?.gender)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Email:</span> 
              <span className="font-medium text-gray-800">{user?.email || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Ngày sinh:</span> 
              <span className="font-medium text-gray-800">{formatBirthday(user?.birthday)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Địa chỉ mặc định:</span> 
              <span className="font-medium text-gray-800 text-right max-w-xs truncate" title={defaultAddressString}>
                {defaultAddressString}
              </span>
            </div>
          </div>
        </section>

        {/* Khối 2: Sổ địa chỉ */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Sổ địa chỉ</h2>
            <button 
              onClick={() => setIsAddressModalOpen(true)}
              className="text-red-500 text-sm font-medium hover:underline cursor-pointer"
            >
              + Thêm địa chỉ
            </button>
          </div>

          {loadingAddress ? (
            <div className="py-8 text-center text-sm text-gray-400">Đang tải danh sách địa chỉ...</div>
          ) : addressList.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {addressList.map((addr, index) => (
                <div key={addr._id || index} className="p-4 border border-gray-200 rounded-xl flex flex-col justify-between space-y-3 bg-white shadow-xs">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{addr.addressName || 'Địa chỉ'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {addr.addressType === 'home' ? 'Nhà' : 'Văn phòng'}
                        </span>
                        {addr.isDefault && (
                          <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Mặc định
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 font-medium">
                      {user?.name || 'User'} <span className="text-gray-300 mx-1">|</span> {user?.phone || 'Chưa có SĐT'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                    </p>
                  </div>
                  <div className="flex justify-end gap-4 text-xs font-medium pt-2 border-t border-gray-100">
                    <button className="text-gray-500 hover:text-red-500 transition-colors">Xóa</button>
                    {/* 2. Gắn sự kiện click mở modal sửa và truyền đúng dữ liệu của địa chỉ đó vào */}
                    <button 
                      onClick={() => {
                        setSelectedAddress(addr);
                        setIsEditAddressModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <p className="text-sm">Bạn chưa có địa chỉ nào được tạo</p>
            </div>
          )}
        </section>

        {/* Khối 3: Mật khẩu & Tài khoản liên kết */}
        <div className="grid grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Mật khẩu</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-red-500 text-sm flex items-center gap-1 font-medium hover:underline cursor-pointer"
              >
                <span>✎</span> Thay đổi mật khẩu
              </button>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Cập nhật lần cuối:</span>
              <span className="font-medium">05/11/2025 10:05</span>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-6">Tài khoản liên kết</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">G</span> Google
                  <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs">Đã liên kết</span>
                </div>
                <button className="text-red-500 text-sm cursor-pointer">⎋ Hủy liên kết</button>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">Z</span> Zalo
                </div>
                <button className="text-red-500 text-sm cursor-pointer">🔗 Liên kết</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modal cập nhật thông tin cá nhân */}
      <UpdateProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        currentUser={user}
        onUpdateSuccess={(updatedData) => {
          if (setUser && updatedData?.data) {
            setUser(updatedData.data);
          }
        }}
      />

      {/* Modal thay đổi mật khẩu */}
      <ChangePasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Modal Thêm địa chỉ mới */}
      <AddAddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressAdded={fetchUserAddresses}
        existingAddresses={addressList}
      />

      {/* 3. Modal Cập nhật địa chỉ */}
      <EditAddressModal 
        isOpen={isEditAddressModalOpen}
        onClose={() => {
          setIsEditAddressModalOpen(false);
          setSelectedAddress(null);
        }}
        addressData={selectedAddress}
        existingAddresses={addressList}
        onAddressUpdated={fetchUserAddresses}
      />
    </div>
  );
};

export default AccountInfoPage;