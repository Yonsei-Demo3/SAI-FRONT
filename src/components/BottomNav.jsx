import React from "react";
import { Home, Search, MessageCircle, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 bg-white flex justify-around py-2 z-50">
      <button className="flex flex-col items-center text-[#FA502E]">
        <Home className="w-5 h-5" />
        <span className="text-xs mt-1 font-medium">홈</span>
      </button>

      <button className="flex flex-col items-center text-gray-500">
        <Search className="w-5 h-5" />
        <span className="text-xs mt-1">검색</span>
      </button>

      <button className="flex flex-col items-center text-gray-500 relative">
        <MessageCircle className="w-5 h-5" />
        <span className="absolute -top-1 right-3 bg-[#FA502E] text-white text-[0.6rem] rounded-full px-[0.3rem]">
          27
        </span>
        <span className="text-xs mt-1">채팅</span>
      </button>

      <button className="flex flex-col items-center text-gray-500">
        <User className="w-5 h-5" />
        <span className="text-xs mt-1">마이페이지</span>
      </button>
    </div>
  );
}
