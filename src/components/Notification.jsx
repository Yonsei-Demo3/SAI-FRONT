import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationContext"; // ✅ 연결

export default function Notification() {
  const navigate = useNavigate();
  const { notifications, markAllAsRead } = useNotification(); // ✅ 전역 연결

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard] z-[150]">
      {/* ✅ 상단 헤더 */}
      <div className="flex items-center justify-between px-[1.5rem] py-[1rem] border-b border-[#E5E7EB]">
        <div className="flex items-center gap-[0.75rem]">
          <img
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            className="w-[1.25rem] h-[1.25rem] cursor-pointer select-none"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-[1.125rem] font-semibold text-[#000000]">알림</h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="text-[#9CA3AF] text-[0.875rem] bg-transparent border-none outline-none"
        >
          모두 읽은 상태로 표시
        </button>
      </div>

      {/* ✅ 스크롤 가능한 알림 목록 */}
      <div
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

        {notifications.map((item) => (
          <div
            key={item.id}
            className={`flex justify-between items-start px-[1.5rem] py-[1rem] border-b border-[#F2F4F8] transition-colors duration-200 ${
              item.isNew ? "bg-[#FFF2EE]" : "bg-white"
            }`}
          >
            <div className="flex flex-col">
              <p className="text-[1rem] font-semibold text-[#000000] mb-[0.25rem]">
                {item.title}
              </p>
              <p className="text-[0.875rem] text-[#6B7280]">
                {item.message}
              </p>
            </div>
            <span className="text-[0.75rem] text-[#9CA3AF] whitespace-nowrap ml-[1rem]">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
