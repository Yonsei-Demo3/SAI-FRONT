import React, { useState } from "react";
import BottomNav from "../../components/main/BottomNav";
import MyPageNav from "../../components/mypage/MyPageNav";

export default function MyPageScrapScreen() {

  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
    <MyPageNav/>

        <div className="flex justify-end items-center pr-[1.5rem]">

          <div className="relative text-[0.75rem]">
            <button
              className="text-[#6B7280] text-xs flex items-center"
              onClick={() => setSortOpen(!sortOpen)}
            >
              {sortType}
              <img
                src="/icons/arrow-down.svg"
                className="w-[1rem] h-[1rem] ml-[0.25rem]"
              />
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-[6rem] bg-white rounded-xl shadow-lg z-50">
                <button
                  className="w-full text-left px-3 py-2 text-xs text-[#B5BBC1]"
                  onClick={() => {
                    setSortType("가나다순");
                    setSortOpen(false);
                  }}
                >
                  가나다순
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-xs text-[#B5BBC1]"
                  onClick={() => {
                    setSortType("인기순");
                    setSortOpen(false);
                  }}
                >
                  인기순
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-xs text-[#B5BBC1]"
                  onClick={() => {
                    setSortType("최신순");
                    setSortOpen(false);
                  }}
                >
                  최신순
                </button>
              </div>
            )}
          </div>
        </div>

      {/* 내용 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] pb-[7rem] no-scrollbar">

        <div className="w-full bg-white rounded-[1rem] shadow-[0px_2px_19px_rgba(0,0,0,0.10)] p-6 my-[1rem] relative">

            {/* 따옴표 + 문장(오른쪽 따옴표는 마지막 줄 끝) */}
              <div className="relative w-full ml-[-0.2rem] flex items-start justify-center">

                {/* 왼쪽 따옴표 */}
                <img
                  src="/icons/quote.svg"
                  alt="quote"
                  className="w-[1rem] h-[1rem] opacity-70 mt-[0.5rem] flex-shrink-0 ml-[-0.5rem] mr-2"
                />

                {/* 문장 + 오른쪽 따옴표 absolute */}
                <div className="relative max-w-[14rem] text-center mt-[0.5rem] leading-[1.5]">
                  <p className="text-[1rem] font-medium ml-[-0.1rem] text-gray-800">
                    기억을 지운다는 건 고통을 없애기 위함일까,
                    아니면 다시 사랑하기 위해 자신을 비워내는 행위일까?
                  </p>

                  {/* 오른쪽 따옴표 → 마지막 줄 끝에 자동 정렬 */}
                  <img
                    src="/icons/quote-down.svg"
                    alt="quote close"
                    className="w-[1rem] h-[1rem] opacity-70 absolute right-0 mr-[-1rem] bottom-0 translate-y-[20%]"
                  />
                </div>
              </div>

            {/* 구분선 */}
            <div className="w-full h-[1px] bg-[#E7EBEF] my-4"></div>

            {/* 닉네임 + 영화 제목 */}
            <div>
              <p className="text-[0.75rem] text-[#6B7280] mb-1">익명의 닉네임</p>
              <p className="text-[0.9rem] font-bold text-[#3B3D40]">
                이터널 선샤인 (Eternal Sunshine of the Spotless M…)
              </p>
            </div>

            {/* 참여 인원 + 태그 */}
            <div className="flex flex-wrap items-center gap-2 mt-3">

              {/* 참여 인원 */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F2F4F8] text-[#3B3D40] text-[0.75rem]">
                <img src="/icons/people.svg" className="w-4 h-4" />
                1/4
              </div>

              {/* 태그 */}
              <span className="px-2 py-1 bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md">
                용서
              </span>

              <span className="px-2 py-1 bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md">
                기억
              </span>
            </div>
          </div>

          {/*2번째*/}
          <div className="w-full bg-white rounded-[1rem] shadow-[0px_2px_19px_rgba(0,0,0,0.10)] p-6 my-[1rem] relative">

            {/* 따옴표 + 문장(오른쪽 따옴표는 마지막 줄 끝) */}
              <div className="relative w-full ml-[-0.2rem] flex items-start justify-center">

                {/* 왼쪽 따옴표 */}
                <img
                  src="/icons/quote.svg"
                  alt="quote"
                  className="w-[1rem] h-[1rem] opacity-70 mt-[0.5rem] flex-shrink-0 ml-[-0.5rem] mr-2"
                />

                {/* 문장 + 오른쪽 따옴표 absolute */}
                <div className="relative max-w-[14rem] text-center mt-[0.5rem] leading-[1.5]">
                  <p className="text-[1rem] font-medium ml-[-0.1rem] text-gray-800">
                    기억을 지운다는 건 고통을 없애기 위함일까,
                    아니면 다시 사랑하기 위해 자신을 비워내는 행위일까?
                  </p>

                  {/* 오른쪽 따옴표 → 마지막 줄 끝에 자동 정렬 */}
                  <img
                    src="/icons/quote-down.svg"
                    alt="quote close"
                    className="w-[1rem] h-[1rem] opacity-70 absolute right-0 mr-[-1rem] bottom-0 translate-y-[20%]"
                  />
                </div>
              </div>

            {/* 구분선 */}
            <div className="w-full h-[1px] bg-[#E7EBEF] my-4"></div>

            {/* 닉네임 + 영화 제목 */}
            <div>
              <p className="text-[0.75rem] text-[#6B7280] mb-1">익명의 닉네임</p>
              <p className="text-[0.9rem] font-bold text-[#3B3D40]">
                이터널 선샤인 (Eternal Sunshine of the Spotless M…)
              </p>
            </div>

            {/* 참여 인원 + 태그 */}
            <div className="flex flex-wrap items-center gap-2 mt-3">

              {/* 참여 인원 */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F2F4F8] text-[#3B3D40] text-[0.75rem]">
                <img src="/icons/people.svg" className="w-4 h-4" />
                1/4
              </div>

              {/* 태그 */}
              <span className="px-2 py-1 bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md">
                용서
              </span>

              <span className="px-2 py-1 bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md">
                기억
              </span>
            </div>
          </div>
        </div>
          
      <BottomNav />

    </div>
  );
}
