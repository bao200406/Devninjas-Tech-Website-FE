import Link from 'next/link';

export default function Breadcrumb({ category, brand, productName }) {
  console.log("Breadcrumb props:", { category: category?.name, brand: brand?.name, productName }); // Debugging line
  return (
    <nav className="text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
      <Link href="/" className="hover:text-gray-600 cursor-pointer transition-colors">
        Trang chủ
      </Link>
      
      {/* Chỉ hiển thị khi category là một Object chứa name và slug hợp lệ */}
      {category && typeof category === 'object' && category.name && (
        <>
          <span className="text-gray-300">›</span>
          <Link href={`/categories/${category.slug}`} className="hover:text-gray-600 cursor-pointer transition-colors">
            {category.name}
          </Link>
        </>
      )}

      {/* Chỉ hiển thị khi brand là một Object chứa name và slug hợp lệ */}
      {brand && typeof brand === 'object' && brand.name && (
        <>
          <span className="text-gray-300">›</span>
          <Link href={`/brands/${brand.slug}`} className="hover:text-gray-600 cursor-pointer transition-colors">
            {brand.name}
          </Link>
        </>
      )}

      {productName && (
        <>
          <span className="text-gray-300">›</span>
          <span className="text-gray-900 font-bold truncate">
            {productName}
          </span>
        </>
      )}
    </nav>
  );
}