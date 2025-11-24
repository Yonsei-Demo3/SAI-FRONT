// src/screens/mypage/MyPageScrapScreen.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";
import MyPageNav from "../../components/mypage/MyPageNav";

export default function MyPageQuesScreen() {
  const navigate = useNavigate();

  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");


  const favoriteQuestions = [
    {
      id: 101,
      questionTitle:
        "기억을 지운다는 건 고통을 없애기 위함일까, 아니면 다시 사랑하기 위해 자신을 비워내는 행위일까?",
      questionDescription: "아픈 기억이 사라지면 편해질 것 같지만, 그 기억이 사라지면 지금의 나도 조금 달라질 것 같다는 생각이 들더라고요.",
      hostNickname: "익명의 사자",
      contentName: "이터널 선샤인",
      mainCategory: "도서",
      subCategory: "소설",
      participantCount: 1,
      maxParticipants: 4,
      chatTags: ["진행중"],
      tags: ["용서", "기억"],
      likeCount: 20,
    },
    {
      id: 102,
      questionTitle:
        "잊고 싶은 기억을 완전히 지울 수 있다면 삶은 더 나아질까요?",
      questionDescription: "아픈 기억이 사라지면 편해질 것 같지만, 그 기억이 사라지면 지금의 나도 조금 달라질 것 같다는 생각이 들더라고요.",
      hostNickname: "익명의 사자",
      contentName: "이터널 선샤인",
      mainCategory: "도서",
      subCategory: "소설",
      participantCount: 1,
      maxParticipants: 4,
      chatTags: ["진행중"],
      tags: ["기억"],
      likeCount: 12,
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <MyPageNav />

      {/* 전체 개수 + 정렬 버튼 */}
      <div className="flex justify-end items-center px-[1.5rem] mt-[1.25rem]">
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

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[7rem] no-scrollbar">


        {/* ==== 관심 질문 탭 ==== */}
          {favoriteQuestions.map((q)=> (
            <div
              key={q.id}
            >
              {/* 질문 문장 + 따옴표 */}
              <div className="relative w-full flex px-[1.5rem] items-start">
                <img
                  src="/icons/quote.svg"
                  alt="quote"
                  className="w-[1rem] h-[1rem] opacity-70 mt-[0.5rem] flex-shrink-0"
                />
              </div>
                <div className="relative text-left mt-[0.5rem] leading-[1.5] px-[1.5rem]">
                  <p className="text-[1rem] font-medium text-[#191D1F]">
                    {q.questionTitle}
                  </p>

                  <p className="text-[0.875rem] text-[#6B7280] mt-[0.5rem] mb-[0.75rem]">
                    {q.questionDescription}
                  </p>
                </div>
              

              {/* 구분선 */}
              <div className="w-full h-[1px] px-[1.5rem] bg-[#E7EBEF] my-4" />

              {/* 닉네임 + 콘텐츠명 */}
              <div className="flex flex-col px-[1.5rem] gap-[0.2rem]">
                <p className="text-[0.75rem] text-[#6B7280]">
                  {q.hostNickname}
                </p>
                <p className="text-[0.75rem] text-[#9CA3AF]">
                  {q.mainCategory} &gt; {q.subCategory}
                </p>
                <p className="text-[0.9rem] font-bold text-[#3B3D40] mt-[0.1rem]">
                  {q.contentName}
                </p>
              </div>

              {/* 참여 인원 + 태그 */}
              <div className="flex flex-wrap items-center px-[1.5rem] gap-2 mt-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F2F4F8] text-[#3B3D40] text-[0.75rem]">
                  <img src="/icons/people.svg" className="w-4 h-4" />
                  {q.participantCount}/{q.maxParticipants}
                </div>

                {q.chatTags.map((chatTags) => (
                  <span
                    key={chatTags}
                    className="px-2 py-1 bg-[#F0FFD9] text-[#7DCA01] text-[0.75rem] rounded-md"
                  >
                    {chatTags}
                  </span>
                ))}

                {q.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 하트 + 대화 보기 버튼 */}
              <div className="flex items-center justify-between px-[1.5rem] mt-4 mb-[2rem]">
                <button className="flex items-center gap-1">
                  <img
                    src="/icons/heart-filled.svg"
                    className="w-5 h-5"
                    alt=""
                  />
                  <span className="text-[0.9rem] text-[#3B3D40]">
                    {q.likeCount}
                  </span>
                </button>

                <button
                  className="px-4 py-[0.4rem] rounded-[0.5rem] bg-[#54575C] text-white text-[0.75rem] font-bold"
                  onClick={() => {
                    // TODO: 실제 상세 페이지로 이동할 때 경로 맞게 수정
                    navigate("/detail", { state: { item: q } });
                  }}
                >
                  대화 보기
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* 질문하기 버튼 */}
      <button
        className="fixed bottom-[5.5rem] right-[1.5rem] w-[7rem] h-[2.75rem] bg-[#FA502E] text-[#FFFFFF] rounded-[1.5rem] text-[0.875rem] font-medium shadow-md flex items-center justify-center gap-[0.5rem] z-50 border-none outline-none"
        onClick={() => navigate("/question")}
      >
        <img src="/icons/question.svg" alt="질문" className="w-[1rem] h-[1rem]" />
        질문하기
      </button>

      <BottomNav />
    </div>
  );
}
