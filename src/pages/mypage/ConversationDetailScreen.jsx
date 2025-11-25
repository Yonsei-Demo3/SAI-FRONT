import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";

export default function ConversationDetailScreen() {
  const navigate = useNavigate();

  // 👉 탭 상태 : "questions" 또는 "saved"
  const [tab, setTab] = useState("questions");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");

  const savedChats = [
    {
      id: 1,
      question:
        "이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.",
      answer:
        "저는 그래서 처음에는 제목을 보고 굉장히 밝은 이야기들이 담겨 있을 거라고 생각했었는데 읽고보니 여름의 따사로움보다는 장마에 가까운 이야기여서 놀랐었어요.",
      date: "2025.10.31 16:56",
    },
    {
      id: 2,
      question:
        "이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.",
      answer:
        "읽고 나서야 제목이 조금은 차갑게 느껴졌어요. 문 밖의 공기처럼, 인물들의 마음도 어쩐지 서늘하더라고요.",
      date: "2025.10.31 17:03",
    },
  ];

  // 나중에 API 연결하면 여기로 제목/이미지 내려받아서 쓰면 됨
  const coverTitle = "상실 이후에도 일상은 계속돼야 할까요?";
  const coverImage = "/icons/book1.svg";

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] font-[Pretendard]">
      {/* 뒤로가기 버튼 */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-[1.25rem] left-[1.5rem] bg-transparent border-none outline-none z-50"
          >
            <img
              src="/icons/arrow-left.svg"
              alt="뒤로가기"
              className="w-[0.5369rem] h-[0.9281rem]"
            />
          </button>
          
      {/* ===== 상단 책 영역 ===== */}
      <div className="relative w-full mt-[3rem]">
        <div className="relative h-[17rem] w-full overflow-hidden">
          {/* 흐릿한 배경용 이미지 */}
          <img
            src={coverImage}
            alt="책 배경"
            className="w-full h-full object-cover scale-110"
          />
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-[#191D1F]/50" />

          

          {/* 가운데 책 커버 카드 */}
          <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2">
            <div className="w-[10rem] h-[13.3125rem] rounded-[0.75rem] overflow-hidden">
              <img
                src={coverImage}
                alt="책 표지"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== 제목 ===== */}
      <div className="px-[1.5rem] pt-[1.6rem] pb-[0.25rem] bg-[#F9FAFB]">
        <p className="text-[1.25rem] font-bold leading-[1.9rem] break-keep text-[#111827]">
          {coverTitle}
        </p>
      </div>

      {/* ===== 탭 버튼 ===== */}
      <div className="px-[1.5rem] bg-[#F9FAFB]">
        <div className="flex gap-[2rem] mt-[1.1rem] border-b border-[#E5E7EB] pb-[0.7rem]">
          <button
            onClick={() => setTab("questions")}
            className={`text-[0.95rem] pb-[0.2rem] ${
              tab === "questions"
                ? "text-[#111827] font-semibold border-b-2 border-[#FA502E]"
                : "text-[#9CA3AF]"
            }`}
          >
            저장한 질문
          </button>

          <button
            onClick={() => setTab("saved")}
            className={`text-[0.95rem] pb-[0.2rem] ${
              tab === "saved"
                ? "text-[#111827] font-semibold border-b-2 border-[#FA502E]"
                : "text-[#9CA3AF]"
            }`}
          >
            저장한 대화
          </button>
        </div>
      </div>

      {/* ===== 내용 영역 ===== */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] pt-[1rem] pb-[9rem] bg-[#F9FAFB]">
        {/* 📌 탭 1: 저장한 질문 (Q1, Q2, Q3 타임라인 스타일) */}
        {tab === "questions" && (
          <div className="mt-[0.25rem]">
            {/* Q1 */}
            <div className="flex mb-[2rem]">
              {/* 왼쪽 타임라인 */}
              <div className="flex flex-col items-center mr-[1rem]">
                <div className="text-[#FA502E] border border-[#FA502E] rounded-[0.5rem] px-[0.55rem] py-[0.1rem] font-bold text-[0.85rem] bg-white">
                  Q1
                </div>
                <div className="flex-1 relative mt-[0.3rem]">
                  <div className="w-[0.07rem] bg-[#FA502E] h-full" />
                  <div className="w-[0.35rem] h-[0.35rem] bg-[#FA502E] rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-0.2rem]" />
                </div>
              </div>

              {/* 질문 텍스트 */}
              <p className="text-[0.95rem] leading-[1.6rem] text-[#111827]">
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게
                나눠보아요.
              </p>
            </div>

            {/* Q2 */}
            <div className="flex mb-[2rem]">
              <div className="flex flex-col items-center mr-[1rem]">
                <div className="text-[#FA502E] border border-[#FA502E] rounded-[0.5rem] px-[0.55rem] py-[0.1rem] font-bold text-[0.85rem] bg-white">
                  Q2
                </div>
                <div className="flex-1 relative mt-[0.3rem]">
                  <div className="w-[0.07rem] bg-[#FA502E] h-full" />
                  <div className="w-[0.35rem] h-[0.35rem] bg-[#FA502E] rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-0.2rem]" />
                </div>
              </div>

              <p className="text-[0.95rem] leading-[1.6rem] text-[#111827]">
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게
                나눠보아요.
                <br />
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게
                나눠보아요.
              </p>
            </div>

            {/* Q3 */}
            <div className="flex mb-[2rem]">
              <div className="flex flex-col items-center mr-[1rem]">
                <div className="text-[#FA502E] border border-[#FA502E] rounded-[0.5rem] px-[0.55rem] py-[0.1rem] font-bold text-[0.85rem] bg-white">
                  Q3
                </div>
                <div className="flex-1 relative mt-[0.3rem]">
                  <div className="w-[0.07rem] bg-[#FA502E] h-full" />
                  <div className="w-[0.35rem] h-[0.35rem] bg-[#FA502E] rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-0.2rem]" />
                </div>
              </div>

              <p className="text-[0.95rem] leading-[1.6rem] text-[#111827]">
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게
                나눠보아요.
                <br />
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게
                나눠보아요.
              </p>
            </div>
          </div>
        )}

        {/* 📌 탭 2: 저장한 대화 (사진 4 스타일) */}
        {tab === "saved" && (
          <div className="mt-[0.25rem]">
            {/* 전체 개수 + 정렬 */}
            <div className="flex justify-between items-center mb-[0.9rem]">
              <p className="text-[0.8rem] text-[#6B7280]">
                전체 {savedChats.length}
              </p>

              <div className="relative text-[0.8rem]">
                <button
                  className="flex items-center text-[#6B7280]"
                  onClick={() => setSortOpen((prev) => !prev)}
                >
                  {sortType}
                  <img
                    src="/icons/arrow-down.svg"
                    className="w-[1rem] h-[1rem] ml-[0.1rem]"
                  />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-[4.5rem] bg-white rounded-[0.25rem] shadow-lg z-50">
                    <button
                      className="w-full text-right px-3 py-2 text-[0.75rem] text-[#B5BBC1]"
                      onClick={() => {
                        setSortType("최신순");
                        setSortOpen(false);
                      }}
                    >
                      최신순
                    </button>
                    <button
                      className="w-full text-right px-3 py-2 text-[0.75rem] text-[#B5BBC1]"
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

            {savedChats.map((chat) => (
              <div key={chat.id} className="mb-[2rem]">
                {/* 질문 문장 (카드 위에 노출) */}
                <div className="text-[0.75rem] flex items-start mb-[0.6rem]">
                  <p className="mr-2 text-[#6B7280] whitespace-nowrap">질문</p>
                  <p className="text-[#374151] leading-[1.4rem] break-keep">
                    {chat.question}
                  </p>
                </div>

                {/* 답변 카드 */}
                <div className="bg-white border border-[#E5E7EB] rounded-[1rem] p-[1.25rem] shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
                  <div className="flex">
                    <img
                      src="/icons/quote-pink-down.svg"
                      className="w-[1rem] h-[1rem] mt-[0.1rem] mr-[0.4rem]"
                      alt=""
                    />
                    <p className="text-[0.95rem] text-[#111827] leading-[1.6rem]">
                      {chat.answer}
                    </p>
                  </div>

                  <p className="text-right text-[0.75rem] text-[#9CA3AF] mt-[0.9rem]">
                    {chat.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[28rem] h-[2.9rem] bg-[#191D1F] text-white rounded-[0.9rem] text-[0.95rem] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.25)] z-50 border-none outline-none"
        onClick={() => {
          alert("대화 내역 화면은 아직 준비 중이에요.");
          // 나중에 실제 대화 내역 화면으로 navigate 연결
        }}
      >
        대화 내역 보기
      </button>
    </div>
  );
}
