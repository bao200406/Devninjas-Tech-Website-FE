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

export const createVariants = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/api/variants`, {
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

export const updateVariants = async (id, formData) => {
  try {
    const res = await fetch(`${API_URL}/api/variants/${id}`, {
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

export const DeleteVariant = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/variants/${id}`, {
      method: "DELETE",
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

export const getVariantsByProduct = async (ProductId) => {
  try {
    const res = await fetch(`${API_URL}/api/variants/product/${ProductId}`, {
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
