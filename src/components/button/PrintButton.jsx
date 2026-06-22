"use client"; // Bắt buộc phải có dòng này ở dòng số 1

import React from "react";
import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="w-full md:flex hidden items-center justify-center gap-2 bg-transparent hover:text-slate-600 text-slate-400 font-medium text-xs py-2 transition"
    >
      <Printer className="w-3.5 h-3.5" />
      In hóa đơn này
    </button>
  );
}