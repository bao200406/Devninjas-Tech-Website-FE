import React from "react";

import { getAllCategories } from "../../../services/categoryService";

import TableCategories from "../../../components/categories/TableCategories";

// export const dynamic = "force-dynamic"; // Ép trang này luôn lấy dữ liệu mới nhất
export default async function CategoriesPage() {
  // Dữ liệu mẫu (Giả lập từ API)
  const categories = await getAllCategories();

  return <TableCategories data={categories} />;
}
