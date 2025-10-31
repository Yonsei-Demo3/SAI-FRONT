import React from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

export default function SearchResult() {
  return (
    <div className="bg-white w-full min-h-[100vh] font-[Pretendard]">
      <div className="flex flex-col items-center w-full max-w-[500px] mx-auto pb-[5rem] overflow-y-auto">
        {/* 상단 네비게이션 */}
        <Navbar />

        {/* 검색창 */}
        <div className="w-full px-5 mt-4">
          <input
            type="text"
            value="사랑의 지속"
            className="w-full h-11 px-4 rounded-lg bg-[#F5F7FA] text-sm text-gray-800"
          />
        </div>

        {/* 검색결과 */}
        <div className="w-full px-5 mt-6 mb-24 space-y-6">
          {/* 카드 1 */}
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <p className="text-[1rem] font-medium mb-1">
              “기억을 지운다는 건 고통을 없애기 위함일까?”
            </p>
            <p className="text-[0.85rem] text-gray-500 mb-2">
              아픈 기억이 사라지면 편해질 것 같지만, 그 기억이 나를 만든 게 아닐까...
            </p>
            <p className="text-[0.8rem] text-gray-400">
              익명의 사자 · 도서 &gt; 소설
            </p>
            <button className="mt-2 bg-[#FA502E] text-white text-sm px-4 py-1 rounded-full">
              참여하기
            </button>
          </div>

          {/* 카드 2 */}
          <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <p className="text-[1rem] font-medium mb-1">
              “용서란 상대를 위한 걸까, 나를 위한 걸까?”
            </p>
            <p className="text-[0.85rem] text-gray-500 mb-2">
              용서는 결국 내 마음의 짐을 덜기 위한 선택일지도 모르겠다는 생각이 들었어요.
            </p>
            <p className="text-[0.8rem] text-gray-400">
              익명의 사자 · 도서 &gt; 소설
            </p>
            <button className="mt-2 bg-[#FA502E] text-white text-sm px-4 py-1 rounded-full">
              참여하기
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
