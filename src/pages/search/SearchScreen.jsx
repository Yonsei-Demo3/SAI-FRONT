import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/main/Navbar";
import BottomNav from "../../components/main/BottomNav";
import SearchBar from "../../components/common/SearchBar";
import { popular, recentSearch, deleteRecentSearch, clearAllRecentSearch} from "../../lib/searchService";

export default function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [snapshotAt, setSnapshotAt] = useState("");
  const handleSearch = () => {
    if (!query.trim()) return;
    navigate("/search-result", { state: { query } });
  };

  const handleSearchWithTerm = (term) => {
    if (!term.trim()) return;
    setQuery(term);
    navigate("/search-result", { state: { query: term } });
  };

  
  const fetchPopularSearches = async () => {
    try {      
      const list = await popular();
      setPopularSearches(list); 
      if (list.length > 0) {
      setSnapshotAt(list[0].snapshotAt);
      }
    } catch (error) {
      console.error("Error fetching popular searches:", error);
    }
  };

  const fetchRecentSearches = async () => {
    try {
      const list = await recentSearch();
      console.log("최근검색어 list:", list, list.length);
      setRecentSearches(list);
      
    } catch (error) {
      console.error("Error fetching recent searches:", error);
    }
  };


  const deleteRecent = async (term) => {
    try {
      await deleteRecentSearch(term); 
      setRecentSearches((prev) => prev.filter((x) => x !== term));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllRecent = async () => {
    try {
      await clearAllRecentSearch();
      setRecentSearches([]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPopularSearches();
    fetchRecentSearches();
  }, []);

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


  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard] relative">
      <Navbar />

      {/* 검색창 */}
      <div className="flex-1 overflow-y-auto pb-[6rem]">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
           onEnter={handleSearch}
        />

        {/* 최근 검색어 */}
        <div className="mt-[1.5rem] px-[1.5rem]">
          <div className="flex justify-between items-center mb-[0.5rem]">
            <h2 className="text-[1rem] font-semibold text-[#000000]">최근 검색어</h2>
            <button onClick={clearAllRecent} className="text-[#9CA3AF] text-[0.875rem] bg-transparent border-none outline-none">
              전체 삭제
            </button>
          </div>

          <div className="flex flex-col mt-[0.75rem] gap-[1rem]">
            {recentSearches.map((term, i) => (
            <div
              key={i}
              className="flex justify-between items-center text-[0.95rem] text-[#000000] cursor-pointer"
              onClick={() => handleSearchWithTerm(term)}  // ✅ 박스 전체 클릭 시 검색
            >
              <div className="flex items-center gap-[0.5rem]">
                <img
                  src="/icons/history.svg"
                  alt="최근"
                  className="w-[1rem] h-[1rem]"
                />
                <span>{term}</span>
              </div>

              <button
                className="bg-transparent border-none outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRecent(term);
                }}
              >
                <img
                  src="/icons/close.svg"
                  alt="삭제"
                  className="w-[1rem] h-[1rem] opacity-60"
                />
              </button>
            </div>
          ))}

          </div>
        </div>

        {/* 인기 검색어 */}
        <div className="mt-[1.75rem] px-[1.5rem]">
          <div className="flex justify-between items-center mb-[0.5rem]">
            <p className="text-[1rem] font-bold text-[#000000]">
                  인기 검색어{" "}
                  <span className="text-[#B5BBC1] text-[0.75rem] font-normal ml-[0.25rem]">
                    {snapshotAt} 기준
                  </span>
            </p>
          </div>

          <div className="flex gap-[3.5rem]">
            {/* 1~5위 */}
            <div className="flex flex-col gap-[0.75rem]">
              {popularSearches.slice(0, 5).map((item, i) => (
                <div
                  key={item.keyword + "-left"}
                  className="flex items-center text-[1rem] text-[#000000] leading-[1.5rem]"
                  onClick={() => handleClickPopularKeyword(item.keyword)}
                >
                  <span className="w-[1.5rem] text-left">
                    {i + 1}
                  </span>
                    <span
                      className="max-w-[6rem] truncate inline-block"
                    >
                      {item.keyword}
                    </span>

                  <span className="ml-[0.44rem]">
                    {renderTrendIcon(item.movement)}
                  </span>
                </div>
              ))}
            </div>

            {/* 6~10위 */}
            <div className="flex flex-col gap-[0.75rem]">
              {popularSearches.slice(5, 10).map((item, i) => (
                <div
                  key={item.keyword + "-right"}
                  className="flex items-center text-[1rem] text-[#000000] leading-[1.5rem]"
                  onClick={() => handleClickPopularKeyword(item.keyword)}
                >
                  <span className="w-[1.5rem] text-left">
                    {i + 6}
                  </span>
                    <span
                      className="max-w-[6rem] truncate inline-block"
                    >
                      {item.keyword}
                    </span>
                  <span className="ml-[0.44rem]">
                    {renderTrendIcon(item.movement)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
