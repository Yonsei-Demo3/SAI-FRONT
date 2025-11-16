import React from "react";

export default function QuestionTopBar({ title,   onSubmit, canSubmit }) {
  return (
  
  <div className="w-full flex items-center justify-between pl-[1.5rem] pr-[1.5rem] pt-[1.5rem] pb-[1rem] box-border shadow-[0_4px_5px_rgba(0,0,0,0.04)]">

    <button type="button" className="bg-[#FFFFFF] border-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.341565 8.2495L6.9414 14.8493L8.59106 13.1997L2.81606 7.42467L8.59106 1.64967L6.9414 0L0.341565 6.59983C0.122849 6.81862 -1.90735e-05 7.11531 -1.90735e-05 7.42467C-1.90735e-05 7.73402 0.122849 8.03072 0.341565 8.2495Z" fill="#191D1F"/>
      </svg>
    </button>

    <button
      type="button"
      onClick={onSubmit}
      disabled={!canSubmit}   
      className={`h-[2rem] w-[3.5625rem] border-none rounded-[0.5rem] text-center transition-colors
        ${canSubmit
          ? "bg-[#FA502E] cursor-pointer"
          : "bg-[#CCD2D8] cursor-not-allowed"
        }`}
    >
      <span className="text-[#FFFFFF] text-[0.875rem] font-medium">
        등록
      </span>
    </button>

  </div>
  );
}