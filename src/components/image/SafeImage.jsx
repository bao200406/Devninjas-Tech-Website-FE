import { useState, useEffect, useCallback } from 'react';

// Hàm xử lý URL
export const getPublicUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const index = path.indexOf('uploads');
  if (index === -1) return path;
  
  const relativePath = path.substring(index).replace(/\\/g, '/');
  return `https://devninjas-tech-website-be.onrender.com/${relativePath}`;
};

export default function SafeImage({ src, alt, className, fallbackSrc = "/placeholder.png" }) {
  const [imgSrc, setImgSrc] = useState(() => getPublicUrl(src));
  const [hasError, setHasError] = useState(false);

  // Đồng bộ lại ảnh khi prop `src` thay đổi từ bên ngoài (rất quan trọng khi chọn biến thể màu sắc)
  useEffect(() => {
    setImgSrc(getPublicUrl(src));
    setHasError(false); // Reset trạng thái lỗi khi đổi ảnh mới
  }, [src]);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  }, [hasError, fallbackSrc]);

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt || "image"}
      className={className}
      onError={handleError}
    />
  );
}