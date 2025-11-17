import React, { useLayoutEffect, useRef, useState } from "react";


export default function QuestionStrip({ title = "" }) {
  const [expanded, setExpanded] = useState(false);
  const label = expanded ? "접기" : "더 보기";
  return (
    
    <div className={
          "bg-[#FFEEEA] min-h-[2.5625rem] flex items-start justify-center pl-[1rem] pr-[1rem] pt-[0.625rem] pb-[0.625rem] fixed left-0 right-0 z-20" 
          // (expanded ? "fixed left-0 right-0 z-20" : "relative")
        }>
      
      <div className="flex self-start items-center justify-center w-[2.0625rem] h-[1.3125rem] rounded-[0.25rem] bg-[#FA502E]">
        <span className="text-[#FFFFFF] text-[0.75rem] font-bold text-center">
          질문
        </span>
      </div>

      <div
        className={`flex-1 text-[0.875rem] pl-[0.75rem] ${
          expanded ? "whitespace-normal break-words" : "truncate"
        }`}
      >
        {title}
      </div>

       <button
        type="button"
        className="flex self-start items-center justify-center border-none"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label={expanded ? "제목 접기" : "제목 전체 보기"}
        aria-expanded={expanded}
      >

        <svg className={
            "transform transition-transform duration-200 " +
            (expanded ? "rotate-180" : "")
          }
          xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7106 10.1569L18.3676 4.49994L16.9536 3.08594L12.0036 8.03594L7.05365 3.08594L5.63965 4.49994L11.2966 10.1569C11.4842 10.3444 11.7385 10.4497 12.0036 10.4497C12.2688 10.4497 12.5231 10.3444 12.7106 10.1569Z" fill="#B5BBC1"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7106 10.1569L18.3676 4.49994L16.9536 3.08594L12.0036 8.03594L7.05365 3.08594L5.63965 4.49994L11.2966 10.1569C11.4842 10.3444 11.7385 10.4497 12.0036 10.4497C12.2688 10.4497 12.5231 10.3444 12.7106 10.1569Z" fill="black" fill-opacity="0.2"/>
        </svg>
      </button>      

    </div>

    
  );
}
