"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Đảm bảo bạn đã cài lucide-react

export default function HorizontalScrollSlider({ 
  children, 
  className = "", 
  scrollStep = 0.75, // Khoảng cách cuộn mỗi lần bấm (tính theo % chiều rộng khung)
  showArrows = true 
}) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Kiểm tra trạng thái có thể cuộn trái/phải hay không để ẩn/hiện nút thông minh
  const checkScrollable = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 2); // Dư ra một chút để tránh lệch số thập phân
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  }, []);

  useEffect(() => {
    checkScrollable();
    const currentRef = sliderRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollable);
      window.addEventListener('resize', checkScrollable);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollable);
      }
      window.removeEventListener('resize', checkScrollable);
    };
  }, [children, checkScrollable]);

  // Hàm thực hiện trượt slider
  const scroll = (direction) => {
    if (sliderRef.current) {
      const { clientWidth, scrollLeft } = sliderRef.current;
      const amount = clientWidth * scrollStep;
      sliderRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - amount : scrollLeft + amount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`relative group/slider w-full ${className}`}>
      {/* Nút bấm Prev */}
      {showArrows && canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-full flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer opacity-0 group-hover/slider:opacity-100 shadow-black/5"
          aria-label="Scroll Left"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Khung chứa các phần tử con trượt ngang */}
      <div
        ref={sliderRef}
        className="flex gap-3.5 overflow-x-auto scrollbar-none scroll-smooth pb-1 w-full items-center"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      {/* Nút bấm Next */}
      {showArrows && canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-full flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer opacity-0 group-hover/slider:opacity-100 shadow-black/5"
          aria-label="Scroll Right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}