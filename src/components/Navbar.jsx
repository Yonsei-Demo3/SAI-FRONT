import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: "NOW", path: "/main" },
    { name: "추천 질문", path: "/recommend" },
    { name: "최신 질문", path: "/latest" },
    { name: "인기 질문", path: "/popular" },
  ];

  return (
    <div className="flex flex-col w-full bg-white select-none">
      {/* 상단 로고 + 알림 */}
      <div className="flex items-center justify-between px-5 py-3 ml-[1.5rem] mt-[1.5rem]">
        {/* 왼쪽 로고 */}
        <div className="flex items-center gap-1.5">
          <img
            src="/icons/logo.svg"
            alt="SAI Logo"
            className="w-[1.5rem] h-[1.75rem] select-none"
            draggable="false"
          />
          <span className="text-[#FA502E] font-semibold text-[1.05rem] leading-none">
            SAI
          </span>
        </div>

        {/* 오른쪽 알림 */}
        <div className="relative flex items-center justify-center">
          <img
            src="/icons/bell.svg"
            alt="알림"
            className="w-[1.4rem] h-[1.4rem] mr-[1.5rem] select-none"
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
}
