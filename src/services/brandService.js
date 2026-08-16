const API_URL = "https://devninjas-tech-website-be-1.onrender.com";

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
