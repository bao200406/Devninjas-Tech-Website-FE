"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Search, Check } from 'lucide-react';
import {fetchAddressData} from "../../app/api/addressAPI";
import { createAddress } from "../../services/addressService";
import ConfirmDefaultAddressDialog from '../dialog/addressDialog';
import { toast } from "react-toastify";

const AddAddressModal = ({ isOpen, onClose, onAddressAdded, existingAddresses = [] }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    province: "",
    district: "",
    ward: "",
    detail: "",
    addressName: "",
    addressType: "Nhà",
    isDefault: false,
  });

  const [addressList, setAddressList] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // State quản lý tìm kiếm
  const [provinceSearch, setProvinceSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        const data = await fetchAddressData();
        setAddressList(data);
      };
      loadData();
    } else {
      // Reset form khi đóng modal
      setFormData({
        province: "",
        district: "",
        ward: "",
        detail: "",
        addressName: "",
        addressType: "Nhà",
        isDefault: false,
      });
      setActiveDropdown(null);
      setProvinceSearch("");
      setDistrictSearch("");
      setWardSearch("");
      setErrorMessage("");
      setShowConfirmDialog(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const filteredProvinces = addressList.filter(p => p.name.toLowerCase().includes(provinceSearch.toLowerCase()));
  const filteredDistricts = districts.filter(d => d.name.toLowerCase().includes(districtSearch.toLowerCase()));
  const filteredWards = wards.filter(w => w.name.toLowerCase().includes(wardSearch.toLowerCase()));

  const handleSelectProvince = (prov) => {
    setFormData({ ...formData, province: prov.name, district: "", ward: "" });
    setDistricts(prov.districts || []);
    setWards([]);
    setActiveDropdown(null);
    setProvinceSearch("");
  };

  const handleSelectDistrict = (dist) => {
    setFormData({ ...formData, district: dist.name, ward: "" });
    setWards(dist.wards || []);
    setActiveDropdown(null);
    setDistrictSearch("");
  };

  const handleSelectWard = (wardName) => {
    setFormData({ ...formData, ward: wardName });
    setActiveDropdown(null);
    setWardSearch("");
  };

  // Hàm thực thi gọi API lưu địa chỉ thực tế sau khi đã xác nhận hoặc không vướng mặc định
// Hàm thực thi gọi API lưu địa chỉ thực tế sau khi đã xác nhận hoặc không vướng mặc định
const executeSaveAddress = async () => {
    const mappedAddressType = formData.addressType === "Nhà" ? "home" : "office";

    const payload = {
      ...formData,
      addressType: mappedAddressType
    };

    try {
      setLoading(true);
      const res = await createAddress(payload); 
      
      // Kiểm tra trạng thái success do Backend trả về
      if (res && res.success) {
        if (onAddressAdded) {
          onAddressAdded(res.data);
        }
        toast.success("Thêm địa chỉ thành công!");
        setShowConfirmDialog(false);
        onClose();
      } else {
        // Lỗi nghiệp vụ (VD: thiếu phone) được xử lý mượt mà ở đây, KHÔNG bật bảng đỏ Next.js
        const errMessage = res?.message || "Có lỗi xảy ra, vui lòng thử lại sau.";
        
        if (errMessage.toLowerCase().includes("phone") || errMessage.toLowerCase().includes("required")) {
          toast.warning("Vui lòng cập nhật số điện thoại trong thông tin cá nhân!");
        } else {
          toast.error(errMessage);
        }
      }
    } catch (error) {
      // Khối này chỉ chạy khi mất kết nối mạng hoàn toàn
      console.error("Lỗi mạng:", error);
      toast.error("Không thể kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi Submit form gửi dữ liệu lên Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.province || !formData.district || !formData.ward || !formData.detail) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin tỉnh, huyện, xã và địa chỉ chi tiết!");
      return;
    }

    const hasExistingDefault = existingAddresses?.some(addr => addr.isDefault);

    if (formData.isDefault && hasExistingDefault) {
      setShowConfirmDialog(true);
      return;
    }

    const mappedAddressType = formData.addressType === "Nhà" ? "home" : "office";

    const payload = {
      ...formData,
      addressType: mappedAddressType
    };

    try {
      setLoading(true);
      const res = await createAddress(payload); 
      
      if (res && res.success) {
        if (onAddressAdded) {
          onAddressAdded(res.data);
        }
        toast.success("Thêm địa chỉ thành công!");
        onClose();
      } else {
        const errMessage = res?.message || "Có lỗi xảy ra, vui lòng thử lại sau.";
        
        if (errMessage.toLowerCase().includes("phone") || errMessage.toLowerCase().includes("required")) {
          toast.warning("Vui lòng cập nhật số điện thoại trong thông tin cá nhân!");
        } else {
          toast.error(errMessage);
        }
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
      toast.error("Không thể kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
          
          <h2 className="text-xl font-bold mb-6">Thêm địa chỉ</h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              
              {/* 1. Tỉnh/Thành phố */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Tỉnh/Thành phố</label>
                <div 
                  onClick={() => setActiveDropdown(activeDropdown === 'province' ? null : 'province')}
                  className="w-full p-3 bg-[#F4F4F4] rounded-lg flex justify-between items-center cursor-pointer text-sm"
                >
                  <span className={formData.province ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {formData.province || "Chọn Tỉnh/Thành phố"}
                  </span>
                  <div className="flex items-center gap-2">
                    {formData.province && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({...formData, province: "", district: "", ward: ""});
                          setDistricts([]);
                          setWards([]);
                        }}
                        className="w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs"
                      >
                        ✕
                      </span>
                    )}
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${activeDropdown === 'province' ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {activeDropdown === 'province' && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#F4F4F4] rounded-md mb-2">
                      <Search size={14} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm" 
                        value={provinceSearch}
                        onChange={(e) => setProvinceSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-xs text-gray-700"
                        autoFocus
                      />
                    </div>
                    <ul className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredProvinces.map((prov) => {
                        const isSelected = formData.province === prov.name;
                        return (
                          <li 
                            key={prov.code} 
                            onMouseDown={() => handleSelectProvince(prov)} 
                            className={`flex items-center justify-between p-2 text-xs rounded cursor-pointer ${isSelected ? 'text-red-600 font-medium bg-red-50/50' : 'hover:bg-gray-100 text-gray-700'}`}
                          >
                            <span>{prov.name}</span>
                            {isSelected && <Check size={14} className="text-red-600" />}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Quận/Huyện */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Quận/Huyện</label>
                <div 
                  onClick={() => formData.province && setActiveDropdown(activeDropdown === 'district' ? null : 'district')}
                  className={`w-full p-3 bg-[#F4F4F4] rounded-lg flex justify-between items-center text-sm ${!formData.province ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className={formData.district ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {formData.district || "Chọn Quận/Huyện"}
                  </span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${activeDropdown === 'district' ? 'rotate-180' : ''}`} />
                </div>

                {activeDropdown === 'district' && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#F4F4F4] rounded-md mb-2">
                      <Search size={14} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm" 
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-xs text-gray-700"
                        autoFocus
                      />
                    </div>
                    <ul className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredDistricts.map((dist) => {
                        const isSelected = formData.district === dist.name;
                        return (
                          <li 
                            key={dist.code} 
                            onMouseDown={() => handleSelectDistrict(dist)} 
                            className={`flex items-center justify-between p-2 text-xs rounded cursor-pointer ${isSelected ? 'text-red-600 font-medium bg-red-50/50' : 'hover:bg-gray-100 text-gray-700'}`}
                          >
                            <span>{dist.name}</span>
                            {isSelected && <Check size={14} className="text-red-600" />}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* 3. Phường/Xã */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Phường/Xã</label>
                <div 
                  onClick={() => formData.district && setActiveDropdown(activeDropdown === 'ward' ? null : 'ward')}
                  className={`w-full p-3 bg-[#F4F4F4] rounded-lg flex justify-between items-center text-sm ${!formData.district ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className={formData.ward ? "text-gray-800 font-medium" : "text-gray-400"}>
                    {formData.ward || "Chọn Phường/Xã"}
                  </span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${activeDropdown === 'ward' ? 'rotate-180' : ''}`} />
                </div>

                {activeDropdown === 'ward' && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#F4F4F4] rounded-md mb-2">
                      <Search size={14} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm" 
                        value={wardSearch}
                        onChange={(e) => setWardSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-xs text-gray-700"
                        autoFocus
                      />
                    </div>
                    <ul className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredWards.map((ward) => {
                        const isSelected = formData.ward === ward.name;
                        return (
                          <li 
                            key={ward.code} 
                            onMouseDown={() => handleSelectWard(ward.name)} 
                            className={`flex items-center justify-between p-2 text-xs rounded cursor-pointer ${isSelected ? 'text-red-600 font-medium bg-red-50/50' : 'hover:bg-gray-100 text-gray-700'}`}
                          >
                            <span>{ward.name}</span>
                            {isSelected && <Check size={14} className="text-red-600" />}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* 4. Địa chỉ nhà */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Địa chỉ nhà</label>
                <input 
                  type="text" 
                  placeholder="Nhập địa chỉ nhà (số nhà, tên đường...)" 
                  value={formData.detail}
                  onChange={(e) => setFormData({...formData, detail: e.target.value})}
                  className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none text-sm" 
                />
              </div>

              <hr className="border-dashed border-gray-300 my-2" />

              {/* 5. Đặt tên gợi nhớ */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Đặt tên gợi nhớ</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Nhà riêng, Công ty..." 
                  value={formData.addressName}
                  onChange={(e) => setFormData({...formData, addressName: e.target.value})}
                  className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none text-sm" 
                />
              </div>

              {/* 6. Loại địa chỉ */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Loại địa chỉ</label>
                <div className="flex gap-3">
                  {['Nhà', 'Văn phòng'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setFormData({...formData, addressType: type})}
                      className={`px-5 py-2.5 rounded-lg text-xs font-semibold border transition-all ${formData.addressType === type ? 'border-[#004A7C] text-[#004A7C] bg-blue-50/50' : 'border-gray-200 text-gray-600 bg-[#F4F4F4]'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-dashed border-gray-300 my-2" />

              {/* 7. Đặt làm địa chỉ mặc định */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-gray-700">Đặt làm địa chỉ mặc định</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004A7C]"></div>
                </label>
              </div>

            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#004A7C] text-white py-3 rounded-lg font-bold hover:bg-[#003d66] transition-colors disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Thêm địa chỉ"}
            </button>
          </form>
        </div>
      </div>

      <ConfirmDefaultAddressDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        loading={loading}
        onConfirm={executeSaveAddress}
      />
    </>
  );
};

export default AddAddressModal;