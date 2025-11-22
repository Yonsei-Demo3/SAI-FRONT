import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/main/Navbar";
import BottomNav from "../../components/main/BottomNav";
import SearchBar from "../../components/common/SearchBar";

export default function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState(""); // 검색어 상태
  const [recentSearches, setRecentSearches] = useState([]); // 최근 검색어 상태
  const [popularSearches, setPopularSearches] = useState([]); // 인기 검색어 상태

  // 제공된 토큰
  const token = "eyJzdWIiOiIxIiwicm9sZSI6IlVTRVIiLCJ0eXAiOiJhY2Nlc3MiLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzYzNzAxODQ2LCJleHAiOjE3OTUyMzc4NDYsImF1ZCI6IndlYiIsImlzcyI6Im15LWJhY2tlbmQtYXBpIn0.AzIeDBqcvfDapbj79tEa0q8Ta3RQQDVy-Urtn2qUqbo";

  // API 요청 함수 (인기 검색어)
  const fetchPopularSearches = async () => {
    try {
      const response = await axios.get("http://3.36.131.35:8080/api/v1/search/popular", {
        headers: {
          "Authorization": `Bearer ${token}`, // Authorization 헤더에 토큰 추가
        },
        params: {
          size: 10,
        },
      });
      setPopularSearches(response.data); // 인기 검색어 상태 업데이트
    } catch (error) {
      console.error("Error fetching popular searches:", error);
    }
  };

  // API 요청 함수 (최근 검색어)
  const fetchRecentSearches = async () => {
    try {
      const response = await axios.get("http://3.36.131.35:8080/api/v1/search/recent", {
        headers: {
          "Authorization": `Bearer ${token}`, // Authorization 헤더에 토큰 추가
        },
        params: {
          size: 5,
        },
      });
      setRecentSearches(response.data); // 최근 검색어 상태 업데이트
    } catch (error) {
      console.error("Error fetching recent searches:", error);
    }
  };

  // 검색어 추가
  const addRecentSearch = (term) => {
    if (!recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches]); // 최근 검색어 리스트에 추가
    }
  };

  // 최근 검색어 삭제
  const deleteRecent = (term) => {
    setRecentSearches(recentSearches.filter((item) => item !== term));
  };

  // 전체 최근 검색어 삭제
  const clearAllRecent = () => {
    setRecentSearches([]);
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
          onEnter={() => {
            addRecentSearch(query);
            navigate("/search-result", { state: { query } });
          }}
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
