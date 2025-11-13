import React, { useLayoutEffect, useRef, useState } from "react";

function Chevron({ expanded }) {
  return (
  <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      className={`transition-transform ${expanded ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.71102 7.157L13.368 1.5L11.954 0.0859985L7.00401 5.036L2.05401 0.0859985L0.640015 1.5L6.29701 7.157C6.48454 7.34447 6.73885 7.44978 7.00401 7.44978C7.26918 7.44978 7.52349 7.34447 7.71102 7.157Z"
        fill="#B5BBC1"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.71102 7.157L13.368 1.5L11.954 0.0859985L7.00401 5.036L2.05401 0.0859985L0.640015 1.5L6.29701 7.157C6.48454 7.34447 6.73885 7.44978 7.00401 7.44978C7.26918 7.44978 7.52349 7.34447 7.71102 7.157Z"
        fill="black"
        fillOpacity="0.2"
      />
    </svg>
  );
}


export default function QuestionStrip({ title = "" }) {
  const [expanded, setExpanded] = useState(false);
  const label = expanded ? "접기" : "더 보기";
  return (
    <div className="bg-[#FFEEEA] h-[2.25rem] flex items-center justify-center pl-[1rem] pr-[1rem]">
      
      <div className="flex items-center justify-center w-[2.0625rem] h-[1.0625rem] rounded-[0.25rem] bg-[#FA502E]">
        <span className="text-[#FFFFFF] text-[0.75rem] font-bold">
          질문
        </span>
      </div>

      {/* <div className="w-full px-3 py-2 flex items-center gap-2 lg:max-w-[760px] lg:mx-auto"> */}
        
        
        <div
          id="q-title"
          className={`flex-1 text-[0.875rem] pl-[0.75rem] ${expanded ? "whitespace-normal break-words" : "truncate"}`}
        >
          {expanded || title.length < 30 ? title : title.substring(0, 30) + "... "}
        </div>
        
        
        <button
          aria-label={label}
          aria-expanded={expanded}
          aria-controls="q-title"
          onClick={() => setExpanded((v) => !v)}
          className="border-none"
          title={label}
        >
          {<Chevron expanded={expanded} />}
        </button>
      {/* </div> */}
    </div>
  );
}
