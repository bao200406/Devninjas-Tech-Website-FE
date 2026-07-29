"use client"; // Thêm dòng này nếu bạn dùng Next.js App Router

import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/chatbotService'; // Điều chỉnh đường dẫn alias (@/) cho phù hợp dự án của bạn

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Xin chào! 👋 Mình là trợ lý AI chuyên tư vấn sản phẩm. Bạn đang tìm mặt hàng hoặc phân khúc giá nào hôm nay?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Các câu hỏi gợi ý nhanh cho thương mại điện tử
  const quickSuggestions = [
    "💻 Laptop gaming dưới 25 triệu",
    "📱 Điện thoại pin trâu giá rẻ",
    "🎧 Phụ kiện tai nghe, bàn phím"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    if (!messageText.trim() || loading) return;

    const userMsg = messageText.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(userMsg);

      if (data.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Hiện tại hệ thống bận, bạn vui lòng thử lại sau nhé!' }]);
      }
    } catch (error) {
      console.error("Lỗi kết nối chatbot:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Không thể kết nối đến máy chủ tư vấn.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Nút Bong Bóng Chat Nổi (FAB) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-5 py-3 rounded-full shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 transition-all duration-300"
          aria-label="Mở chat tư vấn"
        >
          <div className="relative flex items-center justify-center">
            <span className="text-2xl">🤖</span>
            <span className="absolute -top-2 -right-2 bg-white text-red-500 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              1
            </span>
          </div>
          <span className="font-semibold text-sm tracking-wide">Tư vấn thông minh</span>
        </button>
      )}

      {/* Cửa Sổ Khung Chat Chính */}
      {isOpen && (
        <div className="w-[380px] h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">
                🛍️
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Trợ Lý Mua Sắm AI</h4>
                <p className="text-[11px] text-white/90 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></span> 
                  Sẵn sàng tư vấn 24/7
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Vùng Hiển Thị Tin Nhắn */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 w-full ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs flex-shrink-0 mb-1 shadow-sm">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-red-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Hiệu ứng Đang Gõ (Loading) */}
            {loading && (
              <div className="flex items-end gap-2 w-full justify-start">
                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs flex-shrink-0 mb-1 shadow-sm">
                  🤖
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Thanh Gợi Ý Nhanh (Quick Suggestions) */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
            {quickSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item)}
                disabled={loading}
                className="bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 border border-gray-200 text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 font-medium flex-shrink-0 disabled:opacity-50"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Khung Nhập Tin Nhắn (Footer) */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập tên sản phẩm, mức giá cần tìm..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-full text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all text-gray-800 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>

        </div>
      )}
    </div>
  );
}