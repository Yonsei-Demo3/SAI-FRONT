import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatTopBar from "../../components/chat/ChatTopBar";
import ChatBubble from "../../components/chat/ChatBubble";
import ChatInput from "../../components/chat/ChatInput";
import { getSocket, sendMessageSocket, joinSocket  } from "../../lib/socket";
import { getTimeChat, getFinishChat, scrapMessage, unscrapMessage } from "../../lib/chatService";

const SAI_TIME_LIMIT = 42 * 60 * 1000; // 42분 in milliseconds

// Helpers
const uid = () => Math.random().toString(36).slice(2, 10);
const nowKo = () =>
  new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

const serverTimeToUtcMs = (serverDateTimeStr) => {
  const isoUtc = serverDateTimeStr.replace(" ", "T") + "Z";
  const utcDate = new Date(isoUtc);
  return utcDate.getTime(); 
};


export default function ChatPage() {

  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  {/* active : 활성화된 채팅, finished : 종료된 채팅  */}
  const status = location.state?.status || "finished"; 
  const roomId = location.state?.roomId;   
  const questionId = location.state?.questionId;
  const questionTitle = location.state?.questionTitle || "";
  
  const [messages, setMessages] = useState([]);


  const [side, setSide] = useState("right");
  
  
  const scrollRef = useRef(null);
  const didMountRef = useRef(false);
  // 상태 추적용 ref: 오버플로우 발생 여부, 사용자가 하단 근처인지 여부
  const hasOverflowedRef = useRef(false);
  const stickToBottomRef = useRef(false);

  const [searchText, setSearchText] = useState("");

  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [isTimeLoading, setIsTimeLoading] = useState(false);

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


  // 메시지 추가 시 동작 규칙 및 화면 제어 로직
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    console.log("questionId:", questionId);
    console.log("roomId:", roomId);

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


  const toggleBookmark = async (messageId) => {

    const target = messages.find((m) => m.messageId === messageId);
    if (!target) return;

    const wasBookmarked = !!target.bookmarked;

    // UI 먼저 업데이트
    setMessages((prev) =>
      prev.map((m) =>
        m.messageId === messageId
          ? { ...m, bookmarked: !wasBookmarked }   
          : m
      )
    );

    try {

      if (wasBookmarked) {
        await unscrapMessage(messageId);
      } else {
        await scrapMessage(messageId);
      }
    } catch (err) {
      console.error("스크랩 요청 실패:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === messageId
            ? { ...m, bookmarked: wasBookmarked }
            : m
        )
      );
    }
  };

  useEffect(() => {

    if (!questionId) return; // questionId 없으면 요청 안 보냄

    const fetchTime = async () => {
      try {
        setIsTimeLoading(true);

        const res = await getTimeChat(questionId);

        const { updatedAt } = res.data;
        const start = serverTimeToUtcMs(updatedAt);
        const end = start + SAI_TIME_LIMIT;
        
        setStartAt(start);
        setEndAt(end);

      } catch (err) {
        console.error("시간 정보 가져오기 실패:", err);
      } finally {
        setIsTimeLoading(false);
      }
    };

    fetchTime();
  }, [questionId]);

  useEffect(() => {
    if(status !== "finished") return;

    const fetchMessage = async () => {
      try {

        const response = await getFinishChat(roomId);

        const formattedMessages = response.data.map((msg) => ({

          messageId: msg.messageId,
          content: msg.content,
          senderId: msg.senderId,
          senderNickname: msg.senderNickname,
          isMine: msg.isMine,

          // 더미 값
          type: "text",          
          time: msg.time || "오후 4:20",
          images: msg.images ?? [],
          files: msg.files ?? [],
          bookmarked: false,
          imageColor: "bg-orange-400", 
        }));

        setMessages(formattedMessages || []);

      } catch (err) {
        console.error("채팅 가져오기 실패:", err);
      } finally {
        setIsTimeLoading(false);
      }
    };

    fetchMessage();
  
  }, [questionId, status]);

  useEffect(() => {

    const socket = getSocket();    
    socketRef.current = socket;     

    // 채팅방 참여
    if (roomId) {
      joinSocket({ roomId });
      console.log("[socket] join room:", roomId);
    } else {
      console.warn("[socket] roomId가 없어 채팅방 참여가 불가능합니다.");
    }


    const handleChatMessage = (data) => {
      
      console.log("Received chat message:", data);
      const { from, message, room } = data;

      const newMsg = {
        // messageId: ,                
        name: from,
        text: message,
        time: nowKo(),
        side: "left",             
        room,
      };

      setMessages((prev) => [...prev, newMsg]);
    };
    
    socket.on("chat message", handleChatMessage);

  }, []);

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

        const newMsg = {
          id: uid(),
          content: content,
          type: "text",
          isMine: true,
          time: nowKo(),
        };
        
        setMessages((prev) => [...prev, newMsg]);

        // // 소켓으로 메시지 전송
        // if (socketRef.current) {
        //   socketRef.current.emit("chat message", {
        //     "roomId" : 1,                 
        //     "message" : content,
        //   });
        // }
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
          startAt={startAt} 
          endAt={endAt} 
          onExpire={() => console.log("타이머 종료")} 
          onSearchChange={setSearchText}
          title={questionTitle}
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
                  {questionTitle}
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
                <ChatBubble key={m.messageId} msg={m} onToggleBookmark={toggleBookmark} onImageClick={handleImageClick} onFileClick={handleFileClick} />
              ))}
              {status === "finished" && (
                <>
                  <div className="w-full h-[4rem] bg-white pb-[0.5rem] mb-[1rem] pt-[0.5rem] flex items-center justify-center">
                    <span className="text-center text-[0.625rem] text-[#3B3D40]">
                      대화가 종료되었습니다.<br/>
                      더 나누고 싶은 이야기가 있다면 댓글로 의견을 남기거나,<br/>
                      새로운 질문을 등록해보세요.
                    </span>
                  </div>
                  <div>
                    <button 
                      className="gap-[0.25rem] bg-[#3B3D40] pt-[0.625rem] pb-[0.625rem] pl-[1rem] pr-[1rem] rounded-[0.5rem] flex items-center justify-center mx-auto mb-[2.25rem]"
                      onClick={() => {navigate("/question");}}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                          <path d="M12 0C2 0 0.666667 9.1 0 13H1.332C1.776 10.8333 2.88756 9.64167 4.66667 9.425C7.33333 9.1 9.33333 6.825 10 4.875L9 4.225L9.66667 3.575C10.3333 2.925 11.0027 1.95 12 0Z" fill="white"/>
                        </svg>
                        <span className="text-white text-[0.75rem]">
                          새로 질문하기
                        </span>
                    </button>
                  </div>
                </>
              )}
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
        <ChatInput onSend={handleSend} side={side} status={status} />
      </footer>
    </div>
  );
}
