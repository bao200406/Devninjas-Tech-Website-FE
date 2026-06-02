const API_URL = "http://localhost:5000";

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
    const res = await fetch(`${API_URL}/api/products/${Id}`, {
      method: "GET",
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
