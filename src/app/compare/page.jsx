"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { getAllProducts } from '../../services/productService'; 
import { compareProductsWithAI } from '../../services/aiCompareProductService';
import { toast } from 'react-toastify';
import SafeImage from '../../components/image/SafeImage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ProductComparePage = () => {
  // 1. States quản lý dữ liệu
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // 2. States 2 sản phẩm được chọn để so sánh
  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);

  // 3. States quản lý Modal chọn sản phẩm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null); // 'slot1' hoặc 'slot2'
  const [searchTerm, setSearchTerm] = useState('');

  // 4. States quản lý AI so sánh
  const [userNeed, setUserNeed] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Lấy tất cả sản phẩm bằng hàm getAllProducts có sẵn
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await getAllProducts();
        setAllProducts(data || []);
      } catch (error) {
        console.error("Lỗi tải danh sách sản phẩm:", error);
        toast.error("Không thể tải danh sách sản phẩm từ hệ thống!");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Lọc sản phẩm trong modal tìm kiếm
  const filteredModalProducts = useMemo(() => {
    return allProducts.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allProducts, searchTerm]);

  // Xử lý chọn sản phẩm cho slot 1 hoặc slot 2
  const handleSelectProduct = (product) => {
    if (activeSlot === 'slot1') {
      if (product2 && product2._id === product._id) {
        toast.warning("Không thể chọn trùng một sản phẩm để so sánh!");
        return;
      }
      setProduct1(product);
    } else if (activeSlot === 'slot2') {
      if (product1 && product1._id === product._id) {
        toast.warning("Không thể chọn trùng một sản phẩm để so sánh!");
        return;
      }
      setProduct2(product);
    }
    setIsModalOpen(false);
    setSearchTerm('');
    setAiResult(null); // Reset kết quả AI khi thay đổi sản phẩm
  };

  // Gọi API AI so sánh sản phẩm
  const handleRunAIComparison = async () => {
    if (!product1 || !product2) {
      toast.warning("Vui lòng chọn đủ 2 sản phẩm để thực hiện so sánh.");
      return;
    }
    if (!userNeed.trim()) {
      toast.warning("Vui lòng nhập nhu cầu sử dụng của bạn (Ví dụ: Chơi game, học tập, pin trâu...)");
      return;
    }

    try {
      setLoadingAI(true);
      const productIds = [product1._id, product2._id];
      const res = await compareProductsWithAI(productIds, userNeed);
      
      // Hỗ trợ hứng kết quả linh hoạt theo dạng res.data hoặc res trực tiếp từ service
      const analysisData = res.data?.analysis || res.analysis || res.data;
      setAiResult(analysisData);
      
      toast.success("AI đã hoàn tất phân tích!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Không thể thực hiện so sánh bằng AI lúc này.");
    } finally {
      setLoadingAI(false);
    }
  };

  // Helper lấy giá sản phẩm chuẩn xác
  const getProductPrice = (product) => {
    const rawPrice = product?.basePrice || product?.price || product?.variants?.[0]?.price;
    if (rawPrice) return rawPrice.toLocaleString() + 'đ';
    return 'Liên hệ';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* Tiêu đề trang */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          ⚖️ So Sánh Sản Phẩm Thông Minh & Tư Vấn AI
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Lựa chọn 2 sản phẩm bất kỳ từ hệ thống và cho AI biết nhu cầu của bạn để nhận báo cáo phân tích chuyên sâu.
        </p>
      </div>

      {/* Khu vực chọn 2 sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slot 1 */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          {product1 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">Sản phẩm 1</span>
                <button 
                  onClick={() => { setActiveSlot('slot1'); setIsModalOpen(true); }}
                  className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  Đổi sản phẩm
                </button>
              </div>
              <div className="h-48 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                <SafeImage 
                  src={product1.image} 
                  alt={product1.name} 
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base line-clamp-1">{product1.name}</h3>
                <p className="text-red-600 font-bold text-lg mt-1">
                  {getProductPrice(product1)}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-xl mb-3">+</div>
              <p className="text-sm font-semibold text-gray-700">Chưa chọn sản phẩm thứ nhất</p>
              <button
                onClick={() => { setActiveSlot('slot1'); setIsModalOpen(true); }}
                className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer shadow-sm"
              >
                Chọn sản phẩm ngay
              </button>
            </div>
          )}
        </div>

        {/* Slot 2 */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          {product2 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">Sản phẩm 2</span>
                <button 
                  onClick={() => { setActiveSlot('slot2'); setIsModalOpen(true); }}
                  className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  Đổi sản phẩm
                </button>
              </div>
              <div className="h-48 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                <SafeImage 
                  src={product2.image} 
                  alt={product2.name} 
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base line-clamp-1">{product2.name}</h3>
                <p className="text-red-600 font-bold text-lg mt-1">
                  {getProductPrice(product2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-xl mb-3">+</div>
              <p className="text-sm font-semibold text-gray-700">Chưa chọn sản phẩm thứ hai</p>
              <button
                onClick={() => { setActiveSlot('slot2'); setIsModalOpen(true); }}
                className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer shadow-sm"
              >
                Chọn sản phẩm ngay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Khu vực nhập nhu cầu & kích hoạt AI */}
      {product1 && product2 && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900">🤖 Tùy chỉnh phân tích theo nhu cầu cá nhân</h2>
          <div className="flex gap-3">
            <input 
              type="text"
              value={userNeed}
              onChange={(e) => setUserNeed(e.target.value)}
              placeholder="Ví dụ: Tôi cần máy pin trâu, chụp ảnh sắc nét, giá rẻ để học tập..."
              className="flex-1 p-3.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50/50"
            />
            <button
              onClick={handleRunAIComparison}
              disabled={loadingAI}
              className="px-6 py-3.5 bg-indigo-600 text-white font-semibold text-sm rounded-2xl hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 shadow-md shadow-indigo-600/20 whitespace-nowrap"
            >
              {loadingAI ? "AI đang phân tích..." : "Phân tích & Tư vấn"}
            </button>
          </div>

          {/* KẾT QUẢ PHÂN TÍCH TỪ AI (Bao gồm Tổng quan, Bảng Markdown so sánh & Lời khuyên) */}
          {/* KẾT QUẢ PHÂN TÍCH TỪ AI */}
          `{aiResult && (
            <div className="mt-6 p-8 bg-white border border-indigo-100 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <span className="text-2xl">💡</span>
                <h3 className="font-bold text-gray-900 text-lg">Báo cáo tư vấn chuyên sâu từ chuyên gia AI:</h3>
              </div>
              
              <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed text-sm">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom thẻ table
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-6 rounded-2xl border border-gray-200 shadow-sm">
                        <table className="w-full text-left border-collapse" {...props} />
                      </div>
                    ),
                    // Custom thẻ thead (Tiêu đề bảng)
                    thead: ({ node, ...props }) => (
                      <thead className="bg-gray-100 text-gray-800 font-bold uppercase text-xs tracking-wider" {...props} />
                    ),
                    // Custom thẻ th (Ô tiêu đề)
                    th: ({ node, ...props }) => (
                      <th className="p-4 border-b border-gray-200 text-gray-700" {...props} />
                    ),
                    // Custom thẻ td (Ô dữ liệu)
                    td: ({ node, ...props }) => (
                      <td className="p-4 border-b border-gray-200 text-gray-700 hover:bg-gray-50 transition" {...props} />
                    ),
                    // Custom thẻ tr (Dòng)
                    tr: ({ node, ...props }) => (
                      <tr className="border-last-none" {...props} />
                    )
                  }}
                >
                  {aiResult}
                </ReactMarkdown>
              </div>
            </div>
          )}`
        </div>
      )}

      {/* TẦNG DƯỚI CÙNG: HIỂN THỊ TRỰC TIẾP 2 THẺ SẢN PHẨM ĐỂ XEM/MUA NGAY */}
      {product1 && product2 && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <span>🛍️</span> Sản phẩm tham gia so sánh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thẻ sản phẩm 1 */}
            <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:shadow-md transition">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white p-2 border flex items-center justify-center flex-shrink-0">
                <SafeImage src={product1.image} alt={product1.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-900 truncate">{product1.name}</h4>
                <p className="text-red-600 font-bold text-sm mt-1">{getProductPrice(product1)}</p>
                <a 
                  href={`/products/${product1._id}`} 
                  className="inline-block mt-2 text-xs bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded-xl hover:bg-indigo-700 transition"
                >
                  Xem chi tiết →
                </a>
              </div>
            </div>

            {/* Thẻ sản phẩm 2 */}
            <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:shadow-md transition">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white p-2 border flex items-center justify-center flex-shrink-0">
                <SafeImage src={product2.image} alt={product2.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-900 truncate">{product2.name}</h4>
                <p className="text-red-600 font-bold text-sm mt-1">{getProductPrice(product2)}</p>
                <a 
                  href={`/products/${product2._id}`} 
                  className="inline-block mt-2 text-xs bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded-xl hover:bg-indigo-700 transition"
                >
                  Xem chi tiết →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chọn sản phẩm từ MongoDB */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
            {/* Header Modal */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-lg">
                Chọn sản phẩm cho {activeSlot === 'slot1' ? 'Sản phẩm 1' : 'Sản phẩm 2'}
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setSearchTerm(''); }}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Thanh tìm kiếm trong modal */}
            <div className="p-4 border-b border-gray-100">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên sản phẩm hoặc danh mục..."
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-indigo-500 bg-gray-50"
              />
            </div>

            {/* Danh sách sản phẩm cuộn */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 max-h-[50vh]">
              {loadingProducts ? (
                <div className="text-center py-10 text-gray-400 text-sm">Đang tải kho sản phẩm từ cơ sở dữ liệu...</div>
              ) : filteredModalProducts.length > 0 ? (
                filteredModalProducts.map((product) => (
                  <div 
                    key={product._id}
                    onClick={() => handleSelectProduct(product)}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/30 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                        <SafeImage 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition">{product.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{product.category || 'Điện thoại'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-600 text-sm">
                        {getProductPrice(product)}
                      </span>
                      <div className="text-[10px] text-indigo-600 font-medium mt-1">Chọn máy này →</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400 text-sm">Không tìm thấy sản phẩm phù hợp.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductComparePage;