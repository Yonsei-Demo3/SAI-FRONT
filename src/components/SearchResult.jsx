import React from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useNavigate, useLocation } from "react-router-dom";

export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = location.state?.query || ""; // ✅ 전달된 검색어 받기

  const results = [
    {
      id: 1,
      question:
        "기억을 지운다는 건 고통을 없애기 위함일까, 아니면 다시 사랑하기 위해 자신을 비워내는 행위일까?",
      description:
        "아픈 기억이 사라지면 편해질 것 같지만, 그 기억이 사라지면 지금의 나도 조금 달라질 것 같다는 생각이 들어요.",
      bookTitle: "이터널 선샤인 (Eternal Sunshine of the Spotless Mind)",
      category: ["사랑", "기억"],
      likes: 20,
      participants: "1/4",
    },
    {
      id: 2,
      question: "용서란 상대를 위한 걸까, 나를 위한 걸까?",
      description:
        "용서는 결국 내 마음의 짐을 덜기 위한 선택일지도 모르겠다는 생각이 들었거든요. 상대를 완전히 이해하지 못하더라도요.",
      bookTitle: "리틀 라이프",
      category: ["용서", "기억"],
      likes: 20,
      participants: "3/5",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <Navbar />

      {/* ✅ 전체 영역 - 검색창 고정, 밑은 스크롤 */}
      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-[500px] mx-auto">
        {/* 🔍 검색창 (고정) */}
        <div className="px-[2.5rem] mt-[1.38rem] bg-white z-30">
          <div className="relative flex items-center bg-[#F2F4F8] rounded-[0.75rem] h-[2.5rem] px-3">
            <img
              src="/icons/search.svg"
              alt="검색"
              className="w-[1.5rem] h-[1.5rem] ml-[0.94rem] opacity-60"
            />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={query} // ✅ 사용자가 입력한 검색어 표시
              readOnly // ✅ 여기선 수정 불가능 (필요하면 제거 가능)
              className="bg-transparent flex-1 ml-[0.25rem] text-[1rem] placeholder-[#9CA3AF] text-[#333] outline-none border-none"
            />
          </div>
        </div>

        {/* ✅ 스크롤 가능한 결과 영역 */}
        <div
          className="overflow-y-auto flex-1 px-[2.5rem] mt-[1rem] pb-[8rem] scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
          `}</style>

          {results.map((item) => (
            <div
              key={item.id}
              className="pb-[1.25rem] mb-[1.25rem]"
            >
              {/* ✅ 따옴표 아이콘 */}
              <img
                src="/icons/quote.svg"
                alt="따옴표"
                className="w-[1rem] h-[1rem] opacity-70"
              />

              {/* 질문 */}
              <p className="text-[1rem] font-medium text-[#000000] leading-[1.6rem] mb-[0.5rem]">
                {item.question}
              </p>

              {/* 내용 (2줄까지만 표시) */}
              <p
                className="text-[0.875rem] text-[#91969A] leading-[1.4rem] mb-[0.75rem] line-clamp-2 overflow-hidden text-ellipsis"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.description}
              </p>


              {/* 책 정보 */}
              <div className="flex flex-col text-[0.875rem] text-[#6B7280] mb-[0.5rem]">
                <img
                    src="/icons/line.svg"
                    alt="구분선"
                    className="w-[17.9375rem] h-[0.5rem] mt-[0.25rem] mb-[0.75rem] "
                  />
                <div className="flex items-center gap-[0.5rem] mb-[0.25rem]">
                  <img
                    src="/icons/profile-gray.svg"
                    alt="프로필"
                    className="w-[1.5rem] h-[1.5rem]"
                  />
                  <span className="text-[#9CA3AF]">익명의 사자</span>
                </div>

                <span className="font-medium text-[0.75rem] mt-[0.25rem] mb-[0.25rem] text-[#000000]">
                  {item.bookTitle}
                </span>
                <div className="flex items-center">
                  <span className="text-[0.625rem] text-[#000000]">도서</span>
                  <img
                    src="/icons/arrow-right.svg"
                    alt="주제"
                    className="w-[0.5rem] h-[0.5rem] ml-[0.25rem]"
                  />
                  <span className="ml-[0.2rem] text-[0.625rem] text-[#000000]">
                    소설
                  </span>
                </div>
              </div>

              {/* 태그 + 참여인원 */}
              <div className="flex items-center flex-wrap gap-[0.38rem] mb-[0.5rem]">
                {/* 참여 인원 */}
                <div className="flex items-center gap-[0.25rem] text-[0.75rem] text-[#6B7280] bg-[#F2F4F8] rounded-[0.25rem] px-[0.4rem] py-[0.2rem]">
                  <img
                    src="/icons/people.svg"
                    alt="참여인원"
                    className="w-[1rem] h-[1rem]"
                  />
                  <span>{item.participants}</span>
                </div>

                {/* 태그 */}
                {item.category.map((tag, j) => (
                  <span
                    key={j}
                    className="px-[0.5rem] py-[0.25rem] bg-[#FFF2EE] mt-[0.25rem] text-[#FA502E] text-[0.75rem] rounded-[0.25rem]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 하단 버튼 및 좋아요 */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[0.25rem] text-[#6B7280] text-[0.875rem]">
                  <img
                    src="/icons/heart.svg"
                    alt="좋아요"
                    className="w-[1rem] h-[1rem]"
                  />
                  <span>{item.likes}</span>
                </div>

                <button
                  onClick={() => navigate(`/question/${item.id}`)}
                  className="px-[1rem] py-[0.4rem] bg-[#FA502E] text-[#FFFFFF] text-[0.875rem] rounded-[0.5rem] no-underline select-none font-medium border-none outline-none"
                >
                  참여하기
                </button>
              </div>
              <div className="w-[23.44rem] h-[0.5rem] bg-[#F2F4F8] ml-[-2.5rem] mt-[1.5rem]"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 질문하기 버튼 */}
      <button
        className="fixed bottom-[5.5rem] right-[1.5rem] w-[7rem] h-[2.75rem] bg-[#FA502E] text-[#FFFFFF] rounded-[1.5rem] text-[0.875rem] font-medium shadow-md flex items-center justify-center gap-[0.5rem] z-50 border-none outline-none"
        onClick={() => navigate("/question")}
      >
        <img src="/icons/question.svg" alt="질문" className="w-[1rem] h-[1rem]" />
        질문하기
      </button>

      <BottomNav />
    </div>
  );
}
