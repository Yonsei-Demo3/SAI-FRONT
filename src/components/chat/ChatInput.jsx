import React, { useState } from "react";

export default function ChatInput({ onSend, side = "right" }) {
  const [text, setText] = useState("");

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t, side);
    setText("");
  };

  return (
    <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
       
        <div className="flex items-center border-none border-none pt-[1rem] pl-[1.5rem] pr-[1.5rem] shadow-[0_-3px_4px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            aria-label="추가"
            className="bg-[#FFFFFF] border-none outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15 7H9V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0C7.73478 0 7.48043 0.105357 7.29289 0.292893C7.10536 0.48043 7 0.734784 7 1V7H1C0.734784 7 0.48043 7.10536 0.292893 7.29289C0.105357 7.48043 0 7.73478 0 8C0 8.26522 0.105357 8.51957 0.292893 8.70711C0.48043 8.89464 0.734784 9 1 9H7V15C7 15.2652 7.10536 15.5196 7.29289 15.7071C7.48043 15.8946 7.73478 16 8 16C8.26522 16 8.51957 15.8946 8.70711 15.7071C8.89464 15.5196 9 15.2652 9 15V9H15C15.2652 9 15.5196 8.89464 15.7071 8.70711C15.8946 8.51957 16 8.26522 16 8C16 7.73478 15.8946 7.48043 15.7071 7.29289C15.5196 7.10536 15.2652 7 15 7Z" fill="#B5BBC1"/>
              <path d="M15 7H9V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0C7.73478 0 7.48043 0.105357 7.29289 0.292893C7.10536 0.48043 7 0.734784 7 1V7H1C0.734784 7 0.48043 7.10536 0.292893 7.29289C0.105357 7.48043 0 7.73478 0 8C0 8.26522 0.105357 8.51957 0.292893 8.70711C0.48043 8.89464 0.734784 9 1 9H7V15C7 15.2652 7.10536 15.5196 7.29289 15.7071C7.48043 15.8946 7.73478 16 8 16C8.26522 16 8.51957 15.8946 8.70711 15.7071C8.89464 15.5196 9 15.2652 9 15V9H15C15.2652 9 15.5196 8.89464 15.7071 8.70711C15.8946 8.51957 16 8.26522 16 8C16 7.73478 15.8946 7.48043 15.7071 7.29289C15.5196 7.10536 15.2652 7 15 7Z" fill="black" fillOpacity="0.2"/>
            </svg>
          </button>

          <div className="flex-1">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), submit())}
              placeholder="메시지 전송"
              className="w-full pl-[1rem] border-none bg-[#FFFFFF] px-4 py-3 text-[15px] outline-none placeholder:text-[#B5BBC1] text-[#191D1F]"
            />
          </div>

          <button
            type="button"
            onClick={submit}
            aria-label="전송"
            className="rounded-full bg-[#FFFFFF] text-white border-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5"
            >
              <path
                d="M4.4 19.425C4.06667 19.5583 3.75 19.529 3.45 19.337C3.15 19.145 3 18.866 3 18.5V14L11 12L3 10V5.50001C3 5.13335 3.15 4.85435 3.45 4.66301C3.75 4.47168 4.06667 4.44235 4.4 4.57501L19.8 11.075C20.2167 11.2583 20.425 11.5667 20.425 12C20.425 12.4333 20.2167 12.7417 19.8 12.925L4.4 19.425Z"
                fill="#B5BBC1"
              />
              <path
                d="M4.4 19.425C4.06667 19.5583 3.75 19.529 3.45 19.337C3.15 19.145 3 18.866 3 18.5V14L11 12L3 10V5.50001C3 5.13335 3.15 4.85435 3.45 4.66301C3.75 4.47168 4.06667 4.44235 4.4 4.57501L19.8 11.075C20.2167 11.2583 20.425 11.5667 20.425 12C20.425 12.4333 20.2167 12.7417 19.8 12.925L4.4 19.425Z"
                fill="black"
                fillOpacity="0.2"
              />
            </svg>
          </button>
        </div>
    </div>
  );
}
