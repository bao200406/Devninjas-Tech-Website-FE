const API_URL = "http://localhost:5000";

export const getAllBrands = async () => {
  try {
    const res = await fetch(`${API_URL}/api/brands`, {
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
