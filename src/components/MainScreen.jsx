import React from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

export default function MainScreen() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FAFAFA] font-[Pretendard] relative pb-20">
      {/* 상단 네비게이션 */}
      <Navbar />

      {/* 탭 메뉴 */}
      <div className="flex w-full justify-around text-[0.95rem] font-medium border-b border-gray-100 bg-white">
        <button className="text-[#FA502E] border-b-2 border-[#FA502E] py-3">
          NOW
        </button>
        <button className="text-gray-500 py-3">추천 질문</button>
        <button className="text-gray-500 py-3">최신 질문</button>
        <button className="text-gray-500 py-3">인기 질문</button>
      </div>

      {/* 🔶 메인 카드 */}
      <div className="w-[21rem] h-[21rem] mt-6 rounded-[1.25rem] overflow-hidden shadow-sm relative bg-gradient-to-r from-[#FF885B] to-[#FA502E]">
        <img
            src="/icons/main-character.svg"
            alt="Main Character"
            className="ml-[1.75rem] mt-[3.25rem] w-[17rem] h-[10rem]"
          />

        <div className=" p-6 text-white rounded-[1.25rem] relative overflow-hidden">
          {/* 텍스트 부분 */}
          <div className="z-10 relative">
            <h2 className="text-lg font-semibold mb-1 leading-snug">
              사이, 이렇게 시작해보세요
            </h2>
            <p className="text-sm opacity-90 leading-snug">
              질문으로 시작하는 대화, 처음이라도 어렵지 않아요.
            </p>
          </div>
          </div>

          {/* 페이지 표시 (1/3+) */}
          <div className="absolute bottom-4 right-4 bg-white/30 px-3 py-[3px] rounded-full text-[0.75rem] font-medium">
            1 / 3 +
        </div>
      </div>

      {/* 🔸 섹션 1 */}
      <div className="w-full px-5 mt-8 flex justify-between items-center">
        <h3 className="text-[1rem] font-semibold">
          연휴 사이 대화하기 좋은 질문들
        </h3>
        <span className="text-[#999] text-sm">{'>'}</span>
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
