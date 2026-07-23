import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      // Giữ nguyên pattern https nếu bạn có dùng ảnh từ ngoài (ví dụ Cloudinary)
      {
        protocol: "https",
        hostname: "**",
      },
      // Thêm pattern này để cho phép ảnh từ server nội bộ
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;