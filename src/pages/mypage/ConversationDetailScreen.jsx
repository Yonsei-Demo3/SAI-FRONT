import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";

export default function ConversationDetailScreen() {
  const navigate = useNavigate();

  // 👉 탭 상태 : "questions" 또는 "saved"
  const [tab, setTab] = useState("questions");

  const savedChats = [
    {
      id: 1,
      question:
        "이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.",
      answer:
        "저는 그래서 처음에는 제목을 보고 굉장히 밝은 이야기들이 담겨 있을 거라고 생각했었는데 읽고보니 여름의 따사로움보다는 장마에 가까운 이야기여서 놀랐었어요.",
      date: "2025.10.31 16:56",
    },
  ];

  // 나중에 API 연결하면 여기로 제목/이미지 내려받아서 쓰면 됨
  const coverTitle = "상실 이후에도 일상은 계속돼야 할까요?";
  const coverImage = "/icons/book1.svg";

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <div className="relative w-full">
        <div className="relative h-[17rem] w-full overflow-hidden">
          <img
            src={coverImage}
            alt="책 배경"
            className="w-full h-full object-cover"
          />
          {/* #191D1F 50% 오버레이 */}
          <div className="absolute inset-0 bg-[#191D1F]/50" />

          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-[1.25rem] left-[1.5rem] bg-transparent border-none outline-none"
          >
            <img
              src="/icons/arrow-left.svg"
              alt="뒤로가기"
              className="w-[0.5369rem] h-[0.9281rem]"
            />
          </button>

          {/* 가운데 책 커버 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[10%]">
            <div className="w-[10rem] h-[13.3125rem] bordered border-none shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <img
                src={coverImage}
                alt="책 표지"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 제목 */}
      <div className="px-[1.5rem] mt-[1.75rem]">
        <p className="text-[1.25rem] font-bold leading-[1.9rem] break-keep">
          {coverTitle}
        </p>
      </div>

      {/* ===== 탭 버튼 ===== */}
      <div className="flex px-[1.5rem] gap-[2rem] mt-[1.2rem] border-b border-[#EEE] pb-[0.7rem]">
        <button
          onClick={() => setTab("questions")}
          className={`text-[1rem] ${
            tab === "questions"
              ? "text-black font-semibold border-b-2 border-[#FA502E] pb-[0.2rem]"
              : "text-gray-500"
          }`}
        >
          저장한 질문
        </button>

        <button
          onClick={() => setTab("saved")}
          className={`text-[1rem] ${
            tab === "saved"
              ? "text-black font-semibold border-b-2 border-[#FA502E] pb-[0.2rem]"
              : "text-gray-500"
          }`}
        >
          저장한 대화
        </button>
      </div>

      {/* ===== 내용 영역 ===== */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[9rem]">
        {/* 📌 탭 1: 함께한 질문 */}
        {tab === "questions" && (
          <div>
            {/* Q1 */}
            <div className="flex mb-[2rem]">
              <div className="flex flex-col items-center mr-[1rem]">
                <div className="text-[#FA502E] border rounded-[0.5rem] px-[0.5rem] font-bold text-[0.875rem]">
                  Q1
                </div>
                <div className="flex-1 relative">
                  <div className="w-[0.0625rem] bg-[#FA502E] h-full" />
                  <div className="w-[0.35rem] h-[0.35rem] bg-[#FA502E] rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-0.2rem]" />
                </div>
              </div>
              <p className="text-[1rem] leading-[1.6rem] text-black">
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게
                나눠보아요.
              </p>
            </div>

            {/* Q2 */}
            <div className="flex mb-[2rem]">
              <div className="flex flex-col items-center mr-[1rem]">
                <div className="text-[#FA502E] border rounded-[0.5rem] px-[0.5rem] font-bold text-[0.875rem]">
                  Q2
                </div>
                <div className="flex-1 relative">
                  <div className="w-[0.0625rem] bg-[#FA502E] h-full" />
                  <div className="w-[0.35rem] h-[0.35rem] bg-[#FA502E] rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-0.2rem]" />
                </div>
              </div>

              <p className="text-[1rem] leading-[1.6rem] text-black">
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
                <div className="text-[#FA502E] border rounded-[0.5rem] px-[0.5rem] font-bold text-[0.875rem]">
                  Q3
                </div>
                <div className="flex-1 relative">
                  <div className="w-[0.0625rem] bg-[#FA502E] h-full" />
                  <div className="w-[0.35rem] h-[0.35rem] bg-[#FA502E] rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-0.2rem]" />
                </div>
              </div>

              <p className="text-[1rem] leading-[1.6rem] text-black">
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게
                나눠보아요.
                <br />
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게
                나눠보아요.
              </p>
            </div>
          </div>
        )}

        {/* 📌 탭 2: 저장한 대화 */}
        {tab === "saved" && (
          <div>
            {savedChats.map((chat) => (
              <div
                key={chat.id}
                className="bg-white border border-[#E5E7EB] rounded-[1rem] p-[1.25rem] mb-[1.5rem]"
              >
                <div className="text-[0.75rem] flex items-start">
                  <p className="mr-2 text-[#3B3D40] whitespace-nowrap">질문</p>
                  <p className="text-[#191D1F] mt-[-0.15rem] leading-[1.4rem] break-keep">
                    {chat.question}
                  </p>
                </div>

                <div className="relative w-full flex items-start justify-center mt-[0.75rem]">
                  <img
                    src="/icons/quote-pink-down.svg"
                    className="w-[1rem] h-[1rem] opacity-70 mt-[0.5rem] ml-[-1rem] flex-shrink-0 mr-2"
                    alt=""
                  />

                  <div className="relative max-w-[14rem] text-center mt-[0.5rem] leading-[1.5]">
                    <p className="text-[1rem] text-[#444] leading-[1.5rem]">
                      {chat.answer}
                    </p>

                    <img
                      src="/icons/quote-pink.svg"
                      alt="quote close"
                      className="w-[1rem] h-[1rem] opacity-70 absolute right-[-1.5rem] bottom-0 translate-y-[20%]"
                    />
                  </div>
                </div>

                <p className="text-right text-[0.75rem] text-[#6B7280] mt-[0.75rem]">
                  {chat.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 CTA 버튼 (BottomNav 위) */}
      <button
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[28rem] h-[2.75rem] bg-[#191D1F] text-white rounded-[0.75rem] text-[0.95rem] font-medium shadow-md z-50 border-none outline-none"
        onClick={() => {
          alert("대화 내역 화면은 아직 준비 중이에요.");
          // 나중에 실제 대화 내역 화면으로 navigate 연결하면 됨
        }}
      >
        대화 내역 보기
      </button>

    </div>
  );
}
