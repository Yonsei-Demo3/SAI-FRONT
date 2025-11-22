import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/main/Navbar";
import BottomNav from "../../components/main/BottomNav";
import SearchBar from "../../components/common/SearchBar";
import { popular, recentSearch, deleteRecentSearch, clearAllRecentSearch} from "../../lib/searchService";

export default function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState(""); // 검색어 상태
  const [recentSearches, setRecentSearches] = useState([]); // 최근 검색어 상태
  const [popularSearches, setPopularSearches] = useState([]); // 인기 검색어 상태
  const handleSearch = () => {
    if (!query.trim()) return; // 빈 문자열이면 무시
    navigate("/search-result", { state: { query } });
  };
  
  const fetchPopularSearches = async () => {
    try {      
      const list = await popular();
      setPopularSearches(list); 
    } catch (error) {
      console.error("Error fetching popular searches:", error);
    }
  };

  // API 요청 함수 (최근 검색어)
  const fetchRecentSearches = async () => {
    try {
      const list = await recentSearch();
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

  // 컴포넌트가 마운트될 때 인기 검색어와 최근 검색어 데이터를 가져옴
  useEffect(() => {
    fetchPopularSearches();
    fetchRecentSearches();
  }, []);

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
            {recentSearches.length === 0 ? (
              <p className="text-[#9CA3AF] text-[0.875rem] mt-[0.25rem]">최근 검색어가 없습니다.</p>
            ) : (
              recentSearches.map((term, i) => (
                <div key={i} className="flex justify-between items-center text-[0.95rem] text-[#000000]">
                  <div className="flex items-center gap-[0.5rem]">
                    <img src="/icons/history.svg" alt="최근" className="w-[1rem] h-[1rem]" />
                    <span>{term}</span>
                  </div>
                  <button onClick={() => deleteRecent(term)} className="bg-transparent border-none outline-none">
                    <img src="/icons/close.svg" alt="삭제" className="w-[1rem] h-[1rem] opacity-60" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 인기 검색어 */}
        <div className="mt-[1.75rem] px-[1.5rem]">
          <div className="flex justify-between items-center mb-[0.5rem]">
            <p className="text-[1rem] font-bold text-[#000000]">인기 검색어</p>
          </div>

          <div className="flex gap-[3.5rem]">
            {/* 인기 검색어 리스트 */}
            {popularSearches.map((item, index) => (
              <div key={index} className="flex items-center text-[1rem]">
                <span>{index + 1}. {item.keyword}</span>
                <span className="ml-[0.5rem]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
