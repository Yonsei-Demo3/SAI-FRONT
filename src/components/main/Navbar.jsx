import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../NotificationContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { unreadCount } = useNotification();

  return (
    <div className="flex flex-col w-full h-[5rem] bg-white select-none sticky-0">
      {/* 상단 로고 + 알림 */}
      <div className="flex items-center justify-between py-3 ml-[1.5rem] mt-[1.5rem]">
        {/* 왼쪽 로고 */}
        <div
          className="flex items-center gap-1.5 cursor-pointer"
          onClick={() => navigate("/main")}
        >
          <img
            src="/icons/logo.svg"
            alt="SAI Logo"
            className="w-[1.5rem] h-[1.75rem] select-none"
            draggable="false"
          />
          <span className="text-[#FA502E] font-bold text-[1.2rem] leading-none">
            SAI
          </span>
        </div>

        {/* 오른쪽 알림 */}
        <button
          onClick={() => navigate("/notification")}
          className="relative flex items-center justify-center bg-transparent border-none outline-none"
        >
          <img
            src="/icons/bell.svg"
            alt="알림"
            className="w-[1.5rem] h-[1.5rem] mr-[1.5rem] select-none"
            draggable="false"
          />

          {/* 🔴 알림 개수 표시 */}
          {unreadCount > 0 && (
            <span className="absolute top-[-0.25rem] right-[1.3rem] bg-[#FA502E] text-[#FFFFFF] text-[0.625rem] font-semibold px-[0.35rem] py-[0.05rem] rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
