import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";

export default function MyPageScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">

      {/* 상단 타이틀 */}
      <div className="px-[1.5rem] mt-[1.5rem] flex justify-between items-center">
        <h1 className="text-[1.5rem] font-bold">마이페이지</h1>
        <img
          src="/icons/setting.svg"
          className="w-[1.5rem] h-[1.5rem]"
          alt="설정"
        />
      </div>

      {/* 메인 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto w-full max-w-[500px] mx-auto pb-[6rem]">

        {/* 프로필 */}
        <div className="px-[1.5rem] mt-[1.5rem] flex items-center gap-[1rem]">
          <div className="relative">
            <img
              src="/icons/profile-avatar.svg"
              alt="프로필"
              className="w-[4.5rem] h-[4.5rem] rounded-full"
            />
            <img
              src="/icons/edit.svg"
              alt="편집"
              className="absolute bottom-0 right-0 w-[1.4rem] h-[1.4rem]"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-[1.25rem] font-semibold">멋쟁이 사자</p>
            <p className="text-[0.875rem] text-[#6B7280] mt-[0.25rem]">
              팔로워 5 | 팔로잉 12
            </p>
          </div>
        </div>

        {/* 카운트 영역 - 클릭으로 이동 가능 */}
        <div className="flex justify-around mt-[1.75rem] px-[1.5rem] text-center">
          <button>
            <p className="text-[1.25rem] font-semibold">5</p>
            <p className="text-[0.875rem] text-[#6B7280]">질문</p>
          </button>

          <button onClick={() => navigate("/mypage/chats")}>
            <p className="text-[1.25rem] font-semibold">13</p>
            <p className="text-[0.875rem] text-[#6B7280]">대화</p>
          </button>

          <button>
            <p className="text-[1.25rem] font-semibold">1.2k</p>
            <p className="text-[0.875rem] text-[#6B7280]">저장</p>
          </button>

          <button onClick={() => navigate("/mypage/scrap")}>
            <p className="text-[1.25rem] font-semibold">120</p>
            <p className="text-[0.875rem] text-[#6B7280]">스크랩</p>
          </button>
        </div>

        {/* 회색 구분선 */}
        <div className="w-full h-[0.5rem] bg-[#F2F4F8] mt-[1.75rem]"></div>

        {/* 최근 대화 헤더 */}
        <div className="px-[1.5rem] mt-[1.75rem] flex justify-between items-center">
          <p className="text-[1.25rem] font-semibold">최근 대화</p>
          <button
            className="text-[#9CA3AF] text-[0.875rem]"
            onClick={() => navigate("/mypage/chats")}
          >
            전체보기
          </button>
        </div>

        {/* 최근 대화 카드 */}
        <div>
          <div className="bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.08)] rounded-[1rem] p-5 relative">
            {/* 텍스트 영역 + 배경 이미지 */}
            <div className="relative pr-[5rem] h-[7.875rem]">

              {/* 우측 썸네일 */}
              <img
                src="/icons/sample1.svg"
                alt="썸네일"
                className="w-[4.125rem] h-[5.5rem] rounded-lg absolute right-[1rem] top-[1.25rem] z-50"
              />
            
              {/* 배경 이미지 (투명도 5%) */}
              <img
                src="/icons/sample1.svg"
                className="absolute inset-0 w-full h-full object-cover opacity-5 rounded-t-[0.5rem] rounded-b-[0rem]"
              />

              {/* 회색 오버레이 (30%) */}
              <div className="absolute inset-0 bg-[#B5BBC1] opacity-30 rounded-t-[0.5rem] rounded-b-[0rem]"></div>

              {/* 내용 (위에 올라오는 텍스트) */}
              <div className="relative z-10 p-3 px-[1.5rem]">
                <p className="text-[0.625rem] text-[#9CA3AF]">대분류 / 소분류</p>

                <p className="mt-[0.25rem] text-[0.875rem] font-semibold leading-[1.4rem] line-clamp-2">
                  챗GPT에 중독된 직장인들의 미래를 알 수 있는 SF 소설 독서모임 | 가즈오 이시구로 [클라라와 태양]
                </p>

                <div className="flex items-center gap-[0.25rem] mt-[0.5rem] text-[0.75rem] text-[#6B7280]">
                  <div className="flex items-center text-[0.75rem] bg-[#F2F4F8] rounded-md px-[0.4rem] py-[0.2rem]">
                    <img src="/icons/people.svg" className="w-[1rem] h-[1rem]" />
                    <span className="ml-[0.25rem]">4</span>
                  </div>
                  <p className="ml-[0.5rem] text-[0.75rem]">함께한 질문</p>
                  <p className="text-[0.75rem] font-bold">4</p>
                  <p className="text-[0.75rem]">|</p>
                  <p className="text-[0.75rem]">저장한 대화</p>
                  <p className="text-[0.75rem] font-bold">12</p>
                </div>
              </div>
            </div>


            {/* 인용문 */}
            <div className="relative w-full mt-[1.25rem] px-[2.75rem]">

              {/* 여는 따옴표 */}
              <img
                src="/icons/quote.svg"
                className="w-[1rem] opacity-70 absolute left-[1rem] top-0"
              />

              {/* 본문 */}
              <p className="text-[0.75rem] text-[#6B7280] leading-[1.4rem]">
                민음사 영상을 보면서 나도 여기에 껴서 이야기 나눠보고 싶다는 생각이
                있었는데 그걸 이룬 느낌이라 좋았다. 클라라에 대한 다양한 의견을
                들을 수 있었다.
              </p>

              {/* 닫는 따옴표 */}
              <img
                src="/icons/quote-down.svg"
                className="w-[1rem] opacity-70 absolute right-[1rem] bottom-0"
              />
            </div>


            <img src="/icons/line.svg" className="w-[17.9375rem] mt-[0.8rem] mb-[0.5rem]" />


            {/* Q1, Q2 */}
            <div className="mt-[1.25rem] flex flex-col gap-[0.75rem]">
              <div className="flex items-center gap-[0.5rem]">
                <span className="text-[#FA502E] font-bold border border-[#FA502E] rounded-[0.5rem] px-[0.5rem]">Q1</span>
                <p className="text-[0.75rem]">최근에 재미있게 본 SF물은?</p>
              </div>
              <div className="flex items-center gap-[0.5rem]">
                <span className="text-[#FA502E] font-bold border border-[#FA502E] rounded-[0.5rem] px-[0.5rem] mt-[-0.5rem]">Q2</span>
                <span className="text-[0.75rem] leading-[1.4rem] mt-[0.5rem]">
                  인간이 믿음을 갖는 이유는 무엇인가? 그 믿음은 삶과 우리 사회에 어떤 힘을 주는가?
                </span>
              </div>
            </div>

            {/* 펼치기 버튼 */}
            <div className="flex justify-center mt-[0.75rem]">
              <img src="/icons/arrow-down.svg" className="w-[1.5rem] h-[1rem]" />
            </div>

          </div>
        </div>
      </div>

      {/* 질문하기 버튼 */}
      <button
        className="fixed bottom-[5.5rem] right-[1.5rem] w-[7rem] h-[2.75rem] bg-[#FA502E] text-white rounded-[1.5rem] text-[0.875rem] font-medium shadow-md flex items-center justify-center gap-[0.5rem] z-50"
      >
        <img src="/icons/question.svg" className="w-[1rem] h-[1rem]" />
        질문하기
      </button>

      <BottomNav />
    </div>
  );
}
