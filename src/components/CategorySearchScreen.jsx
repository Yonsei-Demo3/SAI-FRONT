import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function CategorySearchScreen() {
  const [selected, setSelected] = useState([]);
  const [showPopular, setShowPopular] = useState(false);
  const navigate = useNavigate();

  const categories = {
    도서: [
      "소설", "인문/사회/역사", "경영/경제", "자기계발", "에세이/시",
      "여행", "종교", "외국어", "과학", "진로/교육/교재",
      "컴퓨터/IT", "건강/다이어트", "가정/생활", "어린이/청소년", "잡지",
    ],
    "영화/TV": [
      "로맨스 웹소설", "로판 웹소설", "판타지 웹소설", "만화 연재", "웹툰",
      "여행", "종교", "외국어", "과학", "진로/교육/교재",
      "컴퓨터/IT", "건강/다이어트", "가정/생활", "어린이/청소년", "잡지",
    ],
    "웹툰/만화/웹소설": [
      "로맨스 웹소설", "로판 웹소설", "판타지 웹소설", "만화 연재", "웹툰",
      "종교", "외국어", "과학", "진로/교육/교재",
      "컴퓨터/IT", "건강/다이어트", "가정/생활", "어린이/청소년", "잡지",
    ],
  };

  const popular = [
    { title: "사랑의 지속", trend: "up" },
    { title: "기억과 망각", trend: "same" },
    { title: "관계의 거리", trend: "down" },
    { title: "AI와 예술", trend: "up" },
    { title: "자아와 타인", trend: "up" },
    { title: "공감의 피로", trend: "down" },
    { title: "죽음 이후의 의미", trend: "same" },
    { title: "성장의 책임", trend: "up" },
    { title: "외로움의 가치", trend: "down" },
    { title: "선택과 후회", trend: "up" },
  ];

  // ✅ 3개씩 나누는 함수
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const toggleSelect = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((v) => v !== item));
    } else if (selected.length < 20) {
      setSelected([...selected, item]);
    }
  };

  const resetSelection = () => setSelected([]);

  // ✅ SVG 아이콘 적용
  const renderTrendIcon = (trend) => {
    if (trend === "up")
      return <img src="/icons/trend-up.svg" alt="상승" className="w-[0.5rem] h-[0.5rem] ml-[-0.75rem]" />;
    if (trend === "down")
      return <img src="/icons/trend-down.svg" alt="하락" className="w-[0.5rem] h-[0.5rem] ml-[-0.75rem]" />;
    return <img src="/icons/trend-same.svg" alt="변동없음" className="w-[0.5rem] h-[0.5rem] ml-[-0.75rem]" />;
  };

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <Navbar />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* 🔍 검색창 */}
        <div className="w-[20.435rem] mx-auto pr-6 mt-[1.38rem] bg-white z-50">
          <div className="relative flex items-center bg-[#F2F4F8] rounded-[0.75rem] h-[2.5rem] px-3">
            <img
              src="/icons/search.svg"
              alt="검색"
              className="w-[1.5rem] h-[1.5rem] ml-[0.94rem] opacity-60"
            />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="bg-transparent flex-1 ml-[0.25rem] text-[0.875rem] placeholder-[#9CA3AF] text-[#333] outline-none border-none"
              onFocus={() => navigate("/search")} 
           />
          </div>
        </div>

        {/* 🔥 인기검색어 */}
        <div className="w-full max-w-[500px] mx-auto pl-[1.5rem] pr-6 mt-[0.5rem] bg-white relative z-20">
          {!showPopular ? (
            <div className="flex justify-between items-center mb-2">
              <p className="text-[1rem] font-medium flex items-center">
                1 {popular[0].title}
                <img src="/icons/trend-up.svg" alt="상승" className="w-[0.5rem] h-[0.5rem] ml-[0.43rem]" />
              </p>
              <button
                onClick={() => setShowPopular(true)}
                className="bg-transparent border-none outline-none"
              >
                <img
                  src="/icons/arrow-down.svg"
                  alt="열기"
                  className="w-[1.75rem] h-[0.875rem] mr-[2rem]"
                />
              </button>
            </div>
          ) : (
            <div className="mb-[1rem]">
              <div className="flex justify-between items-center mb-[0rem]">
                <p className="text-[1rem] font-bold text-[#000000]">
                  인기 검색어{" "}
                  <span className="text-[#B5BBC1] text-[0.75rem] font-normal ml-[0.25rem]">
                    2025.10.10 12:00 기준
                  </span>
                </p>
                <button
                  onClick={() => setShowPopular(false)}
                  className="bg-transparent border-none outline-none"
                >
                  <img
                    src="/icons/arrow-up.svg"
                    alt="닫기"
                    className="w-[1.75rem] h-[0.875rem] mr-[2rem]"
                  />
                </button>
              </div>

              {/* ✅ 인기 검색어 두 열로 분리 */}
              <div className="flex gap-[3.5rem] mt-[0rem]">
                {/* 왼쪽 열 (1,3,5,7,9) */}
                <div className="flex flex-col gap-[0.75rem]">
                  {popular.filter((_, i) => i % 2 === 0).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center text-[1rem] text-[#000000] leading-[1.5rem]"
                      onClick={() => toggleSelect(item.title)}
                    >
                      <span>
                        {(i * 2) + 1}
                        <span className="ml-[0.5rem]">{item.title}</span>
                      </span>
                      <span className="ml-[1.44rem]">{renderTrendIcon(item.trend)}</span>
                    </div>
                  ))}
                </div>

              {/* 오른쪽 열 (2,4,6,8,10) */}
              <div className="flex flex-col gap-[0.75rem]">
                {popular.filter((_, i) => i % 2 === 1).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center text-[1rem] text-[#000000] leading-[1.5rem]"
                    onClick={() => toggleSelect(item.title)}
                  >
                    <span>
                      {(i * 2) + 2} 
                      <span className="ml-[0.5rem]">{item.title}</span>                    </span>
                    <span className="ml-[1.44rem]">{renderTrendIcon(item.trend)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>

        {/* 회색 구분선 */}
        <div className="w-full h-[0.5rem] bg-[#F2F4F8] mt-2"></div>

        {/* 카테고리 타이틀 */}
        <div className="w-full max-w-[500px] h-[3.25rem] mx-auto pl-[1.5rem] pr-6 mt-3">
          <h2 className="text-[1.125rem] font-semibold text-[#000000]">
            카테고리
          </h2>
        </div>
        <div className="w-full h-[0.005rem] bg-[#CCD2D8] mt-2"></div>
        {/* ✅ 카테고리 */}
        <div
          className="overflow-y-auto flex-1 w-full max-w-[500px] mx-auto pl-[1.5rem] pr-6 pb-[10rem] scrollbar-hide relative z-0"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
          `}</style>

          {Object.keys(categories).map((section, i) => (
            <div key={i} className="pt-[1.5rem]">
              <h3 className="text-[1.125rem] font-semibold mb-3 text-[#000000] mt-[0rem] no-underline select-none">
                {section}
              </h3>

              {chunkArray(categories[section], 3).map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex gap-x-[0.75rem] mb-[0.75rem]"
                >
                  {row.map((item, j) => {
                    const isSelected = selected.includes(item);
                    return (
                      <button
                        key={j}
                        onClick={() => toggleSelect(item)}
                        className={`px-3 py-1 rounded-[0.5rem] inline-flex items-center justify-center text-[0.875rem] border transition-all
                          ${
                            isSelected
                              ? "bg-[#FFF2EE] border-[#FA502E] text-[#FA502E]"
                              : "bg-[#F2F4F8] border-transparent text-gray-700"
                          }`}
                      >
                        <span className="truncate">{item}</span>
                        {isSelected && (
                          <span className="ml-1 text-[#FA502E]">✕</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 하단 고정 영역 */}
      {selected.length === 0 ? (
        <BottomNav />
      ) : (
        <div className="fixed bottom-[0rem] left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[9.31rem] bg-[#FFFFFF] shadow-[0_-2px_8px_rgba(0,0,0,0.08)] z-50 flex justify-center items-center">
          <div className="px-6 py-3 w-full">
            <div className="flex justify-between items-center ml-[1.5rem] text-[0.875rem] text-gray-500 mb-2">
              <span>
                <span className="text-[#FA502E]">{selected.length}</span> / 20
              </span>
              <button
                onClick={resetSelection}
                className="flex items-center gap-1 mr-[1.5rem] text-[#91969A] bg-transparent border-none outline-none"
              >
                <img
                  src="/icons/reset.svg"
                  alt="초기화"
                  className="w-[1rem] h-[1rem] mr-[0.2rem] mt-[0.2rem]"
                />
                초기화
              </button>
            </div>

            <div className="flex flex-wrap gap-[0.7rem] mb-3 ml-[1.5rem] mt-[1rem] max-h-[4rem] overflow-y-auto">
              {selected.map((item, i) => (
                <span
                  key={i}
                  className="flex items-center pl-[0.5rem] py-1 rounded-[0.5rem] text-[0.875rem] bg-[#FFF2EE] text-[#FA502E] border border-[#FA502E]"
                >
                  {item}
                  <button
                    onClick={() => toggleSelect(item)}
                    className="ml-1 text-[#FA502E] bg-transparent border-none outline-none"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                className="w-[20.435rem] h-[3rem] bg-[#FA502E] mt-[1rem] text-[#FFFFFF] text-[0.875rem] font-medium rounded-[0.5rem] border-none outline-none"
                onClick={() => console.log("검색하기", selected)}
              >
                검색하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
