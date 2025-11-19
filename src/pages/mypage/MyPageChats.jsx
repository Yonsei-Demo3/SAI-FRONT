import React, { useState } from "react";
import Navbar from "../../components/main/Navbar";
import BottomNav from "../../components/main/BottomNav";
import { useNavigate } from "react-router-dom";

export default function MyPageChats() {
  const navigate = useNavigate();
  const [sortOpen, setSortOpen] = useState(false);

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

      {/* 페이지 타이틀 */}
      <div className="px-[1.5rem] mt-[1.5rem] flex items-center">
        <button
          className="mr-2"
          onClick={() => navigate("/mypage")}
        >
          <img src="/icons/arrow-left.svg" className="w-[0.5369rem] h-[0.9281rem]" alt="뒤로" />
        </button>
        <p className="text-[1.2rem] font-bold">아카이브</p>
      </div>

      {/* 상단 탭 */}
      <div className="flex justify-start ml-[1.5rem] gap-[2.25rem] mt-[1.5rem] text-[1.125rem] font-semibold">
        <button className="font-semibold text-[#FA502E] border-b-2 border-[#FA502E] pb-1">
          대화
        </button>
        <button onClick={() => navigate("/mypage/scrap")}>스크랩</button>
      </div>

      {/* 전체 갯수 + 정렬 버튼 */}
      <div className="px-[1.5rem] mt-[1.25rem] flex justify-between items-center">
        <p className="text-[1.125rem] font-semibold">전체 13</p>

        <button
          onClick={() => setSortOpen(true)}
          className="flex items-center text-[1rem] text-[#6B7280]"
        >
          <img src="/icons/filter.svg" className="w-[1.3125rem] h-[1.3125rem] mr-[0.25rem]" />
          최근 대화 순
        </button>
      </div>

      {/* 대화 리스트 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[6rem]">
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

      {/* BottomNav (정렬 켜지면 숨김) */}
      {!sortOpen && <BottomNav />}

      {/* 정렬 바텀시트 */}
      {sortOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          {/* 흐릿한 회색 딤 */}
          <div
            className="absolute inset-0 bg-black/10"
            onClick={() => setSortOpen(false)}
          />

          {/* 모달 박스 */}
          <div className="relative bg-white rounded-t-[1.5rem] w-full max-w-[500px] mx-auto p-6 z-[70]">

            {/* 손잡이 */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <p className="text-center text-[1.25rem] font-bold mb-6">정렬</p>

            {/* 옵션들 */}
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border border-[#FA502E] bg-[#FFF2EE] rounded-lg text-[#FA502E] font-medium">
                최근 대화 순
              </button>

              <button className="p-3 bg-[#F2F4F8] rounded-lg">오래된 대화 순</button>

              <button className="p-3 bg-[#F2F4F8] rounded-lg">저장한 대화 많은 순</button>

              <button className="p-3 bg-[#F2F4F8] rounded-lg">함께한 질문 많은 순</button>
            </div>

            {/* 적용/취소 버튼 */}
            <div className="flex mt-6">
              <button
                onClick={() => setSortOpen(false)}
                className="flex-1 py-3 bg-[#F2F4F8] text-[#000] rounded-l-lg"
              >
                취소
              </button>

              <button className="flex-1 py-3 bg-[#FA502E] text-white rounded-r-lg">
                적용하기
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
