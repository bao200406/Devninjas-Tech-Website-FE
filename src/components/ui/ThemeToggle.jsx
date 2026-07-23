'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Tránh lỗi hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="size-10" />; // Placeholder để tránh layout shift

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      // Đã bỏ 'relative', thêm 'fixed' và ép vị trí bằng Tailwind hoặc inline style nếu cần
      className="fixed bottom-6 left-6 z-[9999] flex size-12 items-center justify-center rounded-full bg-zinc-100 transition-all duration-300 hover:scale-110 active:scale-90 dark:bg-zinc-800 shadow-2xl border border-zinc-200 dark:border-zinc-700"
      aria-label="Toggle theme"
      style={{ position: 'fixed', bottom: '40px', left: '20px', zIndex: 9999 }} 
    >
      <div className="relative size-6 overflow-hidden">
        {/* Sun Icon */}
        <Sun 
          className={`absolute size-6 text-amber-500 transition-all duration-500 ${
            theme === 'dark' ? 'translate-y-6 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
          }`} 
        />
        {/* Moon Icon */}
        <Moon 
          className={`absolute size-6 text-sky-400 transition-all duration-500 ${
            theme === 'dark' ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-6 -rotate-90 opacity-0'
          }`} 
        />
      </div>
    </button>
  );
}