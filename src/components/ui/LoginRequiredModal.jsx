import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export function LoginRequiredModal({ isOpen, onClose }) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Thêm 'border-none' và 'shadow-xl' để modal trông mềm mại không viền */}
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-[20px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.1)] bg-white">
        
        {/* Phần Header: Giữ nền trắng sạch sẽ */}
        <div className="pt-8 pb-4 flex flex-col items-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-[#0068b3]" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-[20px] font-bold text-[#1d1d1f]">
              Bạn chưa đăng nhập
            </DialogTitle>
            <DialogDescription className="text-[14px] text-[#6e6e73] px-8 mt-2">
              Vui lòng đăng nhập để tiếp tục thanh toán và lưu đơn hàng của bạn.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Phần nút bấm */}
        <div className="p-6 pt-2 flex flex-col gap-3">
          <Button 
            className="h-[48px] bg-[#0068b3] hover:bg-[#00599a] text-white text-[15px] font-semibold rounded-[12px] transition-all shadow-md"
            onClick={() => router.push("/login")}
          >
            Đăng nhập ngay
          </Button>
          <Button 
            variant="ghost" 
            className="h-[48px] text-[15px] font-medium text-[#6e6e73] hover:text-black hover:bg-gray-50 rounded-[12px] transition-all"
            onClick={onClose}
          >
            Để sau
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}