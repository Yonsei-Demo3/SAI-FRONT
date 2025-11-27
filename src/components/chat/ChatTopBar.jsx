import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TimerBanner from "./TimerBanner";
import QuestionStrip from "./QuestionStrip";
import ChatDrawer from "./ChatDrawer";

export default function TopBar({ startAt, endAt, onExpire, title, roomId, status, questionId}) {
  
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false); 
  const [searchText, setSearchText] = useState(""); 
  const inputRef = useRef(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const handleBackClick = () => {
    setIsExitModalOpen(true);
  };

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    navigate("/main");
  };

  const handleCancelExit = () => {
    setIsExitModalOpen(false);
  };


  return (
    <div className="fixed-0">
      <div className="w-full flex items-center justify-between pl-[1.5rem] pr-[1.5rem] pb-[1.25rem] pt-[1.25rem]">

        <button aria-label="뒤로가기" className="border-none outline-none" 
          onClick={status === "active" ? handleBackClick : () => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.15017 8.8295L7.75 15.4293L9.39967 13.7797L3.62467 8.00467L9.39967 2.22967L7.75 0.58L1.15017 7.17983C0.931451 7.39862 0.808583 7.69531 0.808583 8.00467C0.808583 8.31402 0.931451 8.61072 1.15017 8.8295Z" fill="#191D1F"/>
          </svg>
        </button>
        
        {/* {searchOpen && (
          <div className="pl-[1.25rem] pr-[1rem] w-full">
            <input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                props.onSearchChange(e.target.value);
              }}              
              className="w-full rounded-[0.375rem] bg-[#F2F4F8] border-none outline-none text-[0.8rem] pt-[0.1rem] pb-[0.1rem] pl-[0.75rem] pr-[0.75rem]"
            />
          </div>
        )} */}
        
        <div className="flex items-center gap-1">
          {/* <button aria-label="검색" className="rounded-full pr-[0.75rem] border-none outline-none bg-white" onClick={() => setSearchOpen((prev) => !prev)} >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L20.3 18.9C20.4833 19.0833 20.575 19.3167 20.575 19.6C20.575 19.8833 20.4833 20.1167 20.3 20.3C20.1167 20.4833 19.8833 20.575 19.6 20.575C19.3167 20.575 19.0833 20.4833 18.9 20.3L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z" fill="#191D1F"/>
            </svg>
          </button> */}
          <button aria-label="메뉴" className="rounded-full border-none outline-none bg-white" onClick={()=> setIsGuideOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 7H21C21.2652 7 21.5196 6.89464 21.7071 6.70711C21.8946 6.51957 22 6.26522 22 6C22 5.73478 21.8946 5.48043 21.7071 5.29289C21.5196 5.10536 21.2652 5 21 5H3C2.73478 5 2.48043 5.10536 2.29289 5.29289C2.10536 5.48043 2 5.73478 2 6C2 6.26522 2.10536 6.51957 2.29289 6.70711C2.48043 6.89464 2.73478 7 3 7ZM21 11H3C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8946 2.73478 13 3 13H21C21.2652 13 21.5196 12.8946 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11ZM21 17H3C2.73478 17 2.48043 17.1054 2.29289 17.2929C2.10536 17.4804 2 17.7348 2 18C2 18.2652 2.10536 18.5196 2.29289 18.7071C2.48043 18.8946 2.73478 19 3 19H21C21.2652 19 21.5196 18.8946 21.7071 18.7071C21.8946 18.5196 22 18.2652 22 18C22 17.7348 21.8946 17.4804 21.7071 17.2929C21.5196 17.1054 21.2652 17 21 17Z" fill="#191D1F"/>
            </svg>
          </button>
        </div>
      </div>
      {startAt && endAt && (
        <TimerBanner startAt={startAt} endAt={endAt} onExpire={onExpire} />
     )}
      <QuestionStrip title={title} />

      <ChatDrawer
        open={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title={title}
        roomId={roomId}
        questionId={questionId}
      />

        {status === "active" && isExitModalOpen && (
        <div
          className="fixed inset-0 z-[650] flex justify-center"
          onClick={handleCancelExit} // 바깥 클릭 시 닫힘
        >
          {/* 딤드 */}
          <div className="absolute inset-0 bg-black/30" />

          {/* 중앙 카드 (모바일 컨테이너 안 정렬) */}
          <div className="relative w-full max-w-[500px] flex items-center justify-center px-[1.5rem]">
            <div
              className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)]
                         px-[1.5rem] pt-[1.25rem] pb-[1rem]"
              onClick={(e) => e.stopPropagation()} // 카드 클릭 시 버블링 막기
            >
              {/* 아이콘 + 타이틀 */}
              <div className="flex items-center gap-[0.5rem] mb-[0.75rem]">
                  <img
                      src="/icons/popup-check.svg"
                      className="w-[1.2rem] h-[1.2rem] mt-[0.2rem]"
                      alt=""
                  />
                <span className="text-[0.95rem] font-semibold text-[#111827]">
                  채팅방을 나가시겠어요?
                </span>
              </div>

              {/* 본문 설명 */}
              <p className="text-[0.8125rem] text-[#4B5563] leading-[1.3rem] mb-[1rem]">
                지금 나가면 이 채팅방으로 다시 돌아올 수 없어요.
                <br />
                그래도 나가시겠어요?
              </p>

              {/* 버튼 영역 */}
              <div className="flex justify-end gap-[0.5rem]">
                <button
                  type="button"
                  className="px-[0.9rem] py-[0.45rem] rounded-[0.5rem] border border-[#E5E7EB]
                             bg-white"
                  onClick={handleCancelExit}
                >
                  <span className="text-[0.8125rem] text-[#3B3D40] font-semibold">
                    머무르기
                  </span>
                </button>
                <button
                  type="button"
                  className="px-[0.9rem] py-[0.45rem] rounded-[0.5rem] bg-[#FA502E]
                             text-[0.8125rem] text-white font-semibold"
                  onClick={handleConfirmExit}
                >
                  <span className="text-[0.8125rem] text-white font-semibold">
                    나가기
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
