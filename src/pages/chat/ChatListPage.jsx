import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContentTopBar from "../../components/contents/contentTopBar";
import BottomNav from "../../components/main/BottomNav";
import ChatListTopBar from "../../components/chat/ChatListTopBar";

const API_RESPONSES = {
  prepare: [
    {
      id: 0,
      title: "기억 통제로 인간은 더 행복해질까?",
      currentParticipant: 3,
      maxParticipant: 4,
      status: "pending",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 1,
      title: "기억 통제로 인간은 더 행복해질까?",
      currentParticipant: 2,
      maxParticipant: 4,
      status: "ready",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    }
  ],

  participate: [
    {
      id: 0,
      title: "기억 통제로 인간은 더 행복해질까?",
      currentParticipant: 2,
      maxParticipant: 4,
      status: "pending",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 1,
      title: "기억 통제로 인간은 더 행복해질까?",
      currentParticipant: 3,
      maxParticipant: 4,
      status: "ready",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "기억 통제로 인간은 더 행복해질까?",
      currentParticipant: 4,
      maxParticipant: 4,
      status: "pending",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
  ],

  past: [
    {
      id: 0,
      title: "기술이 인간의 감정과 어떻게 연결될까?",
      question:
        "좋든 기억이든 나쁜 기억이든 다 내 일부니까, 고통도 성장의 근원이 될 수 있지 않을까?",
      participant: 4,
      date: "25.10.09",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 1,
      title: "기억 통제로 인간은 더 행복해질까?",
      question:
        "좋든 기억이든 나쁜 기억이든 다 내 일부니까, 고통도 성장의 근원이 될 수 있지 않을까?",
      participant: 8,
      date: "25.10.09",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "기억 통제로 인간은 더 행복해질까? 아니면 오히려 이것이 불행의 시작이 될까?",
      question:
        "좋든 기억이든 나쁜 기억이든 다 내 일부니까, 고통도 성장의 근원이 될 수 있지 않을까?",
      participant: 5,
      date: "25.10.09",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
  ],
};

export default function ChatListPage() {
  const [tab, setTab] = useState("prepare");
  const navigate = useNavigate();

  const renderList = () => {
    const list = API_RESPONSES[tab];
    return (
      <div className="flex flex-col">
        {list.map((item) => (
          <button
            onClick={()=>navigate("/chat")}
            className="text-left"
          >
            <div
              key={item.id}
              className="flex items-center h-[5.75rem] bg-white pl-[1.25rem] pr-[1.25rem] pt-[0.75rem] pb-[0.75rem] gap-[0.625rem]"
            >

              <img
                src={item.image}
                alt=""
                className="w-[3.1875rem] h-[4.25rem] rounded-[0.5rem] object-cover border-none"
              />

              <div className="flex flex-col flex-1 gap-[0.1875rem]">
                <p 
                  className={`
                    text-[0.625rem]
                    ${tab === "prepare" ? "text-[#007AFF]" : ""}
                    ${tab === "participate" ? "text-[#7DCA01]" : ""}
                    ${tab === "past" ? "text-[#B5BBC1]" : ""}
                  `}
                >
                  콘텐츠명
                </p>
                
                <div className="flex items-center gap-[0.5rem]">

                  <span className="text-[0.875rem] text-[#3B3D40] line-clamp-1">
                    {item.title}
                  </span>

                  {tab === "past" && (
                    <span className="text-[#CCD2D8] text-[0.875rem] font-normal">
                      {item.participant}
                    </span>
                  )}

                  {tab === "past" && (
                    <div className="ml-auto">
                      <span className="text-[0.75rem] text-[#B5BBC1]">{item.date}</span>
                    </div>
                  )}
                </div>
              

                {tab == "prepare" && (
                  <p className="text-[0.75rem] text-[#B5BBC1]">
                    준비 완료 {item.currentParticipant}/{item.maxParticipant}명 · 모두 준비되면 시작돼요
                  </p>
                )}

                {tab == "participate" && (
                  <p className="text-[0.75rem] text-[#B5BBC1]">
                    참여 중 {item.currentParticipant}/{item.maxParticipant}명 · 다 모이면 시작돼요
                  </p>
                )}

                {tab === "past" && (
                  <p className="text-[0.75rem] text-[#B5BBC1] line-clamp-1">
                    {item.question}
                  </p>
                )}
              </div>

              {tab !== "past" && item.status === "pending" && (
                <div>
                <button className="flex justify-center items-center h-[2.125rem] bg-[#CCD2D8] rounded-[0.5rem] pl-[0.75rem] pr-[0.75rem] pt-[0.125rem] pb-[0.125rem]">
                  <span className="text-white text-[0.75rem]">
                    취소
                  </span>
                </button>
                </div>
              )}

              {tab === "prepare" && item.status === "ready" && (
                <div>
                <button className="flex justify-center items-center h-[2.125rem] bg-[#FA502E] rounded-[0.5rem] pl-[0.75rem] pr-[0.75rem] pt-[0.125rem] pb-[0.125rem]">
                  <span className="text-white text-[0.75rem]">
                    준비
                  </span>
                </button>
                </div>
              )}

              {tab === "participate" && item.status === "ready" && (
                <div>
                <button className="flex justify-center items-center h-[2.125rem] bg-[#FA502E] rounded-[0.5rem] pl-[0.75rem] pr-[0.75rem] pt-[0.125rem] pb-[0.125rem]">
                  <span className="text-white text-[0.75rem]">
                    참여
                  </span>
                </button>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
  
  <div className="h-screen overflow-y-auto">
    
    <ChatListTopBar title="대화" />

      {/* 선택 창 */}
      <div className="flex justify-start pl-[1.5rem] pr-[1.5rem] pt-[1rem] pb-[1rem] gap-[2.25rem]">

        <div className={`pb-[0.75rem] border-b-2 ${tab === "prepare" ? "border-[#FA502E]" : "border-transparent"}`}>
          <button
            onClick={() => setTab("prepare")}
            className={`${tab === "prepare" ? "text-black" : "text-gray-400"}`}
          >
            <span className={`${tab === "prepare" ? "font-bold" : "font-normal"}`}>
              대화 준비
            </span>
          </button>
        </div>
        <div className={`pb-[0.75rem] border-b-2 ${tab === "participate" ? "border-[#FA502E]" : "border-transparent"}`}>
          <button
            onClick={() => setTab("participate")}
            className={`${tab === "participate" ? "text-black" : "text-gray-400"}`}
          >
            <span className={`${tab === "participate" ? "font-bold" : "font-normal"}`}>
              참여 질문
            </span>
          </button>
        </div>
        <div className={`pb-[0.75rem] border-b-2 ${tab === "past" ? "border-[#FA502E]" : "border-transparent"}`}>
          <button
            onClick={() => setTab("past")}
            className={`${tab === "past" ? "text-black" : "text-gray-400"}`}
          >
            <span className={`${tab === "past" ? "font-bold" : "font-normal"}`}>
              지난 대화
            </span>
          </button>
        </div>
      </div>

      {/* 대화 목록 */}
      {renderList()}

      <BottomNav/>
    </div>
  );
}
