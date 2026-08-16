"use client";
import Button from "../shared/Button";
import StatCard from "../shared/StatCard";
import SearchInput from "../shared/SearchInput";
import EditAction from "./editAction";
import DeleteAction from "./DeleteAction";
import EditProductForm from "./EditProductForm";
import { getAllProducts } from "../../services/productService";
import { Box, DollarSign, AlertCircle, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
export default function TableProduct() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product, id) => {
    setSelectedProduct(product);
    setSelectedProductId(id);
  };

  const handleCloseForm = () => {
    setSelectedProduct(null);
    setSelectedProductId(null);
  };

  return (
    <>
      <div className="p-4 max-w-[1600px] mx-auto animate-fade-in space-y-8">
        {/* 1. Header & Quick Actions */}

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white">Quản lý sản phẩm</h1>
            <p className="text-admin-text-muted mt-2 text-sm">
              Tổ chức cây danh mục sản phẩm, tối ưu SEO và quản lý hiển thị trên
              Storefront.
            </p>
          </div>
          <Button title={"Thêm sản phẩm mới"} data={fetchProducts} />
        </div>
        {/* 2 box stat card */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            title="Tổng sản phẩm"
            value="2,480"
            trend="12% mới"
            isTrendUp={true}
            icon={Box}
            colorClass="blue"
          />

          <StatCard
            title="Giá trị kho hàng"
            value="$45,200"
            trend="8% tháng này"
            isTrendUp={true}
            icon={DollarSign}
            colorClass="emerald"
          />

          <StatCard
            title="Sắp hết hàng"
            value="18"
            trend="Cần nhập"
            isTrendUp={false}
            icon={AlertCircle}
            colorClass="orange"
          />

          <StatCard
            title="Đã bán (30 ngày)"
            value="856"
            icon={ShoppingBag}
            colorClass="rose"
          />
        </div>

        {/* 3. Main Data Section */}
        <div className="admin-card p-0 overflow-hidden border-admin-border/50">
          {/* Filters Bar */}
          <div className="p-5 border-b border-admin-border bg-gray-900/30 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-3 flex-1 max-w-md">
              <SearchInput />
            </div>
            <div className="text-xs text-admin-text-muted">
              Hiển thị <b>10</b> trên <b>128</b> danh mục
            </div>
          </div>
          {/* Production Table */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800/50 text-admin-text-muted text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    className="accent-admin-accent rounded border-gray-700 bg-gray-900"
                  />
                </th>
                {/* Cột ID mới bổ sung */}
                <th className="p-4 w-32 text-center">ID</th>
                <th className="p-4 text-center">image</th>
                <th className="p-4 text-center">Tên Sản phẩm</th>
                <th className="p-4 text-center">Giá Sản phẩm</th>
                <th className="p-4 text-center">Danh mục</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/30 text-sm">
              {products?.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="accent-admin-accent rounded border-gray-700 bg-gray-900"
                    />
                  </td>

                  <td className="p-4 text-admin-text-muted font-mono text-[11px] tracking-tighter">
                    #{item._id}
                  </td>

                  <td className="p-4 ">
                    <img
                      src={`https://devninjas-tech-website-be-1.onrender.com/uploads/products/${item.image}`}
                      alt=""
                      className="w-40 h-auto m-auto"
                    />
                  </td>

                  <td className="p-4  gap-3 align-middle">
                    <div>
                      <div className="font-bold text-white group-hover:text-admin-accent transition-colors text-center">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-admin-text-muted italic text-center">
                        Modified: 2h ago
                      </div>
                    </div>
                  </td>

                  <td className="p-4  gap-3 align-middle">
                    <div>
                      <div className="font-bold text-white group-hover:text-admin-accent transition-colors text-center">
                        {item.basePrice}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-gray-300 text-center">
                    {item.categoryId?.name}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${
                        item.status === "Active"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-4 ">
                    <div className="flex justify-center gap-2">
                      {/* Nút Xem chi tiết (Mắt) */}
                      <button
                        title="Xem chi tiết"
                        className="p-2 hover:bg-gray-700 rounded-md transition-all text-admin-text-muted hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      {/* Nút Sửa sản phẩm (Bút) */}
                      <button
                        className="p-2 hover:bg-gray-700 rounded-md transition-all text-admin-text-muted hover:text-white"
                        onClick={() => handleEditClick(item, item._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>

                      {/* Nút Xóa (Thêm mới) */}
                      <DeleteAction id={item._id} setProducts={setProducts} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProduct && (
        <EditProductForm
          onSave={fetchProducts}
          product={selectedProduct}
          onClose={handleCloseForm}
          productId={selectedProductId}
        />
      )}
    </>
  );
}
