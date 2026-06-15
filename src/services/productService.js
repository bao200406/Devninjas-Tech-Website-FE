const API_URL = "http://localhost:5000";
import api from "../axios/api";

export const getAllProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Lỗi từ phía server");
    }

    const result = await res.json();

    return result.data;
  } catch (error) {
    console.log("Fetch API fail", error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Lỗi từ phía server");
    }

    const result = await res.json();

    return result.data;
  } catch (error) {
    console.log("Fetch API fail", error);
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      // Đọc chi tiết lỗi từ server trả về
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Lỗi từ phía server");
    }

    const result = await res.json();

    return result.data;
  } catch (error) {
    console.log("Fetch API fail", error);
    throw error;
  }
};

export const getProductById = async (Id) => {
  try {
    const url = `${API_URL}/api/products/${Id}`;
    console.log(`[DEBUG] Đang gọi API: GET ${url}`);

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // Log status code để biết server phản hồi ra sao (200, 400, 404, 500...)
    console.log(`[DEBUG] Status code nhận được: ${res.status}`);

    const result = await res.json();
    
    // Log toàn bộ dữ liệu trả về để kiểm tra cấu trúc (cực kỳ quan trọng để bắt lỗi undefined)
    console.log("[DEBUG] Dữ liệu từ server:", result);

    if (!res.ok) {
      throw new Error(result.message || "Lỗi từ phía server");
    }

    // Kiểm tra xem trường data có tồn tại không trước khi return
    if (result.data === undefined) {
      console.warn("[DEBUG] Cảnh báo: 'result.data' bị undefined, hãy kiểm tra lại cấu trúc JSON ở backend!");
    }

    return result.data;
  } catch (error) {
    console.error("[DEBUG] Fetch API fail:", error);
    throw error;
  }
};

export const deleteProduct = async (Id) => {
  try {
    const res = await fetch(`${API_URL}/api/products/${Id}`, {
      method: "DELETE",
    });

    // Nếu res.ok là false (4xx, 5xx), fetch không tự throw error nên ta phải check
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Phòng hờ server ko trả json
      throw new Error(errorData.message || "Lỗi từ phía server");
    }

    // Đọc JSON
    const result = await res.json();

    // TRẢ VỀ CẢ STATUS VÀ DATA
    return {
      status: res.status,
      data: result.data,
    };
  } catch (error) {
    console.log("Fetch API fail", error);
    throw error;
  }
};

export const getHomePageData = async () => {
  try {
    const response = await api.get("/products/home-data");

    console.log("SUCCESS:", response.data);

    return response.data.data;
  } catch (error) {
    console.log("ERROR:", error.response?.data);
    console.log("STATUS:", error.response?.status);

    throw error;
  }
};
