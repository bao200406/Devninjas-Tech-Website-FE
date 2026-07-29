import { Cpu } from "lucide-react";

export default function ProductSpecifications({ specifications }) {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl border border-slate-100 text-center text-slate-400 font-medium">
        Chưa có thông số kỹ thuật cho sản phẩm này.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Cpu size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Cấu hình & Thông số kỹ thuật
        </h3>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100">
        <table className="w-full text-left border-collapse">
          <tbody>
            {specifications.map((spec, index) => (
              <tr 
                key={index}
                className={`transition-colors ${
                  index % 2 === 0 ? "bg-slate-50/60" : "bg-white"
                } hover:bg-slate-100/60`}
              >
                {/* Cột tên thông số: Tăng độ rộng lên một chút và viết hoa chữ cái đầu cho đẹp */}
                <td className="py-4 px-6 text-sm font-semibold text-slate-500 w-2/5 border-b border-slate-100 last:border-b-0 capitalize">
                  {spec.key}
                </td>
                {/* Cột giá trị */}
                <td className="py-4 px-6 text-sm font-bold text-slate-800 w-3/5 border-b border-slate-100 last:border-b-0">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}