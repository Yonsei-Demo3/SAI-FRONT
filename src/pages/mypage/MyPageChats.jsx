import React, { useState } from "react";
import Navbar from "../../components/main/Navbar";
import BottomNav from "../../components/main/BottomNav";
import { useNavigate } from "react-router-dom";
import MyPageNav from "../../components/mypage/MyPageNav";

export default function MyPageChats() {
  const navigate = useNavigate();
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");

  const chats = [
    {
      id: 1,
      category: "콘텐츠명",
      title: "질문",
      questions: 5,
      saved: 12,
      thumbnail: "/icons/sample1.svg",
    },
    {
      id: 2,
      category: "대분류 / 소분류",
      title: "서사의 위기",
      questions: 5,
      saved: 12,
      thumbnail: "/icons/sample1.svg",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <MyPageNav/>

    <div className="flex justify-end items-center pr-[1.5rem]">

      <div className="relative text-[0.75rem]">
            <button
              className="text-[#6B7280] text-xs flex items-center"
              onClick={() => setSortOpen(!sortOpen)}
            >
              {sortType}
              <img
                src="/icons/arrow-down.svg"
                className="w-[1rem] h-[1rem] ml-[0.25rem]"
              />
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-[6rem] bg-white rounded-xl shadow-lg z-50">
                <button
                  className="w-full text-left px-3 py-2 text-xs text-[#B5BBC1]"
                  onClick={() => {
                    setSortType("가나다순");
                    setSortOpen(false);
                  }}
                >
                  가나다순
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-xs text-[#B5BBC1]"
                  onClick={() => {
                    setSortType("인기순");
                    setSortOpen(false);
                  }}
                >
                  인기순
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-xs text-[#B5BBC1]"
                  onClick={() => {
                    setSortType("최신순");
                    setSortOpen(false);
                  }}
                >
                  최신순
                </button>
              </div>
            )}
          </div>
        </div>

      {/* 대화 리스트 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[6rem] no-scrollbar">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-start mb-[1.5rem] cursor-pointer"
            onClick={() =>
              navigate(`/mypage/chat/${chat.id}`, { state: { chat } })
            }
          >
            <img
              src={chat.thumbnail}
              className="w-[4.5rem] h-[4.5rem] rounded-lg mr-[1rem]"
            />

            <div className="flex flex-col">
              <p className="text-[0.875rem] text-[#9CA3AF]">{chat.category}</p>
              <p className="text-[1.125rem] font-semibold mt-[0.25rem]">
                {chat.title}
              </p>
              <p className="text-[0.875rem] text-[#6B7280] mt-[0.25rem]">
                함께한 질문 {chat.questions} | 저장한 대화 {chat.saved}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-[5.5rem] right-[1.5rem] w-[7rem] h-[2.75rem] bg-[#FA502E] text-[#FFFFFF] rounded-[1.5rem] text-[0.875rem] font-medium shadow-md flex items-center justify-center gap-[0.5rem] z-50 border-none outline-none"
        onClick={() => navigate("/question")}
      >
        <img src="/icons/question.svg" alt="질문" className="w-[1rem] h-[1rem]" />
        질문하기
      </button>

      <BottomNav/>

    </div>
  );
}
