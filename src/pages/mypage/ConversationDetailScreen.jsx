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
      question: "이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.",
      answer:
        "저는 그래서 처음에는 제목을 보고 굉장히 밝은 이야기들이 담겨 있을 거라고 생각했었는데 읽고보니 여름의 따사로움보다는 장마에 가까운 이야기여서 놀랐었어요.",
      date: "2025.10.31 16:56",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">

      {/* 상단 네비 */}
      <div className="px-[1.5rem] mt-[1.5rem] flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" className="w-[0.6rem]" />
        </button>

        <p className="text-[1.2rem] font-bold">대화</p>

        <button className="bg-[#FA502E] text-white px-4 py-2 rounded-lg text-[0.9rem] font-semibold">
          대화 정보 →
        </button>
      </div>

      {/* 대표 이미지 */}
      <div className="w-full flex justify-center mt-[1.5rem]">
        <img
          src="/icons/sample1.svg"
          className="w-[12rem] h-[12rem] rounded-xl shadow-md"
        />
      </div>

      {/* 제목 */}
      <div className="px-[1.5rem] mt-[1.25rem]">
        <p className="text-[1.5rem] font-bold leading-tight">
          바깥은 여름 (The Summer Beyond My Window)
        </p>
      </div>

      {/* 탭 버튼 */}
      <div className="flex px-[1.5rem] gap-[2rem] mt-[1.5rem] border-b border-[#EEE] pb-[0.7rem]">
        <button
          onClick={() => setTab("questions")}
          className={`text-[1rem] ${
            tab === "questions" ? "text-black font-semibold border-b-2 border-[#FA502E] pb-[0.2rem]" : "text-gray-500"
          }`}
        >
          함께한 질문
        </button>

        <button
          onClick={() => setTab("saved")}
          className={`text-[1rem] ${
            tab === "saved" ? "text-black font-semibold border-b-2 border-[#FA502E] pb-[0.2rem]" : "text-gray-500"
          }`}
        >
          저장한 대화
        </button>
      </div>

      {/* 내용 영역 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[6rem]">

        {/* 📌 탭 1: 함께한 질문 */}
        {tab === "questions" && (
          <div>
            {/* Q1 */}
            <div className="flex mb-[2rem]">
              <div className="mr-[1rem]">
                <div className="text-[#FA502E] font-bold text-[1.1rem]">Q1</div>
                <div className="w-[1px] bg-[#FA502E] h-[3.5rem] ml-[0.5rem]"></div>
              </div>

              <p className="text-[1rem] leading-[1.6rem] text-black">
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.
              </p>
            </div>

            {/* Q2 */}
            <div className="flex mb-[2rem]">
              <div className="mr-[1rem]">
                <div className="text-[#FA502E] font-bold text-[1.1rem]">Q2</div>
                <div className="w-[1px] bg-[#FA502E] h-[3.5rem] ml-[0.5rem]"></div>
              </div>

              <p className="text-[1rem] leading-[1.6rem] text-black">
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.
                <br />
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.
              </p>
            </div>

            {/* Q3 */}
            <div className="flex mb-[2rem]">
              <div className="mr-[1rem]">
                <div className="text-[#FA502E] font-bold text-[1.1rem]">Q3</div>
                <div className="w-[1px] bg-[#FA502E] h-[3.5rem] ml-[0.5rem]"></div>
              </div>

              <p className="text-[1rem] leading-[1.6rem] text-black">
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.
                <br />
                이 작품의 제목이 ‘바깥은 여름’인 이유에 대한 생각을 자유롭게 나눠보아요.
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
                className="bg-white border border-[#E5E7EB] rounded-[1rem] p-4 mb-[1.5rem]"
              >
                <p className="text-[0.875rem] text-[#6B7280] mb-[0.5rem]">
                  질문 ⎯ {chat.question}
                </p>

                <div className="p-4">
                  <img src="/icons/quote.svg" className="w-[1.2rem] opacity-70 mb-2" />

                  <p className="text-[1rem] leading-[1.6rem] text-[#333] whitespace-pre-line">
                    {chat.answer}
                  </p>

                  <img
                    src="/icons/quote-down.svg"
                    className="w-[1.2rem] opacity-70 mt-2 ml-auto"
                  />

                  <p className="text-[#6B7280] text-[0.75rem] text-right mt-2">
                    {chat.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
