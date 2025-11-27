// src/screens/search/CategorySearchScreen.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../../components/main/Navbar";
import BottomNav from "../../components/main/BottomNav";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar";
import { popular } from "../../lib/searchService";

export default function CategorySearchScreen() {
  const [selected, setSelected] = useState([]); // 선택된 서브카테고리
  const [showPopular, setShowPopular] = useState(false);
  const [popularKeywords, setPopularKeywords] = useState([]);
  const navigate = useNavigate();
  const [snapshotAt, setSnapshotAt] = useState("");

  useEffect(() => {
    fetchPopularSearches();
  }, []);

  const fetchPopularSearches = async () => {
    try {
      const list = await popular();
      console.log("응답", list);
      setPopularKeywords(list);
      if (list.length > 0) {
        setSnapshotAt(list[0].snapshotAt);
      }
    } catch (error) {
      console.error("Error fetching popular searches:", error);
    }
  };

  const categories = {
    책: [
      "소설",
      "에세이",
      "논픽션",
      "시·문학",
      "역사·인문",
      "과학·기술",
      "만화·그래픽노블",
    ],
    "영화·TV": [
      "영화",
      "드라마",
      "다큐",
      "애니메이션",
      "예능·리얼리티",
      "OTT 오리지널",
    ],
    "기타 콘텐츠": [
      "음악",
      "유튜브",
      "팟캐스트",
      "웹툰·웹소설",
      "게임",
      "전시·공연",
      "SNS·밈",
      "뉴스·시사",
      "기타",
    ],
  };

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

  const renderTrendIcon = (movement) => {
    if (movement === "UP")
      return (
        <img
          src="/icons/trend-up.svg"
          alt="상승"
          className="w-[0.5rem] h-[0.5rem] ml-[0.44rem]"
        />
      );
    if (movement === "DOWN")
      return (
        <img
          src="/icons/trend-down.svg"
          alt="하락"
          className="w-[0.5rem] h-[0.5rem] ml-[0.44rem]"
        />
      );
    return (
      <img
        src="/icons/trend-same.svg"
        alt="변동없음"
        className="w-[0.5rem] h-[0.5rem] ml-[0.44rem]"
      />
    );
  };

  // 선택된 서브카테고리 → [{ main, sub }] 형태로 변환
  const buildCategoryFilters = () => {
    const normalizeMainForBackend = (main) => {
    if (main === "영화/TV") return "영화 TV";
    // 필요하면 여기 더 추가
    // if (main === "기타 콘텐츠") return "기타콘텐츠";
    return main;
  };

    const mainBySub = {};

  Object.entries(categories).forEach(([main, subs]) => {
    const backendMain = normalizeMainForBackend(main); // ← 여기서 변환
    subs.forEach((sub) => {
      mainBySub[sub] = backendMain;
    });
  });


    return selected.map((sub) => ({
      main: mainBySub[sub] || "",
      sub,
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <Navbar />

      <div className="flex-1 overflow-hidden flex flex-col">
        <SearchBar onFocus={() => navigate("/search")} value="" />

        {/* 인기 검색어 영역 */}
        <div className="w-full max-w-[500px] mx-auto pl-[1.5rem] pr-6 mt-[1rem] bg-white relative z-20">
          {!showPopular ? (
            <div className="flex justify-between items-center mb-2">
              {popularKeywords.length > 0 && (
                <p className="text-[1rem] font-refular flex items-center">
                  1
                  <span className="ml-[0.5rem]">
                    {popularKeywords[0].keyword}
                  </span>
                  {renderTrendIcon(popularKeywords[0].movement)}
                </p>
              )}
              <button
                onClick={() => setShowPopular(true)}
                className="bg-transparent border-none outline-none"
              >
                <img
                  src="/icons/arrow-down.svg"
                  alt="열기"
                  className="w-[1.75rem] h-[0.875rem]"
                />
              </button>
            </div>
          ) : (
            <div className="mb-[1rem]">
              <div className="flex justify-between items-center mb-[0.75rem]">
                <p className="text-[1rem] font-bold text-[#000000]">
                  인기 검색어{" "}
                  <span className="text-[#B5BBC1] text-[0.75rem] font-normal ml-[0.25rem]">
                    {snapshotAt} 기준
                  </span>
                </p>
                <button
                  onClick={() => setShowPopular(false)}
                  className="bg-transparent border-none outline-none"
                >
                  <img
                    src="/icons/arrow-up.svg"
                    alt="닫기"
                    className="w-[1.75rem] h-[0.875rem]"
                  />
                </button>
              </div>

              <div className="flex gap-[3.5rem] mt-[0rem]">
                {/* 인기 검색어 1~5위 */}
                <div className="flex flex-col gap-[0.75rem]">
                  {popularKeywords.slice(0, 5).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center text-[1rem] text-[#000000] leading-[1.5rem] cursor-pointer"
                      onClick={() =>
                        navigate("/search-result", {
                          state: {
                            query: item.keyword,      // 검색어
                            categories: [],           // 카테고리 필터는 없음
                          },
                        })
                      }
                    >
                      <span className="w-[1.5rem] text-left">{i + 1}</span>
                      <span className="max-w-[6rem] truncate inline-block">
                        {item.keyword}
                      </span>
                      <span>{renderTrendIcon(item.movement)}</span>
                    </div>
                  ))}
                </div>

                {/* 인기 검색어 6~10위 */}
                <div className="flex flex-col gap-[0.75rem]">
                  {popularKeywords.slice(5, 10).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center text-[1rem] text-[#000000] leading-[1.5rem] cursor-pointer"
                      onClick={() =>
                        navigate("/search-result", {
                          state: {
                            query: item.keyword,
                            categories: [],
                          },
                        })
                      }
                    >
                      <span className="w-[1.5rem] text-left">{i + 6}</span>
                      <span className="max-w-[6rem] truncate inline-block">
                        {item.keyword}
                      </span>
                      <span>{renderTrendIcon(item.movement)}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>

        {/* 카테고리 타이틀 */}
        <div className="w-full h-[0.5rem] bg-[#F2F4F8] mt-[0.5rem]" />
        <div className="w-full max-w-[500px] h-[3.25rem] mx-auto pl-[1.5rem] pr-6 mt-3">
          <h2 className="text-[1.125rem] font-semibold text-[#000000]">
            카테고리
          </h2>
        </div>
        <div className="w-full h-[0.00625rem] mt-[-0.75rem] bg-[#CCD2D8]" />

        {/* 카테고리 리스트 */}
        <div
          className="overflow-y-auto flex-1 w-full max-w-[500px] mx-auto pl-[1.5rem] pr-6 pb-[6.5rem] scrollbar-hide relative z-0"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
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
                        className={`px-[0.5rem] py-[0.25rem] rounded-[0.5rem] inline-flex items-center justify-center text-[0.875rem] border transition-all
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

      {/* 하단 선택 바 */}
      {selected.length === 0 ? (
        <BottomNav />
      ) : (
        <div className="fixed bottom-[0rem] left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-[#FFFFFF] shadow-[0_-2px_8px_rgba(0,0,0,0.08)] z-50 flex justify-center items-center">
          <div className="px-6 py-3 w-full">
            <div className="flex justify-between items-center text-[0.875rem] text-gray-500 mb-2">
              <span>
                <span className="text-[#FA502E]">{selected.length}</span> / 20
              </span>
              <button
                onClick={resetSelection}
                className="flex items-center text-[#91969A] bg-transparent border-none outline-none"
              >
                <img
                  src="/icons/reset.svg"
                  alt="초기화"
                  className="w-[1rem] h-[1rem] mt-[-0.1rem]"
                />
                초기화
              </button>
            </div>

            <div
              className="flex flex-wrap gap-[0.7rem] mb-3 mt-[1rem] max-h-[4rem] overflow-y-auto"
              style={{ maxHeight: "4.5rem" }}
            >
              {selected.map((item, i) => (
                <span
                  key={i}
                  className="flex items-center pl-[0.5rem] py-1 rounded-[0.5rem] text-[0.875rem] bg-[#FFF2EE] text-[#FA502E] border border-[#FA502E]"
                >
                  {item}
                  <button
                    onClick={() => toggleSelect(item)}
                    className="ml-1 mr-[0.5rem] text-[#FA502E] bg-transparent border-none outline-none"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                className="w-full h-[3rem] mx-[0.5rem] bg-[#FA502E] text-[#FFFFFF] text-[0.875rem] font-medium rounded-[0.5rem] border-none outline-none"
                onClick={() => {
                  const categoryFilters = buildCategoryFilters();

                  navigate("/search-result", {
                    state: {
                      query: selected.join(", "),
                      tags: selected,          // 칩 표시용
                      categories: categoryFilters, // 실제 API 필터용
                    },
                  });
                }}
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
