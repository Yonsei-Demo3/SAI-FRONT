import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isActive = (...paths) => paths.some((path) => currentPath === path);

  return (
    <div className="bg-[#FFFFFF] fixed bottom-[0rem] w-full left-0 right-0 h-[4.5rem] gap-[1rem] shadow-[0_-4px_10px_rgba(0,0,0,0.08)] flex justify-around items-center z-50">
      {/* 홈 */}
      <button
        onClick={() => navigate("/main")}
        className={`flex flex-col items-center bg-transparent border-none focus:outline-none ${
          isActive("/main", "/main/pop", "/main/new") ? "text-[#000000]" : "text-[#B5BBC1]"
        }`}
      >
        <img
          src={
            isActive("/main", "/main/pop", "/main/new")
              ? "/icons/home-active.svg"
              : "/icons/home-inactive.svg"
          }
          alt="홈"
          className="w-[1.5rem] h-[1.5rem] ml-[0.1rem]"
        />
        <span className="text-[0.625rem] mt-1 font-medium">홈</span>
      </button>

      {/* 검색 */}
      <button
        onClick={() => navigate("/category-search")}
        className={`flex flex-col items-center ml-[-0.5rem] bg-transparent border-none focus:outline-none ${
          isActive("/category-search", "/search", "/search-result") ? "text-[#000000]" : "text-[#B5BBC1]"
        }`}
      >
        <img
          src={
            isActive("/category-search", "/search", "/search-result")
              ? "/icons/search-active.svg"
              : "/icons/search-inactive.svg"
          }
          alt="검색"
          className="w-[1.5rem] h-[1.5rem]"
        />
        <span className="text-[0.625rem] mt-1">검색</span>
      </button>

      {/* 채팅 */}
      <button
        onClick={() => navigate("/chat-list")}
        className={`flex flex-col items-center relative bg-transparent border-none focus:outline-none ${
          isActive("/chat-list") ? "text-[#000000]" : "text-[#B5BBC1]"
        }`}
      >
        <img
          src={
            isActive("/chat-list")
              ? "/icons/chat-active.svg"
              : "/icons/chat-inactive.svg"
          }
          alt="채팅"
          className="w-[1.5rem] h-[1.5rem]"
        />
        <span className="text-[0.625rem] mt-1">대화</span>
      </button>

      {/* 마이페이지 */}
      <button
        onClick={() => navigate("/mypage/ques")}
        className={`flex flex-col items-center bg-transparent border-none focus:outline-none ${
          isActive("/mypage/ques", "/mypage/chats", "/mypage/save", "/mypage/scrap") ? "text-[#000000]" : "text-[#B5BBC1]"
        }`}
      >
        <img
          src={
            isActive("/mypage/ques", "/mypage/chats", "/mypage/save", "/mypage/scrap")
              ? "/icons/mypage-active.svg"
              : "/icons/mypage-inactive.svg"
          }
          alt="마이페이지"
          className="w-[1.5rem] h-[1.5rem]"
        />
        <span className="text-[0.625rem] mt-1">마이페이지</span>
      </button>
    </div>
  );
}