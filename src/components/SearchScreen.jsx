import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom"; // ✅ 추가

export default function SearchScreen() {
  const navigate = useNavigate(); // ✅ 추가
  const [query, setQuery] = useState("");

  const [recentSearches, setRecentSearches] = useState([
    "장강명",
    "우리가 빛의 속도로 갈 수 없다면",
    "이상한 집",
    "J가 죽었다",
    "거의 황홀한 순간",
  ]);

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

  const renderTrendIcon = (trend) => {
    if (trend === "up")
      return <img src="/icons/trend-up.svg" className="w-[0.5rem] h-[0.5rem] ml-[0.25rem]" alt="상승" />;
    if (trend === "down")
      return <img src="/icons/trend-down.svg" className="w-[0.5rem] h-[0.5rem] ml-[0.25rem]" alt="하락" />;
    return <img src="/icons/trend-same.svg" className="w-[0.5rem] h-[0.5rem] ml-[0.25rem]" alt="유지" />;
  };

  const deleteRecent = (term) => {
    setRecentSearches(recentSearches.filter((item) => item !== term));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
  };

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard] relative">
      <Navbar />

      {/* ✅ 스크롤 가능한 메인 영역 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] pb-[6rem]">
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              autoFocus
              className="bg-transparent flex-1 ml-[0.25rem] text-[0.875rem] placeholder-[#9CA3AF] text-[#333] outline-none border-none"
              // ✅ Enter 입력 시 /search-result로 이동
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim() !== "") {
                  navigate("/search-result", { state: { query } }); 
                }
              }}
            />
          </div>
        </div>

        {/* 🕓 최근 검색어 */}
        <div className="mt-[1.5rem]">
          <div className="flex justify-between items-center mb-[0.5rem]">
            <h2 className="text-[1rem] font-semibold text-[#000000]">최근 검색어</h2>
            <button
              onClick={clearAllRecent}
              className="text-[#9CA3AF] text-[0.875rem] bg-transparent border-none outline-none"
            >
              전체 삭제
            </button>
          </div>

          <div className="flex flex-col gap-[1rem]">
            {recentSearches.map((term, i) => (
              <div key={i} className="flex justify-between items-center text-[0.95rem] text-[#000000]">
                <div className="flex items-center gap-[0.5rem]">
                  <img src="/icons/history.svg" alt="최근" className="w-[1rem] h-[1rem]" />
                  <span>{term}</span>
                </div>
                <button
                  onClick={() => deleteRecent(term)}
                  className="bg-transparent border-none outline-none"
                >
                  <img
                    src="/icons/close.svg"
                    alt="삭제"
                    className="w-[1rem] h-[1rem] opacity-60"
                  />
                </button>
              </div>
            ))}
            {recentSearches.length === 0 && (
              <p className="text-[#9CA3AF] text-[0.875rem] mt-[0.25rem]">최근 검색어가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 🔥 인기 검색어 */}
        <div className="mt-[1.75rem]">
          <div className="flex justify-between items-center mb-[0.5rem]">
            <p className="text-[1rem] font-bold text-[#000000]">
              인기 검색어{" "}
              <span className="text-[#B5BBC1] text-[0.75rem] font-normal ml-[9rem]">
                2025.10.10 12:00 기준
              </span>
            </p>
          </div>

          <div className="flex gap-[3.5rem]">
            {/* 왼쪽 열 */}
            <div className="flex flex-col gap-[1rem]">
              {popular.filter((_, i) => i % 2 === 0).map((item, i) => (
                <div key={i} className="flex items-center text-[1rem]">
                  <span>
                    {(i * 2) + 1}
                    <span className="ml-[0.5rem]">{item.title}</span>
                  </span>
                  <span className="ml-[0.44rem]">{renderTrendIcon(item.trend)}</span>
                </div>
              ))}
            </div>

            {/* 오른쪽 열 */}
            <div className="flex flex-col gap-[1rem]">
              {popular.filter((_, i) => i % 2 === 1).map((item, i) => (
                <div key={i} className="flex items-center text-[1rem]">
                  <span>
                    {(i * 2) + 2}
                    <span className="ml-[0.5rem]">{item.title}</span>
                  </span>
                  <span className="ml-[0.44rem]">{renderTrendIcon(item.trend)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 질문하기 버튼 */}
      <button
        className="fixed bottom-[5.5rem] right-[1.5rem] w-[7rem] h-[2.75rem] bg-[#FA502E] text-[#FFFFFF] rounded-[1.5rem] text-[0.875rem] font-bold shadow-md flex items-center justify-center gap-[0.5rem] z-50 border-none outline-none"
        onClick={() => navigate("/question")} // ✅ 그대로 유지
      >
        <img src="/icons/question.svg" alt="질문" className="w-[1rem] h-[1rem]" />
        질문하기
      </button>

      <BottomNav />
    </div>
  );
}
