import React from "react";
import BookmarkIcon from "./BookmarkIcon";

function Avatar({ initials = "" }) {
  return (
    <div
      className="flex h-[2.5rem] w-[2.5rem] items-center justify-center
                 rounded-full bg-[#DEE2E6]"
    >
      {initials}
    </div>
  );
}


export default function ChatBubble({ msg, onToggleBookmark }) {
  const isLeft = msg.side === "left";

  return (
    
    <div className={`w-full flex pl-[0.625rem] pr-[0.625rem] pt-[0.5rem] pb-[0.5rem] ${isLeft ? "justify-start" : "justify-end"}`}>
      {isLeft && (
        <div className="flex flex-col items-center">
          <Avatar initials={msg.name?.slice(0, 1)} bg={msg.avatarBg} />
        </div>
      )}

      <div className="flex flex-col gap-[0.5rem]">
        
        {/* nickname */}
        <div className="items-start pl-[0.5rem]">
          {isLeft && (
            <div className="border-none">
              <span className="text-[0.875rem] text-[#191D1F]">
                {msg.name}
              </span>
            </div>
          )}
        </div>
        
        <div className="w-full flex items-end">
          {/* message bubble */}
          <div className={`${isLeft ? "pl-[0.5rem]" : "pr-[0.5rem]"}`}>
            <div
              className={
                `relative max-w-[15rem] rounded-[1rem] pl-[1.25rem] pr-[1.25rem] pt-[0.875rem] pb-[0.875rem] text-[16px] ` +
                (isLeft
                  ? "border border-[#DEE2E6] bg-[#FFFFFF]"
                  : "bg-[#FA502E]")
                }
                >
              <span className={`${isLeft ? "text-[#191D1F]" : "text-[#FFFFFF]"}`}>
                {msg.text}
              </span>
            </div>
          </div>

          {/* side actions */}
          <div className={`${isLeft ? "right-2" : "left-2"} flex items-center gap-2`}>
            <button
              onClick={() => onToggleBookmark?.(msg.id)}
              className={`border-none bg-[#FFFFFF] ${msg.bookmarked ? "text-[#FA502E]" : "text-[#DEE2E6]"}`}
              aria-label="bookmark"
              title="북마크"
              aria-pressed={!!msg.bookmarked}
              >
              <BookmarkIcon filled={msg.bookmarked} />
            </button>
          </div> 
        </div>
        
        <div className="pl-[0.5rem] text-[0.625rem] text-[#B5BBC1]">
          {msg.time}
        </div>
      </div>


      {/* {!isLeft && <div className="ml-2 h-11 w- shrink-0" />} */}
    </div>
  );
}
