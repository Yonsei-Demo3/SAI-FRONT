import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatList } from "../../lib/chatService";
import BottomNav from "../../components/main/BottomNav";
import ChatListTopBar from "../../components/chat/ChatListTopBar";
import { readyChat, quitChat } from "../../lib/chatService";
import { participateQuestion } from "../../lib/questionService";

const API_RESPONSES = {
  ready: [
    {
      id: 0,
      title: "기억 통제로 인간은 더 행복해질까?",
      participant: 3,
      maxParticipant: 4,
      status: "participate",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 1,
      title: "기억 통제로 인간은 더 행복해질까?",
      participant: 2,
      maxParticipant: 4,
      status: "cancelled",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    }
  ],

  participate: [
    {
      id: 0,
      title: "기억 통제로 인간은 더 행복해질까?",
      participant: 2,
      maxParticipant: 4,
      status: "participate",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 1,
      title: "기억 통제로 인간은 더 행복해질까?",
      participant: 3,
      maxParticipant: 4,
      status: "cancelled",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "기억 통제로 인간은 더 행복해질까?",
      participant: 4,
      maxParticipant: 4,
      status: "participate",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
    },
  ],

  finish: [
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
  
  // const [chatLists, setChatLists] = useState({
  //   ready: API_RESPONSES.ready,   
  //   participate: [],                  
  //   finish: API_RESPONSES.finish,    
  // });
  const [tab, setTab] = useState("ready");
  const [chatLists, setChatLists] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    let isMounted = true;

    async function fetchData() {

      setLoading(true);
      setError(null);

      try {
        
        const response = await getChatList(tab);
        
        const mapped  = response.data.map((q) => ({
          questionId: q.questionId,
          roomId: q.roomId,                 
          title: q.questionTitle,           
          participant: q.currentParticipant || 2,
          maxParticipant: q.maxParticipant || 4, 
          date: q.createdAt || "02.07" ,
          status:
            tab === "ready"
              ? "unready" 
              : q.status || "participate", 
          image:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop",
        }));
        
        console.log("대화 목록 불러오기 성공:", mapped);

        if (!isMounted) return;

        setChatLists(mapped);

      } catch (e) {
        if (isMounted) {
          setError(e.response?.data?.message || e.message);
          setChatLists([]);
        } 
        console.error("대화 목록 불러오기 실패:", e);

      } finally {
        if (isMounted) setLoading(false);
      }

    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tab]);

  const handleReadyCancelClick = async (tab, item) => {
    try {
      
      await quitChat(item.questionId);
      
      if(tab === "ready") {
        setChatLists((prevLists) =>
          prevLists.filter((prevItem) => prevItem.questionId !== item.questionId)
        );
      } else {
        item.status = "cancelled";
        setChatLists((prevLists) =>
          prevLists.map((prevItem) =>
            prevItem.questionId === item.questionId ? item : prevItem
          )
        );
      }

    } catch (error) {
      console.error("대화 취소 실패:", error);
    }
  };

  const handleParticipateClick = async (tab, item) => {
    try {
      
      await participateQuestion(item.questionId); 
      item.status = "participate";
      setChatLists((prevLists) =>
        prevLists.map((prevItem) =>
          prevItem.questionId === item.questionId ? item : prevItem
        )
      );
    } catch (error) {
      console.error("대화 참여 실패:", error);
    }
  };

  const handleReadyClick = async (tab, item) => {
    try {
      
      await readyChat(item.questionId);   

    } catch (error) {
      console.error("대화 준비 실패:", error);
    }

    navigate("/chat", {
      state: { 
        questionId: item.questionId,  
        roomId: item.roomId
      }
    })

  };

  const renderList = () => {

    if (loading) {
      return (
        <div className="px-[1.5rem] py-4 text-sm text-gray-500">
          대화 목록 불러오는 중...
        </div>
      );
    }

    if (error) {
      return (
        <div className="px-[1.5rem] py-4 text-sm text-red-500">
          대화 목록 불러오기 실패
        </div>
      );
    }

    if (chatLists.length === 0) {
      return (
        <div className="pt-[2rem] pb-[2rem] flex justify-center items-center">
          <span className="text-[0.875rem] text-gray-400">
            표시할 대화가 없습니다
          </span>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col">

        {chatLists.map((item) => {

          const isReadyTab = tab === "ready";
          const isUnready = item.status === "unready";
          const isReady = item.status === "ready";

          const isParticipateTab = tab === "participate";
          const isParticipating = item.status === "participate";

          const isFinishedTab = tab === "finish";

          const showActionButton = !isFinishedTab;

          let buttonLabel = "";
          let buttonStyle = "";
          let handleActionClick = async () => {};

          return (
            <div
              key={item.questionId}  
              className="text-left"
            >
            <div
              className="flex items-center h-[5.75rem] bg-white pl-[1.25rem] pr-[1.25rem] pt-[0.75rem] pb-[0.75rem] gap-[0.625rem]"
            >

              <img
                src={item.image}
                className="w-[3.1875rem] h-[4.25rem] rounded-[0.5rem] object-cover border-none"
              />

              <div className="flex flex-col flex-1 gap-[0.1875rem]">
                <p 
                  className={`
                    text-[0.625rem]
                    ${tab === "ready" ? "text-[#007AFF]" : ""}
                    ${tab === "participate" ? "text-[#7DCA01]" : ""}
                    ${tab === "finish" ? "text-[#B5BBC1]" : ""}
                  `}
                >
                  콘텐츠명
                </p>
                
                <div className="flex items-center gap-[0.5rem]">

                  <span className="text-[0.875rem] text-[#3B3D40] line-clamp-1">
                    {item.title}
                  </span>

                  {tab === "finish" && (
                    <span className="text-[#CCD2D8] text-[0.875rem] font-normal">
                      {item.participant}
                    </span>
                  )}

                  {tab === "finish" && (
                    <div className="ml-auto">
                      <span className="text-[0.75rem] text-[#B5BBC1]">{item.date}</span>
                    </div>
                  )}
                </div>
              

                {tab == "ready" && (
                  <p className="text-[0.75rem] text-[#B5BBC1]">
                    준비 완료 {item.participant}/{item.maxParticipant}명 · 모두 준비되면 시작돼요
                  </p>
                )}

                {tab == "participate" && (
                  <p className="text-[0.75rem] text-[#B5BBC1]">
                    참여 중 {item.participant}/{item.maxParticipant}명 · 다 모이면 시작돼요
                  </p>
                )}

                {tab === "finish" && (
                  <p className="text-[0.75rem] text-[#B5BBC1] line-clamp-1">
                    {item.question}
                  </p>
                )}
              </div>

              {/* 대화 준비에서 버튼 */}
              {tab === "ready" && item.status === "ready" && (
                <div>
                <button className="flex justify-center items-center h-[2.125rem] bg-[#CCD2D8] rounded-[0.5rem] pl-[0.75rem] pr-[0.75rem] pt-[0.125rem] pb-[0.125rem]">
                  <span className="text-white text-[0.75rem]">
                    취소
                  </span>
                </button>
                </div>
              )}

              {tab === "ready" && item.status === "unready" && (
                <div>
                <button 
                  className="flex justify-center items-center h-[2.125rem] bg-[#FA502E] rounded-[0.5rem] pl-[0.75rem] pr-[0.75rem] pt-[0.125rem] pb-[0.125rem]"
                  onClick={()=>navigate("/chat", {
                        state: { 
                          questionId: item.questionId,
                          roomId: item.roomId 
                        }
                  })}    
                >
                  
                  <span className="text-white text-[0.75rem]">
                    준비
                  </span>
                </button>
                </div>
              )}

              {/* 신청 질문에서 버튼 */}
              {tab === "participate" && item.status === "participate" && (
                <div>
                <button className="flex justify-center items-center h-[2.125rem] bg-[#CCD2D8] rounded-[0.5rem] pl-[0.75rem] pr-[0.75rem] pt-[0.125rem] pb-[0.125rem]">
                  <span className="text-white text-[0.75rem]">
                    취소
                  </span>
                </button>
                </div>
              )}

              {tab === "participate" && item.status === "cancelled" && (
                <div>
                <button 
                  className="flex justify-center items-center h-[2.125rem] bg-[#FA502E] rounded-[0.5rem] pl-[0.75rem] pr-[0.75rem] pt-[0.125rem] pb-[0.125rem]"
                  onClick={()=>navigate("/chat", {
                        state: { 
                          questionId: item.questionId,
                          roomId: item.roomId 
                        }
                  })}     
                >
                  <span className="text-white text-[0.75rem]">
                    참여
                  </span>
                </button>
                </div>
              )}
            </div>
          </div>
          )

          
          
        })}
      </div>
    );
  };

  return (
  
  <div className="h-screen overflow-y-auto">
    
    <ChatListTopBar title="대화" />

      {/* 선택 창 */}
      <div className="flex justify-start pl-[1.5rem] pr-[1.5rem] pt-[1rem] pb-[1rem] gap-[2.25rem]">

        <div className={`pb-[0.75rem] border-b-2 ${tab === "ready" ? "border-[#FA502E]" : "border-transparent"}`}>
          <button
            onClick={() => setTab("ready")}
            className={`${tab === "ready" ? "text-black" : "text-gray-400"}`}
          >
            <span className={`${tab === "ready" ? "font-bold" : "font-normal"}`}>
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
              신청 질문
            </span>
          </button>
        </div>
        <div className={`pb-[0.75rem] border-b-2 ${tab === "finish" ? "border-[#FA502E]" : "border-transparent"}`}>
          <button
            onClick={() => setTab("finish")}
            className={`${tab === "finish" ? "text-black" : "text-gray-400"}`}
          >
            <span className={`${tab === "finish" ? "font-bold" : "font-normal"}`}>
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
