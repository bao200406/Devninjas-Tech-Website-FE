import { useState, useEffect, useCallback } from 'react';

// Hàm xử lý URL đã được tối ưu đúng với cấu trúc backend của bạn
export const getPublicUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/\\/g, '/');

  // Nếu đường dẫn đã có sẵn chữ uploads
  if (cleanPath.includes('uploads')) {
    const index = cleanPath.indexOf('uploads');
    const relativePath = cleanPath.substring(index);
    return `https://devninjas-tech-website-be-1.onrender.com/${relativePath}`;
  }

  // Nếu backend chỉ trả về tên file thuần túy (ví dụ: products-1785150897541-852043014.jpg)
  // Ứng với thư mục backend/public/uploads/products/ của bạn
  return `https://devninjas-tech-website-be-1.onrender.com/uploads/products/${cleanPath}`;
};

export default function SafeImage({ src, alt, className, fallbackSrc = "/placeholder.png" }) {
  const [imgSrc, setImgSrc] = useState(() => getPublicUrl(src));
  const [hasError, setHasError] = useState(false);

  // Đồng bộ lại ảnh khi prop `src` thay đổi từ bên ngoài
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