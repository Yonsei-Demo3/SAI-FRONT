import React from "react";
import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between w-full px-5 py-4 bg-white">
      {/* 왼쪽: 로고 */}
      <div className="flex items-center gap-2">
        <img src="/icons/logo.svg" alt="SAI Logo" className="w-6 h-6" />
        <span className="text-[#FA502E] font-semibold text-xl">SAI</span>
      </div>

      {/* 오른쪽: 알림 아이콘 */}
      <div className="relative">
        <Bell className="w-6 h-6 text-gray-700" />
        <span className="absolute -top-1 -right-1 bg-[#FA502E] text-white text-[0.65rem] rounded-full px-[0.3rem]">
          27
        </span>
      </div>
    </div>
  );
}
