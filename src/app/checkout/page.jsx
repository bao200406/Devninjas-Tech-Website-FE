"use client";

import { getAddresses, createAddress } from "../../services/addressService";
import { fetchAddressData } from "../api/addressAPI";
import { getMe } from "../../services/authService";
import Image from "next/image";
import { useState , useEffect  } from "react";
import { NotebookPen } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Landmark,
  ShieldCheck,
  Truck,
  Zap,
  BadgeDollarSign,
  RotateCcw,
  Headset,
  TicketPercent,
} from "lucide-react";
import * as orderService from "../../services/orderService";
import {getCart} from "../../services/cartService";
import { getAvailableVouchers, applyVoucher } from "../../services/voucherService";
import { createStripePayment, createCODOrder } from "../../services/paymentService";

const getPublicUrl = (path) => {
  if (!path) return "/placeholder.png"; // Trả về ảnh mặc định nếu không có path
  if (path.startsWith("http")) return path;

  const index = path.indexOf('uploads');
  if (index === -1) return path;
  
  const relativePath = path.substring(index).replace(/\\/g, '/');
  return `https://devninjas-tech-website-be.onrender.com/${relativePath}`;
};

export default function CheckoutPage() {
 
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cartItems, setCartItems] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [isVoucherListOpen, setIsVoucherListOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
   const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
  );
  const [appliedVoucher, setAppliedVoucher] = useState(null); // Lưu thông tin voucher đã chọn
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();

    const [formData, setFormData] = useState({
      
    receiverName: "",
    receiverPhone: "",
    receiverEmail: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });
  const [hasDefaultAddress, setHasDefaultAddress] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [originalAddress, setOriginalAddress] = useState("");
  const [showDefaultOption, setShowDefaultOption] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useAnotherAddress, setUseAnotherAddress] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

    const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
      const handleSaveAddress = async () => {
  try {
    const response = await createAddress({
      fullname: formData.receiverName,
      phone: formData.receiverPhone,
      email: formData.receiverEmail,
      province: formData.province,
      district: formData.district,
      ward: formData.ward,
      detail: formData.address,
      isDefault: setAsDefault,
    });

    const newAddress = response.data;

if (newAddress.isDefault) {
  setAddresses((prev) =>
    prev.map((addr) => ({
      ...addr,
      isDefault: false,
    })).concat(newAddress)
  );
} else {
  setAddresses((prev) => [...prev, newAddress]);
}

    setSelectedAddress(newAddress);

    setUseAnotherAddress(false);
  } catch (err) {
    console.log(err);
    alert("Không thể lưu địa chỉ");
  }
};

    const fetchCart = async () => {
      try {
        const response = await getCart();

        console.log(response);

        setCartItems(response?.data?.items || []);
      } catch (error) {
           console.log("ERROR:", error.response?.data);
      }
    };
    useEffect(() => {
      fetchCart();
    }, []);

    useEffect(() => {
      if (!appliedVoucher) {
        setTotalPrice(subtotal);
      }
    }, [subtotal, appliedVoucher]);


    useEffect(() => {
      const loadProvince = async () => {
        try {
          const data = await fetchAddressData();
          setProvinces(data);
        } catch (err) {
          console.log(err);
        }
      };

      loadProvince();
    }, []);


    useEffect(() => {
      const fetchDefaultAddress = async () => {
        try {
          const [addressRes, user] = await Promise.all([
            getAddresses(),
            getMe(),
          ]);
          setUserInfo(user);
          const addressList = addressRes.data || [];

          setAddresses(addressList);
const hasDefault = addressList.some(item => item.isDefault);

setHasDefaultAddress(hasDefault);

const defaultAddress =
addressList.find(item => item.isDefault) ||
addressList[0];

if (!defaultAddress) {
    setUseAnotherAddress(true);
    return;
}

setSelectedAddress(defaultAddress);

              setFormData({
                receiverName: defaultAddress.fullname || "",
                receiverPhone: defaultAddress.phone || "",
                receiverEmail: user.email || "",
                province: defaultAddress.province || "",
                district: defaultAddress.district || "",
                ward: defaultAddress.ward || "",
                address: defaultAddress.detail || "",
              });
                    setOriginalAddress(
              `${defaultAddress.province}-${defaultAddress.district}-${defaultAddress.ward}-${defaultAddress.detail}`
          );

          const data = await fetchAddressData();

          const selectedProvince = data.find(
            (p) => p.name === defaultAddress.province
          );

          if (selectedProvince) {
            setDistricts(selectedProvince.districts || []);

            const selectedDistrict = selectedProvince.districts.find(
              (d) => d.name === defaultAddress.district
            );

            if (selectedDistrict) {
              setWards(selectedDistrict.wards || []);
            }
          }

        } catch (error) {
          console.error(error);
        }
      };

      fetchDefaultAddress();
    }, []);
    useEffect(() => {
      const currentAddress =
        `${formData.province}-${formData.district}-${formData.ward}-${formData.address}`;

      if (!originalAddress) {
        // Chưa có địa chỉ mặc định
        setShowDefaultOption(
          !!(
            formData.province ||
            formData.district ||
            formData.ward ||
            formData.address
          )
        );
        return;
      }

      setShowDefaultOption(currentAddress !== originalAddress);
    }, [formData, originalAddress]);
    // Thêm vào ngay sau khi khai báo các useState
    useEffect(() => {
      const initDraftOrder = async () => {
        try {
          // Gọi API tạo đơn nháp (đảm bảo Backend của bạn có API này)
          // Chỉ cần gửi thông tin tối thiểu để có orderId
          const response = await orderService.createOrder({ 
            status: 'draft', 
            cartItems: cartItems 
          });
          if (response.success) {
            setOrderId(response.data.orderId || response.data.orderCode); 
          }
        } catch (err) {
          console.error("Lỗi tạo đơn nháp:", err);
        }
      };

      if (cartItems.length > 0) initDraftOrder();
    }, [cartItems]); // Chạy khi có giỏ hàng

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!orderId) return alert("Đang khởi tạo đơn hàng, vui lòng thử lại sau giây lát.");

      const orderData = {
        ...formData,
        paymentMethod: paymentMethod,
        voucherId: appliedVoucher?._id,
        status: 'pending', // Chuyển trạng thái sang chờ thanh toán
        setAsDefault,
      };

      try {
        // 1. Cập nhật thông tin đơn hàng trước
        const response = await orderService.updateOrder(orderId, orderData);

        if (response.success) {
          // 2. Nếu chọn thanh toán bằng Stripe, gọi API tạo link thanh toán Stripe
          if (paymentMethod === "stripe") {
            const stripeRes = await createStripePayment({ orderId, totalPrice });
            // Kiểm tra cấu trúc trả về từ service của bạn (thường là stripeRes.url hoặc stripeRes.data.url)
            const stripeUrl = stripeRes?.url || stripeRes?.data?.url;
            
            if (stripeUrl) {
              window.location.href = stripeUrl; // Chuyển hướng sang trang thanh toán Stripe
              return;
            } else {
              alert("Không thể tạo liên kết thanh toán Stripe.");
              return;
            }
          }

          // 3. Nếu là COD hoặc các hình thức khác thì đi đến trang success bình thường
          router.push(`/checkout/success?order_id=${response.data._id}`);
        }
      } catch (error) {
        console.error("Lỗi chốt đơn:", error);
        alert(error.response?.data?.message || "Có lỗi xảy ra khi xác nhận đơn hàng.");
      }
    };



      useEffect(() => {
        const fetchVouchers = async () => {
          if (subtotal > 0) {
            try {
              const response = await getAvailableVouchers(subtotal);
              setAvailableVouchers(response.data);
            } catch (error) {
              console.error("Không lấy được voucher:", error);
            }
          }
        };
        fetchVouchers();
      }, [subtotal]); // Cập nhật lại khi subtotal thay đổi

      const handleApplyVoucher = async (voucher) => {
        console.log("Voucher đang áp dụng:", voucher);
        try {
          if (!orderId) return alert("Đang khởi tạo đơn hàng, vui lòng đợi...");
           console.log("OrderID:", orderId);
          // Gọi API của bạn để Backend tính toán và lưu voucher vào Database
          const result = await applyVoucher(voucher.code, orderId);

          // Cập nhật state với dữ liệu trả về từ Backend
          setDiscount(result.data.discount);
          setTotalPrice(result.data.finalPrice);
          setAppliedVoucher(voucher);
          setIsVoucherListOpen(false);

          console.log("Giá trị totalPrice mới:", result);
          
          alert("Áp dụng mã thành công!");
        } catch (error) {
          alert(error.response?.data?.message || "Không thể áp dụng voucher");
        }
      };

      // Tạm thời chưa làm ship
      const shippingFee = 0;


  return (
    <div className="min-h-screen bg-[#f5f5f7] px-4 py-6">
      <div className="mx-auto max-w-[1180px]">
      {/* Content */}
          <form action="" onSubmit={handleSubmit} className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Receiver Info */}
              <div className="
                bg-white
                rounded-2xl
                border
                border-gray-200
                shadow-sm
                p-6">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005BAC] text-sm font-semibold text-white">
                    1
                  </div>

                  <h2 className="text-[15px] font-semibold text-gray-800">
                    Thông tin người nhận
                  </h2>
                </div>
              <div className="mt-4 space-y-3">

              {
              addresses.map((item)=>(
                
              <label
                key={item._id}
                className={`
                flex
                cursor-pointer
                items-start
                gap-3
                rounded-xl
                border
                p-4
                transition
              ${
                selectedAddress?._id === item._id?"border-[#005BAC] bg-blue-50":"border-gray-200 bg-white hover:border-blue-300"
              }
              `}
              >


              <input
              type="radio"
              name="address"
              checked={
              selectedAddress?._id === item._id
              }
              onChange={async()=>{


              setSelectedAddress(item);


              setFormData({
              receiverName:item.fullname || "",
              receiverPhone:item.phone || "",
              receiverEmail: userInfo?.email || "",
              province:item.province || "",
              district:item.district || "",
              ward:item.ward || "",
              address:item.detail || "",
              });


              // load lại tỉnh quận phường
              const data = await fetchAddressData();


              const province = data.find(
              p=>p.name===item.province
              );


              if(province){

              setDistricts(province.districts);


              const district = province.districts.find(
              d=>d.name===item.district
              );


              if(district){
              setWards(district.wards);
              }

              }


              }}
              className="
              mt-1
              h-4
              w-4
              accent-[#005BAC]
              "
              />


              <div className="flex-1">


              <div className="flex justify-between">

              <p className="font-semibold text-gray-800">
              {item.fullname}
              </p>


              {
              item.isDefault && (
              <span className="
              text-xs
              text-[#005BAC]
              font-medium
              ">
              Mặc định
              </span>
              )
              }
              </div>
              <p className="text-sm text-gray-600">
                {item.phone}
              </p>
              <p className="text-sm text-gray-600">
                {userInfo?.email}
              </p>
              <p className="mt-1 text-sm text-gray-500">
              {item.detail},{" "}
              {item.ward},{" "}
              {item.district},{" "}
              {item.province}
              </p>
              </div>
              </label>
              ))
              }

              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setUseAnotherAddress(!useAnotherAddress)}
                  className="text-sm font-medium text-[#005BAC] hover:underline"
                >
                  {useAnotherAddress
                    ? "Ẩn biểu mẫu địa chỉ"
                    : "+ Sử dụng địa chỉ khác"}
                </button>
              </div>

              {useAnotherAddress && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                  <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

                    {/* Nút đóng */}
                    <button
                      type="button"
                      onClick={() => setUseAnotherAddress(false)}
                      className="absolute right-5 top-4 text-3xl text-gray-500 transition hover:text-black"
                    >
                      ×
                    </button>

                    <h2 className="mb-6 text-xl font-semibold text-gray-800">
                      Thêm địa chỉ mới
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm text-gray-600">
                          HỌ VÀ TÊN
                        </label>

                        <input
                          type="text"
                          name="receiverName"
                          value={formData.receiverName}
                          onChange={handleChange}
                          placeholder="Nguyễn Văn A"
                          className="w-full rounded-lg border border-gray-300 bg-[#f5f5f7] px-4 py-3 outline-none focus:border-[#005BAC]"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm text-gray-600">
                            SỐ ĐIỆN THOẠI
                          </label>

                          <input
                            type="text"
                            name="receiverPhone"
                            value={formData.receiverPhone}
                            onChange={handleChange}
                            placeholder="0901 234 567"
                            className="w-full rounded-lg border border-gray-300 bg-[#f5f5f7] px-4 py-3 outline-none focus:border-[#005BAC]"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-gray-600">
                            EMAIL
                          </label>

                          <input
                            type="email"
                            name="receiverEmail"
                            value={formData.receiverEmail}
                            onChange={handleChange}
                            placeholder="example@azurelogic.vn"
                            className="w-full rounded-lg border border-gray-300 bg-[#f5f5f7] px-4 py-3 outline-none focus:border-[#005BAC]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <select
                          name="province"
                          value={formData.province}
                          onChange={async (e) => {
                            const province = e.target.value;

                            const data = await fetchAddressData();

                            const selectedProvince = data.find(
                              (p) => p.name === province
                            );

                            setFormData({
                              ...formData,
                              province,
                              district: "",
                              ward: "",
                            });

                            setDistricts(selectedProvince?.districts || []);
                            setWards([]);
                          }}
                          className="rounded-lg border border-gray-300 bg-[#f5f5f7] px-4 py-3 outline-none"
                        >
                          <option value="">Chọn tỉnh/thành</option>

                          {provinces.map((item) => (
                            <option key={item.code} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>

                        <select
                          name="district"
                          value={formData.district}
                          onChange={(e) => {
                            const district = e.target.value;

                            const selectedDistrict = districts.find(
                              (item) => item.name === district
                            );

                            setFormData({
                              ...formData,
                              district,
                              ward: "",
                            });

                            setWards(selectedDistrict?.wards || []);
                          }}
                          className="rounded-lg border border-gray-300 bg-[#f5f5f7] px-4 py-3 outline-none focus:border-[#005BAC]"
                        >
                          <option value="">Chọn quận/huyện</option>

                          {districts.map((item) => (
                            <option key={item.code} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>

                        <select
                          name="ward"
                          value={formData.ward}
                          onChange={handleChange}
                          className="rounded-lg border border-gray-300 bg-[#f5f5f7] px-4 py-3 outline-none"
                        >
                          <option value="">Chọn phường/xã</option>

                          {wards.map((item) => (
                            <option key={item.code} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-600">
                          ĐỊA CHỈ CỤ THỂ
                        </label>

                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Số nhà, tên đường..."
                          className="w-full rounded-lg border border-gray-300 bg-[#f5f5f7] px-4 py-3 outline-none focus:border-[#005BAC]"
                        />

                        {showDefaultOption && (
                          <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                            <label className="flex cursor-pointer items-start gap-3">
                              <input
                                type="checkbox"
                                checked={setAsDefault}
                                onChange={(e) => setSetAsDefault(e.target.checked)}
                                className="mt-1 h-4 w-4 accent-[#005BAC]"
                              />

                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  {hasDefaultAddress
                                    ? "Đặt địa chỉ này làm địa chỉ mặc định"
                                    : "Đây sẽ là địa chỉ mặc định của bạn"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {hasDefaultAddress
                                    ? "Địa chỉ mặc định hiện tại sẽ được thay thế."
                                    : "Bạn có thể thay đổi địa chỉ mặc định bất kỳ lúc nào."}
                                </p>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setUseAnotherAddress(false)}
                          className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100"
                        >
                          Hủy
                        </button>

<button
  type="button"
  onClick={handleSaveAddress}
  className="rounded-lg bg-[#005BAC] px-5 py-2 text-white hover:bg-[#004b91]"
>
  Xác nhận
</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>

              {/* Shipping */}
              <div className="rounded-xl  ">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005BAC] text-sm font-semibold text-white">
                    2
                  </div>

                  <h2 className="text-[15px] font-semibold text-gray-800">
                    Phương thức giao hàng
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* item */}
                  <div className="rounded-xl border-2 border-[#005BAC] bg-[#f8fbff] p-4">
                    <Truck className="mb-3 text-[#005BAC]" size={22} />

                    <h3 className="font-semibold text-gray-800">
                      Giao tiêu chuẩn
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">3 - 5 ngày</p>

                    <p className="mt-4 font-semibold text-[#005BAC]">Miễn phí</p>
                  </div>

                  <div className="rounded-xl border bg-white p-4">
                    <Zap className="mb-3 text-orange-500" size={22} />

                    <h3 className="font-semibold text-gray-800">Giao nhanh</h3>

                    <p className="mt-1 text-sm text-gray-500">1 - 2 ngày</p>

                    <p className="mt-4 font-semibold text-gray-800">35.000đ</p>
                  </div>

                  <div className="rounded-xl border bg-white p-4">
                    <BadgeDollarSign
                      className="mb-3 text-amber-500"
                      size={22}
                    />

                    <h3 className="font-semibold text-gray-800">Hỏa tốc</h3>

                    <p className="mt-1 text-sm text-gray-500">2 - 4 giờ</p>

                    <p className="mt-4 font-semibold text-gray-800">85.000đ</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005BAC] text-sm font-semibold text-white">
                    3
                  </div>
                  <h2 className="text-[15px] font-semibold text-gray-800">
                    Phương thức thanh toán
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      paymentMethod === "cod"
                        ? "border-[#005BAC] bg-[#f8fbff]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <CreditCard size={18} />
                    <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                  </label>

                  {/* Stripe */}
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      paymentMethod === "stripe"
                        ? "border-[#005BAC] bg-[#f8fbff]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <CreditCard size={18} />
                    <span className="font-medium">Thanh toán Online (Stripe)</span>
                  </label>
                </div>
              </div>

              {/* Note */}
              <div className="rounded-xl">
                
                <h2 className="mb-4 text-[15px] font-semibold text-gray-800">
                  Ghi chú đơn hàng
                </h2>

                <textarea
                  rows={4}
                  placeholder="Lưu ý cho người giao hàng..."
                  className="w-full rounded-lg border border-gray-300 bg-[#f5f5f7] p-4 outline-none focus:border-[#005BAC]"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="self-start rounded-2xl bg-[#FFFFFF] p-2 lg:p-6">
              
              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Tóm tắt đơn hàng
              </h2>

              {/* Product */}
              <div className="space-y-5">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-white">
                      <img
                        src={getPublicUrl(item.image)}
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Màu sắc: {item.variantName}
                      </p>

                      <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                    </div>

                    <p className="text-sm font-semibold text-[#005BAC]">
                      {item.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                ))}
              </div>

              {/* Voucher */}
              <div className="mt-6">

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-[#005BAC]">
                      <TicketPercent size={20} strokeWidth={2.2} />
                    </div>

                    <h3 className="text-sm font-semibold text-gray-800">
                      Voucher giảm giá
                    </h3>
                  </div>


                  <button
                    type="button"
                    onClick={() => setIsVoucherListOpen(!isVoucherListOpen)}
                    className="text-sm font-medium text-[#005BAC] hover:underline"
                  >
                    {isVoucherListOpen ? "Thu gọn" : "Xem tất cả"}
                  </button>

                </div>


                {isVoucherListOpen && (

                  <div className="
                    space-y-3 
                    max-h-52 
                    overflow-y-auto
                    pr-1
                    scrollbar-thin
                  ">

                    {availableVouchers.length > 0 ? (

                      availableVouchers.map((v)=>(

                        <div
                          key={v._id}
                          className="
                            relative
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            border
                            border-dashed
                            border-blue-300
                            bg-gradient-to-r
                            from-blue-50
                            to-white
                            p-3
                            transition
                            hover:border-[#005BAC]
                            hover:shadow-md
                          "
                        >


                          {/* Left voucher */}
                          <div className="flex items-center gap-3">

                            <div className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-full
                              bg-[#005BAC]
                              text-white
                              text-lg
                            ">
                              %
                            </div>


                            <div>

                              <p className="
                                text-sm
                                font-bold
                                text-gray-800
                              ">
                                {v.code}
                              </p>


                              <p className="
                                text-xs
                                text-gray-500
                                mt-1
                              ">
                                Giảm{" "}
                                {
                                  v.type === "percentage"
                                  ? `${v.value}%`
                                  : `${v.value.toLocaleString("vi-VN")}đ`
                                }
                              </p>


                              <p className="
                                text-[11px]
                                text-gray-400
                                mt-1
                              ">
                                Áp dụng cho đơn hàng đủ điều kiện
                              </p>


                            </div>


                          </div>



                          {/* Button */}
                          <button

                            type="button"

                            onClick={() => handleApplyVoucher(v)}

                            className="
                              rounded-lg
                              bg-[#005BAC]
                              px-4
                              py-2
                              text-xs
                              font-semibold
                              text-white
                              transition
                              hover:bg-[#004a8f]
                              active:scale-95
                            "

                          >

                            Chọn

                          </button>



                        </div>

                      ))

                    ) : (

                      <div className="
                        rounded-xl
                        border
                        bg-gray-50
                        p-4
                        text-center
                      ">

                        <p className="text-sm text-gray-400">
                          Hiện không có voucher khả dụng
                        </p>

                      </div>

                    )}


                  </div>

                )}



                {/* Voucher đã chọn */}
                {appliedVoucher && (

                  <div className="
                    mt-3
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    bg-green-50
                    border
                    border-green-200
                    px-3
                    py-2
                  ">

                    <div>

                      <p className="
                        text-xs
                        font-semibold
                        text-green-700
                      ">
                        Đã áp dụng voucher
                      </p>


                      <p className="
                        text-sm
                        font-bold
                        text-green-800
                      ">
                        {appliedVoucher.code}
                      </p>

                    </div>


                    <span className="
                      text-sm
                      font-bold
                      text-green-600
                    ">
                      -{discount.toLocaleString("vi-VN")}đ
                    </span>


                  </div>

                )}


              </div>

              {/* Total */}
              <div className="mt-6 space-y-3 border-t pt-5 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                  <span>Tạm tính</span>

                  <span>
                    {subtotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-500">
                  <span>Phí vận chuyển</span>

                  <span className="text-blue-600">
                    {shippingFee === 0
                      ? "Miễn phí"
                      : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-500">
                  <span>Giảm giá</span>

                  <span className="text-[#663300]">
                      -{discount?.toLocaleString("vi-VN") || 0}đ
                    </span>
                </div>

                <div className="flex items-center justify-between border-t pt-4 text-lg font-bold">
                  <span>Tổng cộng</span>

                  <span className="text-[#005BAC]">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <button type="submit" className="mt-6 w-full rounded-xl bg-[#005BAC] py-4 text-sm font-semibold text-white transition hover:bg-[#004a8f]">
                XÁC NHẬN ĐẶT HÀNG
              </button>

              {/* Footer */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={18} />
                  <span>BẢO MẬT SSL</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <RotateCcw size={18} />
                  <span>30 NGÀY HOÀN TRẢ</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <Headset size={18} />
                  <span>HỖ TRỢ 24/7</span>
                </div>
              </div>
            </div>
          </form>
    </div>
    </div>
  );
}

