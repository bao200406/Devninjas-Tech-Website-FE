"use client";

import Image from "next/image";
import { useState , useEffect  } from "react";
import { NotebookPen } from "lucide-react";
import {
  CreditCard,
  Landmark,
  ShieldCheck,
  Truck,
  Zap,
  BadgeDollarSign,
  RotateCcw,
  Headset,
} from "lucide-react";
import * as orderService from "../../services/orderService";
import {getCart} from "../../services/cartService";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cartItems, setCartItems] = useState([]);

    const [formData, setFormData] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverEmail: "",
    province: "",
    ward: "",
    address: "",
  });

    const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const fetchCart = async () => {
      try {
        const response = await getCart();

        console.log("Cart response:", response);

        setCartItems(response.data.items);
      } catch (error) {
           console.log("ERROR:", error.response?.data);
      }
    };

    useEffect(() => {
      fetchCart();
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const order = await orderService.createOrder({
        ...formData,
      });

      console.log(order);

    } catch (error) {
      console.error(error);
    }
    };



          // Tạm tính
      const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Tạm thời chưa làm ship
      const shippingFee = 0;

      // Tạm thời chưa làm voucher
      const discount = 0;

      // Tổng tiền
      const totalPrice = subtotal + shippingFee - discount;

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-4 py-6">
      <div className="mx-auto max-w-[1180px]">
      {/* Content */}
          <form action="" onSubmit={handleSubmit} className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Receiver Info */}
              <div className="rounded-xl p-1">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005BAC] text-sm font-semibold text-white">
                    1
                  </div>

                  <h2 className="text-[15px] font-semibold text-gray-800">
                    Thông tin người nhận
                  </h2>
                </div>

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
                      aria-label="Tỉnh hoặc thành phố"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="rounded-lg border border-gray-300 bg-[#f5f5f7] px-4 py-3 outline-none"
                    >
                      <option value="">Chọn tỉnh/thành</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    </select>

                    <select
                      aria-label="Phường hoặc xã"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      className="rounded-lg border border-gray-300 bg-[#f5f5f7] px-4 py-3 outline-none"
                    >
                      <option value="">Chọn phường/xã</option>
                      <option value="Phường Đa Kao">Phường Đa Kao</option>
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
                  </div>
                </div>
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

                  <span className="font-medium">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </label>

                {/* Bank */}
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    paymentMethod === "bank"
                      ? "border-[#005BAC] bg-[#f8fbff]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <Landmark size={18} />

                  <span>Chuyển khoản</span>
                </label>

                {/* Visa */}
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    paymentMethod === "visa"
                      ? "border-[#005BAC] bg-[#f8fbff]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="visa"
                    checked={paymentMethod === "visa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <CreditCard size={18} />

                  <span>Thẻ Visa / Mastercard</span>
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
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
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
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Voucher */}
              <div className="mt-6 flex gap-3">
                <input
                  type="text"
                  placeholder="Mã giảm giá / Voucher"
                  className="flex-1 rounded-lg border border-gray-300 bg-[#CCCCCC] px-4 py-3 outline-none"
                />

                <button className="rounded-lg bg-[#336699] px-5 font-medium text-white">
                  Áp dụng
                </button>
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
                    -{discount.toLocaleString("vi-VN")}đ
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

