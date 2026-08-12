const API_URL = "https://devninjas-tech-website-be.onrender.com";
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

export const getProductById = async (id) => {
  try {
    if (!id || typeof id !== "string") {
      throw new Error("ID sản phẩm không đúng định dạng");
    }

    // Log ID mà frontend nhận được
    console.log("========== DEBUG PRODUCT ==========");
    console.log("ID frontend gửi:", id);

    const url = `${API_URL}/api/products/${id}`;
    console.log("URL gọi:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Status:", res.status);

    const result = await res.json();

    console.log("Response từ backend:", result);

    if (!res.ok) {
      throw new Error(result.message || "Lỗi từ phía server");
    }

    console.log("Product trả về:", result.data);

    return result.data;
  } catch (error) {
    console.error("Lỗi getProductById:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
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

export const getProductsByCategory = async (categoryId, page = 1, limit = 8, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.attributeValueIds?.length > 0 && { attrIds: filters.attributeValueIds.join(',') })
    }).toString();

    // THÊM DÒNG NÀY ĐỂ DEBUG
    console.log("DEBUG API CALL:", `/products/category/${categoryId}?${queryParams}`);

    const response = await api.get(`/products/category/${categoryId}?${queryParams}`);
    return response.data.data;
  } catch (error) {
    // THÊM DÒNG NÀY ĐỂ XEM LỖI CỤ THỂ
    console.error("DEBUG API ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getCategoryFilters = async (categoryId) => {
  try {
    const response = await api.get(
      `/products/category/${categoryId}/filters`
    );

    return response.data.data;
  } catch (error) {
    console.error("Error getting category filters:", error);
    throw error;
  }
};

export const getRelatedProducts = async (productId, options = {}) => {
  try {
    const url = `${API_URL}/api/products/${productId}/related`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      ...options,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Lỗi từ phía server");
    }

    return result.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      throw error;
    }
  }
};
