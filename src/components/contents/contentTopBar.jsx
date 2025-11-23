import React from "react";
import { useNavigate } from "react-router-dom";

export default function ContentTopBar({ title, isbutton }){
  
  const navigate = useNavigate();

  return (
    <div className="top-0 z-20 bg-white shadow-[0_4px_5px_rgba(0,0,0,0.04)]">
      <div className="w-full flex items-center justify-start pl-[1.5rem] pr-[1.5rem] pb-[1.25rem] pt-[1.25rem] box-border gap-[0.75rem]">

        <button 
          aria-label="뒤로가기" 
          className="rounded-full border-none outline-none bg-[#FFFFFF]"
          onClick={() => navigate(-1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.15017 8.8295L7.75 15.4293L9.39967 13.7797L3.62467 8.00467L9.39967 2.22967L7.75 0.58L1.15017 7.17983C0.931451 7.39862 0.808583 7.69531 0.808583 8.00467C0.808583 8.31402 0.931451 8.61072 1.15017 8.8295Z" fill="#191D1F"/>
          </svg>
        </button>
        <span className="text-[1.1875rem] font-bold">
          {title}
        </span>
      </div>
    </div>
  );
}