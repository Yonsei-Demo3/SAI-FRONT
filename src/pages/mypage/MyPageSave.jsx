// src/screens/mypage/MyPageSaveScreen.jsx (파일 이름은 너가 쓰는 걸로!)
import React, { useState } from "react";
import BottomNav from "../../components/main/BottomNav";
import { useNavigate } from "react-router-dom";
import MyPageNav from "../../components/mypage/MyPageNav";

export default function MyPageSaves() {
  const navigate = useNavigate();
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");

  // 임시 더미 데이터 (나중에 API 연결만 바꾸면 됨)
  const saves = [
    {
      id: 1,
      highlight:
        "저는 그래서 처음에는 제목을 보고 굉장히 밝은 이야기들이 담겨 있을 거라고 생각했는데 읽고보니 여름의 따사로움보다는 장마에 가까운 이야기여서 놀랐어요.",
      contentTitle: "바깥은 여름",
      questionTitle:
        "잊고 싶은 기억을 완전히 지울 수 있다면 삶은 더 나아질까요, 아니면 그 기억까지 포함한 내가 사라지는 걸까요?",
      savedAt: "2025.10.31 16:56",
    },
    {
      id: 2,
      highlight:
        "기억을 지운다는 건 고통을 없애기 위함일까, 아니면 다시 사랑하기 위해 자신을 비워내는 행위일까?",
      contentTitle: "이터널 선샤인",
      questionTitle:
        "잊고 싶은 기억을 완전히 지울 수 있다면 삶은 더 나아질까요, 아니면 그 기억까지 포함한 내가 사라지는 걸까요?",
      savedAt: "2025.10.29 21:12",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      {/* 상단 프로필 + 탭 */}
      <MyPageNav />

      {/* 정렬 드롭다운 */}
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
            <div className="absolute right-0 mt-2 w-[4.5rem] bg-white rounded-[0.25rem] shadow-lg z-50">
              <button
                className="w-full text-right px-3 py-2 text-xs text-[#B5BBC1]"
                onClick={() => {
                  setSortType("최신순");
                  setSortOpen(false);
                }}
              >
                최신순
              </button>
              <button
                className="w-full text-right px-3 py-2 text-xs text-[#B5BBC1]"
                onClick={() => {
                  setSortType("오래된순");
                  setSortOpen(false);
                }}
              >
                오래된순
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 저장 리스트 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[6rem] no-scrollbar">
        {saves.map((item) => (
          <div
            key={item.id}
            className="w-full bg-white rounded-[1rem] border border-[#E7EBEF] p-5 mb-[1rem]"
          >
            {/* 상단: 따옴표 + 저장한 문장 */}
            <div className="flex items-start px-[0.5rem]">
              <img
                src="/icons/quote.svg"
                alt="quote"
                className="w-[1rem] h-[1rem] opacity-70 mt-[0.2rem] mr-[0.5rem]"
              />
              
            </div>
              <p className="text-[1rem] px-[0.5rem] mt-[0.25rem] leading-[1.6rem] text-[#111827]">
                {item.highlight}
              </p>
            {/* 콘텐츠 제목 + 원 질문 */}
            <div className="mt-[1.25rem]">
              <p className="text-[0.625rem] text-[#9CA3AF] mb-[0.25rem]">
                {item.contentTitle}
              </p>
              <p className="text-[0.75rem] font-bold text-[#111827] leading-[1.4rem]">
                {item.questionTitle}
              </p>
            </div>

            {/* 날짜 + 아이콘들 */}
            <div className="flex items-center justify-between mt-[1rem] mb-[0.5rem]">
              <p className="text-[0.75rem] text-[#9CA3AF]">
                {item.savedAt}
              </p>
              <div className="flex items-center gap-[1rem]">
                <button
                  type="button"
                  className="bg-transparent border-none outline-none"
                  onClick={() => {
                    // TODO: 공유 기능
                    console.log("share", item.id);
                  }}
                >
                  <img
                    src="/icons/share.svg"
                    alt="공유"
                    className="w-[1rem] h-[1rem]"
                  />
                </button>
                <button
                  type="button"
                  className="bg-transparent border-none outline-none"
                  onClick={() => {
                    // TODO: 삭제 기능
                    console.log("delete", item.id);
                  }}
                >
                  <img
                    src="/icons/trash.svg"
                    alt="삭제"
                    className="w-[1rem] h-[1rem]"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 질문하기 버튼 */}
      <button
        className="fixed bottom-[5.5rem] right-[1.5rem] w-[7rem] h-[2.75rem] bg-[#FA502E] text-[#FFFFFF] rounded-[1.5rem] text-[0.875rem] font-medium shadow-md flex items-center justify-center gap-[0.5rem] z-50 border-none outline-none"
        onClick={() => navigate("/question")}
      >
        <img
          src="/icons/question.svg"
          alt="질문"
          className="w-[1rem] h-[1rem]"
        />
        질문하기
      </button>

      <BottomNav />
    </div>
  );
}
