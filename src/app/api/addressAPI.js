export const fetchAddressData = async () => {
  try {
    const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu hành chính");
    }
    const data = await response.json();
    return data; // Trả về mảng toàn bộ tỉnh thành kèm quận huyện và phường xã để component sử dụng
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu địa chỉ:", error);
    return [];
  }
};