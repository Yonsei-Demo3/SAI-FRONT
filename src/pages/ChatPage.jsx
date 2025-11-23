import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatTopBar from "../components/chat/ChatTopBar";
import ChatBubble from "../components/chat/ChatBubble";
import ChatInput from "../components/chat/ChatInput";
import { createSocket } from "../lib/socket";

// Helpers
const uid = () => Math.random().toString(36).slice(2, 10);
const nowKo = () =>
  new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

// // apiResponse 예시
const apiResponse = {
    
    title : "기억 통제로 인간은 더 행복해질까? 어쩌면 더 불행해질지도 몰라",
    startAt : Date.now(),
    endAt : new Date('2025-11-29 10:00:00'),
    seed : [
         {
            id: uid(),
            name: "임의의 닉네임",
            text: "기억을 지울 수 있다면 정말 행복한 일일까요?",
            time: "오후 7:51",
            side: "left",
            avatarBg: "bg-neutral-400",
        },
        {
            id: uid(),
            name: "멋있는 사자",
            text:
            "솔직히 말도 안 된다고 생각해요. 아픈 기억도 결국 제 일부잖아요. 그걸 없애면 제가 아닌 것 같을 것 같아요.",
            time: "오후 7:51",
            side: "left",
            avatarBg: "bg-orange-400",
            bookmarked: true,
        },
        {
            id: uid(),
            text:
            "솔직히 말도 안 된다고 생각해요. 아픈 기억도 결국 제 일부잖아요. 그걸 없애면 제가 아닌 것 같을 것 같아요.",
            time: "오후 7:51",
            side: "right",
        },
        {
            id: uid(),
            name: "멋있는 사자",
            text: "맞아요. 힘든 기억도 결국 우리가 살아가는 이유 중 하나죠.",
            time: "오후 7:51",
            side: "left",
            avatarBg: "bg-orange-400",
        },
        {
            id: uid(),
            name: "멋있는 사자",
            text: "이런것들이 모여서 우리는 앞으로 점점 더 나아질거에요.",
            time: "오후 7:52",
            side: "left",
            avatarBg: "bg-orange-400",
        },
    {
            id: uid(),
            text:
            "맞아요. 이렇게 대화하니 좋네요.",
            time: "오후 7:53",
            side: "right",
        },
    ]
}


export default function ChatPage() {


  const socketRef = useRef(null);
  
  const [messages, setMessages] = useState(apiResponse.seed);
  const [side, setSide] = useState("right");
  const scrollRef = useRef(null);
  const didMountRef = useRef(false);
  // 상태 추적용 ref: 오버플로우 발생 여부, 사용자가 하단 근처인지 여부
  const hasOverflowedRef = useRef(false);
  const stickToBottomRef = useRef(false);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]); // 검색된 메시지 id 리스트
  const [searchIndex, setSearchIndex] = useState(0); // 현재 선택된 검색 결과 index

  const [previewImage, setPreviewImage] = useState(null);

  // 하단 근처 판정 유틸
  const isNearBottom = (el) => {
    const threshold = 24; // px 여유
    return el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
  };

  // 스크롤 핸들러: 사용자 위치 추적
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = isNearBottom(el);
    hasOverflowedRef.current = el.scrollHeight > el.clientHeight + 1;
  };

  useEffect(() => {
    const socket = createSocket();      // 소켓 생성
    socketRef.current = socket;         // ref에 보관

    socket.on("connect", () => {
      console.log("✅ connected", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ disconnected", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("🚨 connect_error:", err.message, err);
    });

    // cleanup: 컴포넌트가 언마운트될 때 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);

  // 메시지 추가 시 동작 규칙 및 화면 제어 로직
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (!didMountRef.current) {
      el.scrollTop = el.scrollHeight;        
      hasOverflowedRef.current = el.scrollHeight > el.clientHeight + 1;
      stickToBottomRef.current = true;       
      didMountRef.current = true;
      return;
    }

    const delta = el.scrollHeight - el.clientHeight;
    const overflowNow = delta > 8; 

    if (overflowNow && stickToBottomRef.current) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    } else if (!overflowNow) {
      el.scrollTop = 0;
    }

    hasOverflowedRef.current = overflowNow;
  }, [messages.length]);

  const toggleBookmark = (id) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, bookmarked: !m.bookmarked } : m)));
  };


  const handleSend = (content, s, type) => {
    if (type === "image") {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          images: content,       // 이미지 배열
          type: "image",
          side: s,
          time: nowKo(),
        },
      ]);
    } else if (type === "file") {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          files: content,       // File[] 또는 파일 정보 배열
          type: "file",
          side: s,
          time: nowKo(),
        },
      ]);
    } else {
            setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          text: content,        // 텍스트 메시지
          type: "text",
          side: s,
          time: nowKo(),
        },
      ]);
    }
  };

  // 이미지 클릭 → 모달 열기
  const handleImageClick = (src) => {
    setPreviewImage(src);
  };

  // 모달 닫기
  const closeImageModal = () => {
    setPreviewImage(null);
  };

  // 파일 클릭 → 다운로드
  const handleFileClick = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (

    <div className="flex flex-col h-screen w-full bg-white">
      
      <header className="bg-white">
        <ChatTopBar 
          startAt={apiResponse.startAt} 
          endAt={apiResponse.endAt} 
          onExpire={() => console.log("타이머 종료")} 
          onSearchChange={setSearchText}
          title={apiResponse.title}
        />
      </header>


    <main className="flex-1 min-h-0 w-full flex flex-col pt-[3.5625rem]">


        <div className="flex-1 min-h-0 overflow-y-auto">
          
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto flex flex-col items-stretch"
          >
            <div className="flex justify-center items-center pl-[1.5rem] pr-[1.5rem] pb-[0.5rem]">
              <div className="w-full flex justify-center items-center bg-[#F2F4F8] pt-[0.63rem] pb-[0.63rem] pl-[0.5rem] pr-[0.5rem]">
                <span className="text-[0.75rem] text-[#191D1F]">
                  {apiResponse.title}
                </span>
              </div>
            </div>

            <div className="flex justify-center items-center pt-[0.1rem] pb-[1rem]">
              <span className="text-[#3B3D40] text-[0.625rem] text-center">
                질문에 대한 대화가 시작되었습니다.<br></br>
                지금부터 42분 동안 집중해서 대화를 나눠보세요.
              </span>
            </div>
            
            <div className="flex w-full flex-col justify-start items-stretch">
              {messages.map((m) => (
                <ChatBubble key={m.id} msg={m} onToggleBookmark={toggleBookmark} onImageClick={handleImageClick} onFileClick={handleFileClick} highlightWord={searchText} />
              ))}
            </div>
          </div>
        </div>

      </main>

       {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={closeImageModal}
        >
          <div
            className="max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} 
          >
            <img
              src={previewImage}
              alt="preview"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}

      <footer className="bg-white justify-center items-center">
        <ChatInput onSend={handleSend} side={side} />
      </footer>
    </div>
  );
}
