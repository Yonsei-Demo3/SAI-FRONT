import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import TopBar from "../components/chat/TopBar";
import ChatBubble from "../components/chat/ChatBubble";
import ChatInput from "../components/chat/ChatInput";
import QuestionStrip from "../components/chat/QuestionStrip";

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


function ChatWindow() {
  const [messages, setMessages] = useState(apiResponse.seed);
  const [side, setSide] = useState("right");
  const scrollRef = useRef(null);
  const didMountRef = useRef(false);
  // 상태 추적용 ref: 오버플로우 발생 여부, 사용자가 하단 근처인지 여부
  const hasOverflowedRef = useRef(false);
  const stickToBottomRef = useRef(false);

  // 하단 근처 판정 유틸
  const isNearBottom = (el) => {
    const threshold = 24; // px 여유
    return el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
  };

  // 최초 마운트 시 현재 상태 측정
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    hasOverflowedRef.current = el.scrollHeight > el.clientHeight + 1;
    stickToBottomRef.current = isNearBottom(el);
  }, []);

  // 스크롤 핸들러: 사용자 위치 추적
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = isNearBottom(el);
    hasOverflowedRef.current = el.scrollHeight > el.clientHeight + 1;
  };

  // 메시지 추가 시 동작 규칙
  // - 아직 오버플로우가 아니면(화면을 다 채우지 않으면) 스크롤하지 않음: 상단부터 차곡차곡
  // - 처음으로 오버플로우가 발생하는 순간엔 하단으로 한 번 이동하여 최신이 아래에 보이게
  // - 이후에는 사용자가 하단 근처일 때만 하단 고정(스무스), 위로 올려 본 상태면 스크롤 유지
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // 치명적인 경계값 문제 방지: 거의 동일한 높이 차이는 오버플로우로 보지 않음
    const delta = el.scrollHeight  - el.clientHeight;
    const overflowNow = delta > 8; // 8px 이하 차이는 비오버플로우로 간주

    if (overflowNow && stickToBottomRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: didMountRef.current ? 'smooth' : 'auto' });
    } else if (!overflowNow) {
      // 아직 화면을 다 채우지 못했다면 항상 최상단에 고정
      el.scrollTop = 0;
    }

    hasOverflowedRef.current = overflowNow;
    didMountRef.current = true;
  }, [messages.length]);

  const toggleBookmark = (id) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, bookmarked: !m.bookmarked } : m)));
  };

  const handleSend = (text, s) => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), text, side: s, time: nowKo() },
    ]);
  };

  return (

    // 1) 바깥을 화면 높이에 맞춰 고정 + 바깥 스크롤 막기
    <div className="h-screen w-full bg-white grid grid-rows-[auto,1fr,auto]">
      
      {/* 3) sticky는 선택. 제거해도 가운데만 스크롤됩니다 */}
      <header className="bg-white">
        <TopBar startAt={apiResponse.startAt} endAt={apiResponse.endAt} onExpire={() => console.log("타이머 종료")} />
        <QuestionStrip title={apiResponse.title} />
      </header>

      {/* 2) 가운데 행(parent)에 min-h-0 필수 */}
     <main className="w-full px-3 min-h-0 lg:max-w-[760px] lg:mx-auto ">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto pt-4 pb-0 overscroll-contain flex flex-col items-stretch"
        >
          <div className="flex w-full max-w-[680px] flex-col justify-start items-stretch gap-5 lg:mx-auto">
            {messages.map((m) => (
              <ChatBubble key={m.id} msg={m} onToggleBookmark={toggleBookmark} />
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <ChatInput onSend={handleSend} side={side} />
      </footer>
    </div>
  );
}

export default function ChatPage() {
  return <ChatWindow />;
}
