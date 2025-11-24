import React, { useState } from "react";
import BottomNav from "../../components/main/BottomNav";
import MyPageNav from "../../components/mypage/MyPageNav";

export default function MyPageScrapScreen() {

  const [selectedTab, setSelectedTab] = useState("관심 채팅");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최근 스크랩 순");
  const [openMenuId, setOpenMenuId] = useState(null);

  // 📌 관심 채팅 리스트
  const favoriteChats = [
    {
      id: 1,
      title: "레미제라블",
      status: "진행중",
      thumbnail: "/icons/book2.svg",
      summary:
        "신념에 따라 살아가던 자베르는 본인의 신념에 의해 죄인인 장발장에게 목숨을 구원받고 나서 혼란을 느끼며 자살을 택하고 맙니다...",
    },
    {
      id: 2,
      title: "벤자민 버튼의 시간은 거꾸로 간다",
      status: "종료",
      thumbnail: "/icons/book3.svg",
      summary: "운명이 있다고 생각하시나요?",
    },
  ];

  // 📌 인상 깊은 대화 리스트
  const deepScraps = [
    {
      id: 3,
      title: "바깥은 여름",
      thumbnail: "/icons/book1.svg",
      tags: ["# 한국소설", "# 단편집"],
      question:
        "이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.",
      answer:
        "저는 그래서 처음에는 제목을 보고 밝은 이야기들이 담겨 있을 거라 생각했는데, 읽고보니 장마에 가까운 이야기여서 놀랐어요.",
      date: "2025.10.31 16:56",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
    <MyPageNav/>

      {/* 카테고리 탭 */}
      <div className="flex gap-3 px-[1.5rem] mt-[1.5rem]">
        {["관심 채팅", "인상 깊은 대화"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTab(t)}
            className={`px-4 py-1 rounded-full text-[0.85rem] border ${
              selectedTab === t
                ? "bg-[#FFF2EE] border-[#FA502E] text-[#FA502E]"
                : "bg-white border-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 전체 수 + 정렬 */}
      <div className="flex justify-between px-[1.5rem] mt-[1.25rem] items-center">
        <p className="text-[1.1rem] font-medium">전체 10</p>

        <button
          className="flex items-center text-[#6B7280] text-[0.9rem]"
          onClick={() => setSortOpen(true)}
        >
          <img src="/icons/filter.svg" className="w-[1.2rem] h-[1.2rem] mr-1" />
          {sortType}
        </button>
      </div>

      {/* 내용 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[7rem] no-scrollbar">

        {/* 📌 관심 채팅 모드 */}
        {selectedTab === "관심 채팅" &&
          favoriteChats.map((chat) => (
            <div
              key={chat.id}
              className="bg-white border border-[#E5E7EB] rounded-[1rem] p-4 mb-6 relative"
            >
              {/* 점 3개 */}
              <button
                className="absolute top-4 right-4"
                onClick={() =>
                  setOpenMenuId(openMenuId === chat.id ? null : chat.id)
                }
              >
                <img src="/icons/more.svg" className="w-5 h-5" />
              </button>

              {/* 메뉴 */}
              {openMenuId === chat.id && (
                <div className="absolute top-10 right-4 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-[6rem] z-50">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                    삭제
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                    공유
                  </button>
                </div>
              )}

              {/* 상단 썸네일 + 정보 */}
              <div className="flex gap-4 items-start">
                <img
                  src={chat.thumbnail}
                  className="w-[4.5rem] h-[4.5rem] rounded-md object-cover"
                />

                <div className="flex flex-col">
                  <span
                    className={`px-[0.3rem] py-[0.15rem] text-[0.75rem] border rounded-md ${
                      chat.status === "진행중"
                        ? "bg-[#E6F8E6] w-[2.75rem] text-[#2ECC71]"
                        : "bg-[#EEE] w-[2.0625rem] text-[#555]"
                    }`}
                  >
                    {chat.status}
                  </span>

                  <p className="text-[0.875rem] font-semibold mt-1">{chat.title}</p>
                </div>
              </div>

              {/* 설명 */}
              <p className="mt-4 text-[0.9rem] text-[#444] leading-[1.4rem]">
                {chat.summary}
              </p>
            </div>
          ))}

        {/* 📌 인상 깊은 대화 모드 */}
        {selectedTab === "인상 깊은 대화" &&
          deepScraps.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[1rem] border border-[#E5E7EB] p-4 mb-6 relative"
            >
              {/* 점 3개 */}
              <button
                className="absolute top-4 right-4"
                onClick={() =>
                  setOpenMenuId(openMenuId === item.id ? null : item.id)
                }
              >
                <img src="/icons/more.svg" className="w-5 h-5" />
              </button>

              {openMenuId === item.id && (
                <div className="absolute top-10 right-4 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-[6rem] z-50">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                    삭제
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                    공유
                  </button>
                </div>
              )}

              {/* 상단 영역 */}
              <div className="flex gap-4">
                <img
                  src={item.thumbnail}
                  className="w-[4.5rem] h-[4.5rem] rounded-md object-cover"
                />

                <div className="flex flex-col flex-1">
                  <div className="flex gap-2 flex-wrap">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-[0.1rem] border border-[#FA502E] text-[#FA502E] text-[0.75rem] rounded-md bg-[#FFF2EE]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-1 text-[1rem] font-semibold">{item.title}</p>
                </div>
              </div>

              {/* 질문 */}
              <div className="mt-4 text-[0.75rem] flex items-start">
                <p className="mr-2 text-[#3B3D40] whitespace-nowrap">질문</p>
                <p className="text-[#191D1F] leading-[1.4rem] break-keep">{item.question}</p>
              </div>

              {/* 따옴표 + 문장(오른쪽 따옴표는 마지막 줄 끝) */}
              <div className="relative w-full flex items-start justify-center">

                {/* 왼쪽 따옴표 */}
                <img
                  src="/icons/quote-pink-down.svg"
                  alt="quote"
                  className="w-[1rem] h-[1rem] opacity-70 mt-[0.5rem] ml-[-1rem] flex-shrink-0 mr-2"
                />

                {/* 문장 + 오른쪽 따옴표 absolute */}
                <div className="relative max-w-[14rem] text-center mt-[0.5rem] leading-[1.5]">
                <p className="text-[0.85rem] text-[#444] leading-[1.5rem]">
                  {item.answer}
                </p>

                  {/* 오른쪽 따옴표 → 마지막 줄 끝에 자동 정렬 */}
                  <img
                    src="/icons/quote-pink.svg"
                    alt="quote close"
                    className="w-[1rem] h-[1rem] opacity-70 absolute right-[-1.5rem] bottom-0 translate-y-[20%]"
                  />
                </div>
              </div>
              <p className="text-right text-[0.8rem] text-[#6B7280] mt-2">
                  {item.date}
                </p>
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

      <BottomNav />

      {/* 📌 정렬 바텀시트 */}
      {sortOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setSortOpen(false)}
          />

          <div className="bg-white rounded-t-[1.5rem] p-6 w-full max-w-[500px] mx-auto z-50">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <p className="text-center text-[1.2rem] font-semibold mb-6">정렬</p>

            <div className="flex mb-5 gap-3">
              <button
                className={`flex-1 py-3 rounded-lg border text-[0.9rem] ${
                  sortType === "최근 스크랩 순"
                    ? "border-[#FA502E] bg-[#FFF2EE] text-[#FA502E]"
                    : "bg-[#F2F4F8]"
                }`}
                onClick={() => setSortType("최근 스크랩 순")}
              >
                최근 스크랩 순
              </button>

              <button
                className={`flex-1 py-3 rounded-lg border text-[0.9rem] ${
                  sortType === "오래된 스크랩 순"
                    ? "border-[#FA502E] bg-[#FFF2EE] text-[#FA502E]"
                    : "bg-[#F2F4F8]"
                }`}
                onClick={() => setSortType("오래된 스크랩 순")}
              >
                오래된 스크랩 순
              </button>
            </div>

            <div className="flex">
              <button
                className="flex-1 py-3 bg-[#F2F4F8] rounded-l-lg text-[1rem]"
                onClick={() => setSortOpen(false)}
              >
                취소
              </button>
              <button
                className="flex-1 py-3 bg-[#FA502E] text-white rounded-r-lg text-[1rem]"
                onClick={() => setSortOpen(false)}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
