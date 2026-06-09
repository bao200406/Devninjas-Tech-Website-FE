import Image from "next/image"


const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    variant: "Titan Tự Nhiên / 8GB",
    price: 34990000,
    oldPrice: 36990000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzWCsCB1Uj4bVxc6OdywKG5aP8LNVQo2BiDgIHsWJS3A&s=10",
  },
  {
    id: 2,
    name: "iPad Pro 11 inch (M2) WiFi",
    variant: "Xám Không Gian / 8GB",
    price: 21490000,
    oldPrice: 22990000,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300",
  },
  {
    id: 3,
    name: "AirPods Pro (Gen 2) USB-C",
    variant: "Trắng / Tiêu chuẩn",
    price: 5990000,
    oldPrice: 6990000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBKx0_XqtXDyzaYLolXjMCzlZgDF0MM0juthDGe0P6tw&s=10",
  },
];

export default function CartPage() {
  const total = products.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">

      <div className="mx-auto max-w-[1360px] px-8 py-10">

        {/* TITLE */}

        <h1 className="text-[48px] font-bold leading-none text-[#1d1d1f]">
          Giỏ hàng của bạn
        </h1>

        <p className="mt-1 text-[15px] text-[#6e6e73]">
          Bạn đang có
          <span className="font-semibold text-[#0071e3]">
            {" "}
            {products.length} sản phẩm
          </span>
          {" "}trong giỏ hàng
        </p>

        <div className="mt-8 grid grid-cols-[1fr_450px] gap-7">

          {/* LEFT */}

          <div>

            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">

              <label className="flex items-center gap-4 text-[14px] font-medium text-[#1d1d1f]">

  <div
    className="
      w-[28px]
      h-[28px]
      border
      border-[#c9d1dc]
      bg-white
      flex
      items-center
      justify-center
      rounded-sm
    "
  >
    <span className="text-[#4d84c4] text-[16px] font-bold">
      ✓
    </span>
  </div>

  Chọn tất cả ({products.length})

</label>

              <button className="text-[13px] text-[#6e6e73] hover:text-red-500">
                🗑 Xóa đã chọn
              </button>

            </div>

            <div className="space-y-5 mt-5">

{products.map((item) => (
  <div
    key={item.id}
    className="
      bg-white
      border
      border-[#ececec]
      rounded-[10px]
      px-8
      py-6
      flex
      items-center
      gap-6
      w-full
    "
  >
    {/* Checkbox */}
    <div className="w-[50px] flex justify-center shrink-0">
      <div
        className="
          w-6
          h-6
          border-2
          border-[#cfd5dd]
          rounded-sm
          flex
          items-center
          justify-center
          bg-white
          text-[#0068c9]
          text-[14px]
          font-bold
        "
      >
        ✓
      </div>
    </div>

    {/* Image */}
    <div className="w-[120px] shrink-0">
      <Image
        src={item.image}
        alt={item.name}
        width={102}
        height={102}
        className="w-[102px] h-[102px] object-cover rounded-sm"
      />
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <h3 className="text-[20px] font-bold text-[#1d1d1f]">
        {item.name}
      </h3>

      <p className="mt-2 text-[15px] text-[#666]">
        Màu sắc / RAM: {item.variant}
      </p>

      <div
        className="
          mt-5
          flex
          items-center
          w-[88px]
          h-[34px]
          rounded
          bg-[#f2f3f7]
        "
      >
        <button className="w-8 text-[#555]">-</button>

        <div className="flex-1 text-center text-[15px] font-medium">
          1
        </div>

        <button className="w-8 text-[#555]">+</button>
      </div>
    </div>

    {/* Price */}
    <div className="w-[180px] shrink-0 text-right">
      <div className="text-[22px] font-bold text-[#005fa9]">
        {item.price.toLocaleString("vi-VN")}đ
      </div>

      <div className="mt-1 text-[14px] text-[#9c9c9c] line-through">
        {item.oldPrice.toLocaleString("vi-VN")}đ
      </div>

      <button className="mt-8 text-[#ef4444] text-[18px]">
        🗑
      </button>
    </div>
  </div>
))}

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="bg-white border border-[#e5e7eb] rounded-xl p-7">

              <h2 className="text-[18px] font-bold text-[#1d1d1f]">
                Tóm tắt đơn hàng
              </h2>

              <div className="mt-6 flex items-center justify-between text-[15px]">

                <span className="text-[#6e6e73]">
                  Tạm tính
                </span>

                <span className="font-semibold">
                  {total.toLocaleString("vi-VN")}đ
                </span>

              </div>

              <div className="mt-5 flex items-center justify-between text-[15px]">

                <span className="text-[#6e6e73]">
                  Phí vận chuyển
                </span>

                <span className="font-semibold text-[#005b9f]">
                  Miễn phí
                </span>

              </div>
              <div className="my-6 border-t border-[#e5e5e5]"></div>

              <div className="mt-6">

              <div className="mb-3 text-[16px] font-bold text-[#1d1d1f]">
                Mã giảm giá
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã ưu đãi..."
                  className="
                    flex-1
                    h-[58px]
                    px-5
                    rounded-md
                    bg-[#f2f3f7]
                    text-[15px]
                    text-[#8d93a1]
                    outline-none
                    border border-transparent
                    focus:border-[#405b83]
                  "
                />

                <button
                  className="
                    w-[95px]
                    h-[58px]
                    rounded-md
                    bg-[#4a6184]
                    text-white
                    text-[18px]
                    font-bold
                    leading-5
                    hover:bg-[#3f5576]
                    transition
                  "
                >
                  Áp dụng
                </button>
              </div>
              </div>

              <div className="mt-8">

                <div className="flex items-start justify-between">

                  <span className="mt-3 text-[20px] font-bold text-[#1d1d1f]">
                    Tổng cộng
                  </span>

                  <div className="text-right">

                    <div className="text-[24px] font-bold text-[#005b9f] leading-none">
                      {total.toLocaleString("vi-VN")}₫
                    </div>

                    <div className="mt-1 text-[12px] italic font-medium text-[#7f7f7f]">
                      (Đã bao gồm VAT)
                    </div>

                  </div>

                </div>

              </div>

              <button
                className="
                  mt-8
                  w-full
                  h-[64px]
                  rounded-[10px]
                  bg-[#0068b3]
                  text-white
                  text-[18px]
                  font-semibold
                  shadow-md
                  transition
                  hover:bg-[#00599a]
                "
              >
                Tiến hành thanh toán →
              </button>

              <button
                className="
                  mt-4
                  w-full
                  h-[64px]
                  rounded-[10px]
                  border-2
                  border-[#d8dde6]
                  bg-white
                  text-[18px]
                  font-semibold
                  text-[#222]
                  transition
                  hover:bg-[#f8f8f8]
                "
              >
                Tiếp tục mua sắm
              </button>
              <div
  className="
mt-5
flex
items-center
gap-4
bg-[#faf4ef]
px-4
py-4
rounded
"
>
  {/* Icon */}

  <div
    className="
      w-8
      h-8
      rounded-full
      bg-[#f2ae73]
      flex
      items-center
      justify-center
      flex-shrink-0
    "
  >
    <span className="text-white text-[20px] font-bold leading-none">
      i
    </span>
  </div>
 <p
  className="
    flex-1
    text-[15px]
    leading-7
    text-[#7c4d18]
    font-medium
  "
>
  Đơn hàng của bạn đủ điều kiện nhận{" "}
  <span className="font-bold">
    Gói Bảo Hành Rơi Vỡ 12 tháng
  </span>{" "}
  miễn phí.
</p>

</div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}