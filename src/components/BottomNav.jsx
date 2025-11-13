import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  return (
    <div className="bg-[#FFFFFF] fixed bottom-[0rem] w-full left-0 right-0 h-[4.5rem] gap-[1rem] shadow-[0_-4px_10px_rgba(0,0,0,0.08)] flex justify-around items-center z-50">
      {/* 홈 */}
      <button
        onClick={() => navigate("/main")}
        className={`flex flex-col items-center bg-transparent border-none focus:outline-none ${
          isActive("/main") ? "text-[#000000]" : "text-[#B5BBC1]"
        }`}
      >
        <img
          src={
            isActive("/main")
              ? "/icons/home-active.svg"
              : "/icons/home-inactive.svg"
          }
          alt="홈"
          className="w-5 h-5"
        />
        <span className="text-[0.625rem] mt-1 font-medium">홈</span>
      </button>

      {/* 검색 */}
      <button
        onClick={() => navigate("/category-search")}
        className={`flex flex-col items-center bg-transparent border-none focus:outline-none ${
          isActive("/category-search") ? "text-[#000000]" : "text-[#B5BBC1]"
        }`}
      >
        <img
          src={
            isActive("/category-search")
              ? "/icons/search-active.svg"
              : "/icons/search-inactive.svg"
          }
          alt="검색"
          className="w-5 h-5"
        />
        <span className="text-[0.625rem] mt-1">검색</span>
      </button>

      {/* 채팅 */}
      <button
        onClick={() => navigate("/chat")}
        className={`flex flex-col items-center relative bg-transparent border-none focus:outline-none ${
          isActive("/chat") ? "text-[#000000]" : "text-[#B5BBC1]"
        }`}
      >
        <img
          src={
            isActive("/chat")
              ? "/icons/chat-active.svg"
              : "/icons/chat-inactive.svg"
          }
          alt="채팅"
          className="w-5 h-5"
        />
        <span className="text-[0.625rem] mt-1">채팅</span>
      </button>

      {/* 마이페이지 */}
      <button
        onClick={() => navigate("/mypage")}
        className={`flex flex-col items-center bg-transparent border-none focus:outline-none ${
          isActive("/mypage") ? "text-[#000000]" : "text-[#B5BBC1]"
        }`}
      >
        <img
          src={
            isActive("/mypage")
              ? "/icons/mypage-active.svg"
              : "/icons/mypage-inactive.svg"
          }
          alt="마이페이지"
          className="w-5 h-5"
        />
        <span className="text-[0.625rem] mt-1">마이페이지</span>
      </button>
    </div>
  );
}