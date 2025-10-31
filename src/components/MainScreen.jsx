import React from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

export default function MainScreen() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FAFAFA] font-[Pretendard] pb-20">
      {/* 상단 네비게이션 */}
      <Navbar />

      {/* 🔶 메인 카드 */}
      <div className="w-[21rem] h-[21rem] mt-[1.5rem] rounded-[1.25rem] overflow-hidden shadow-sm relative bg-gradient-to-b from-[#FFDAC0] to-[#FA502E]">
        <img
          src="/icons/main-character.svg"
          alt="Main Character"
          className="ml-[1.75rem] mt-[3.25rem] w-[17.5rem] h-[10rem]"
        />

        <div className="p-6 text-white rounded-[1.25rem] relative overflow-hidden">
          {/* 텍스트 부분 */}
          <div className="z-10 relative font-Pretendard text-[#FFFFFF] ml-[1.75rem] mt-[-0.5rem]">
            <h2 className="text-[1.5rem] font-700 leading-[1] mb-[0.5rem]">
              사이, 이렇게 시작해보세요
            </h2>
            <p className="text-[0.875rem] font-700 leading-[1.5]">
              질문으로 시작하는 대화,<br />
              처음이라도 어렵지 않아요.
            </p>
          </div>
        </div>

        {/* 페이지 표시 (정지버튼 + 1/3+) */}
        <div className="absolute mt-[-1rem] right-4 flex items-center gap-2">
            {/* 정지버튼 */}
            <img
            src="/icons/pause.svg"
            alt="정지"
            className="w-[1.375rem] h-[1.375rem] ml-[15rem] "
            />

            {/* 페이지 텍스트 */}
            <div className="flex items-center justify-center ml-[0.25rem] bg-[rgba(59,61,64,0.70)] text-[#FFFFFF] text-[0.75rem] w-[3.375rem] h-[1.375rem] rounded-full leading-none">
                <span className="font-[700] ml-[0.5rem] mt-[-0.12rem]">1</span>
                <span className="font-[400] ml-[0.12rem] mt-[-0.12rem]">/ </span>
                <span className="font-[400] ml-[0.12rem] mt-[-0.12rem]">3</span>
                <img
                src="/icons/plus.svg"
                alt="plus"
                className="w-[0.55rem] h-[0.55rem] ml-[0.25rem] mr-[0.25rem] mt-[0.12rem]"
                />
            </div>
        </div>

      </div>

      {/* 🔸 섹션 1 */}
      <div className="w-full px-5 mt-8 flex justify-between items-center">
        <h3 className="text-[1rem] ml-[1.5rem] font-semibold">
          연휴 사이 대화하기 좋은 질문들
        </h3>
            <img
            src="/icons/next.svg"
            alt="plus"
            className="w-[0.875rem] h-[1.75rem] mr-[1.5rem] mt-[0.12rem]"
            />
      </div>

      <div className="w-[21rem] bg-white rounded-xl shadow-sm p-4 mt-3 border border-gray-100">
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          “기억을 지운다는 건 고통을 없애기 위함일까, 아니면 다시 사랑하기 위해 자신을
          비워내는 행위일까?”
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">익명의 닉네임</p>
            <p className="text-xs font-medium text-gray-700">
              이터널 선샤인 (Eternal Sunshine)
            </p>
          </div>
          <button className="bg-[#FA502E] text-white text-sm px-3 py-1.5 rounded-md">
            대화 참여하기
          </button>
        </div>
      </div>

      {/* 🔸 섹션 2 */}
      <div className="w-full px-5 mt-8 flex flex-col gap-2">
        <h3 className="text-[1rem] font-semibold">대화 사이에 머문 하이라이트</h3>
        <p className="text-[0.8rem] text-gray-400">
          다른 회원들이 하이라이트로 저장한 문장을 만나보세요.
        </p>
      </div>

      <div className="w-[21rem] bg-white shadow-sm rounded-xl p-4 mt-3 border border-gray-100">
        <p className="text-sm text-gray-700 leading-relaxed mb-2">
          “기억을 지운다는 건 고통을 없애기 위함일까, 아니면 다시 사랑하기 위해 자신을
          비워내는 행위일까?”
        </p>
        <p className="text-xs text-gray-500 mb-3 leading-snug">
          AI가 기억을 없애주는 게 꼭 나쁜 건 아닐 수도 있겠죠. 고통이 줄어드니까요. 하지만
          후회나 성장의 감정도 함께 사라질 거예요. 그렇다면 결국 ‘나’라는 사람이 점점
          비워지는 게 아닐까요?
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">익명의 사자</p>
            <p className="text-xs text-gray-400">하이라이트 • 5일 전</p>
          </div>
          <button className="bg-[#FA502E] text-white text-sm px-4 py-1.5 rounded-md shadow-md">
            질문하기
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}
