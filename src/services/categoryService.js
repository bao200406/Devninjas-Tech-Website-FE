const API_URL = "http://localhost:5000";

export const getAllCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Lỗi từ phía server");
    }

    const result = await res.json();
    console.log(result);

    return result.data;
  } catch (error) {
    console.log("Fetch Error: ", error);
    return [];
  }
};

export const createCategory = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: formData,
    });

    // Log chi tiết phản hồi từ API
    const responseText = await res.text();
    console.log("Response Status:", res.status);
    console.log("Response Body:", responseText);

    if (!res.ok) {
      throw new Error(`Lỗi từ phía server: ${res.status} - ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log(result);

    return result.data;
  } catch (error) {
    console.log("Fetch Error: ", error);
    throw error; // Ném lỗi để xử lý ở phía trên
  }
};

export const editCategory = async (id, formData) => {
  try {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Lỗi từ phía server");
    }

    const result = await res.json();

    return result.data;
  } catch (error) {
    console.log("Error edit", error);
  }
};

export const getCategoryById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Lỗi từ phía server");
    }

    const result = await res.json();

    return result.data;
  } catch (error) {
    console.log("Error edit", error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      // Lấy message lỗi từ Server nếu có, nếu không thì dùng câu thông báo mặc định
      throw new Error(result.message || "Không thể xóa danh mục này");
    }

    return await result;
  } catch (error) {
    console.error("Error delete api:", error);
    // Quăng lỗi ra ngoài để UI xử lý (hiện thông báo lỗi)
    throw error;
  }
};
