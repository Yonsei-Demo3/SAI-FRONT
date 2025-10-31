import React from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function SearchScreen() {
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full min-h-screen font-[Pretendard]">
      <div className="flex flex-col items-center w-full max-w-[500px] mx-auto overflow-y-auto pb-[6rem]">
        {/* 상단 네비게이션 */}
        <Navbar />

        {/* 검색창 */}
        <div className="w-full px-5 mt-4">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full h-11 px-4 rounded-lg bg-[#F5F7FA] text-sm placeholder-[#9CA3AF]"
          />
        </div>

        {/* 최근 검색어 */}
        <div className="w-full px-5 mt-6">
          <h2 className="text-[0.9rem] font-medium mb-2">최근 검색어</h2>
          <div className="flex flex-col space-y-2 text-[0.9rem] text-gray-700">
            {["장강명", "우리가 빛의 속도로 갈 수 없다면", "이상한 집", "J가 죽었다"].map(
              (item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item}</span>
                  <span className="text-gray-400">✕</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* 인기 검색어 */}
        <div className="w-full px-5 mt-8 mb-24">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[0.9rem] font-medium">인기 검색어</h2>
            <p className="text-[0.75rem] text-gray-400">2025.10.10 12:00 기준</p>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-[0.9rem]">
            {[
              "1 사랑의 지속 🔺",
              "2 기억과 망각 ▬",
              "3 관계의 거리 🔻",
              "4 AI와 예술 🔺",
              "5 자아와 타인 🔺",
              "6 공감의 피로 🔻",
              "7 죽음 이후의 의미 ▬",
              "8 성장의 책임 🔺",
              "9 외로움의 가치 🔻",
              "10 선택과 후회 🔺",
            ].map((word, i) => (
              <button
                key={i}
                onClick={() => navigate("/search/result")}
                className="text-left"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </div>
        <BottomNav />
    </div>
  );
}
