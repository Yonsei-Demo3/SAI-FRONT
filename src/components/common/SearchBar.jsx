import React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  value,
  onChange,
  onEnter,
  onFocus,
  autoFocus,
  tags = [],
  onRemoveTag,
  noPadding
}) {
  const navigate = useNavigate();

  return (
    <div className={`${noPadding ? "" : "px-[1.5rem]"} w-full mt-[0.38rem] bg-white`}>
      <div className="relative flex items-center bg-[#F2F4F8] rounded-[0.75rem] min-h-[2.5rem] px-3 w-full">

        <button onClick={()=> navigate("/search")}>
        {/* 🔍 검색 아이콘 */}
        <img
          src="/icons/search.svg"
          alt="검색"
          className="w-[1.5rem] h-[1.5rem] opacity-60 mr-[0.5rem]"
        />
        </button>

        {/* 태그 + 입력 컨테이너 */}
        <div className="flex flex-wrap items-center gap-[0.4rem] flex-1 min-h-[2rem]">

          {/* 🔥 선택한 태그들 */}
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center bg-[#FFF2EE] text-[#FA502E] px-[0.5rem] py-[0.25rem] rounded-[0.5rem] border border-[#FA502E] text-[0.75rem]"
            >
              {tag}
              <button
                className="ml-1 text-[#FA502E]"
                onClick={() => onRemoveTag(tag)}
              >
                ✕
              </button>
            </span>
          ))}

          {/* 🔍 입력창 (태그만 있을 때는 width:0 으로!) */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e)}
            onFocus={onFocus}
            autoFocus={autoFocus}
            placeholder={tags.length === 0 ? "검색어를 입력하세요" : ""}
            className={`bg-transparent text-[0.875rem] text-[#333] placeholder-[#9CA3AF] outline-none border-none transition-all 
              ${tags.length > 0 ? "w-0 p-0 m-0 opacity-0" : "flex-1 ml-[0.25rem] opacity-100"}
            `}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onEnter) onEnter();
            }}
          />
        </div>
      </div>
    </div>
  );
}
