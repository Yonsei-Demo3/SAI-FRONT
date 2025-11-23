import React, { useState } from "react";
import Navbar from "../../components/main/Navbar";
import BottomNav from "../../components/main/BottomNav";
import { useNavigate, useLocation } from "react-router-dom";

export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달받은 값
  const initialQuery = location.state?.query || "";
  const initialTags = location.state?.tags || [];

  const [query, setQuery] = useState(initialQuery);
  const [tags, setTags] = useState(initialTags);

  // 상태
  const [likes, setLikes] = useState({});
  const [participate, setParticipate] = useState({});
  const [popup, setPopup] = useState(null);

    const tabs = [
    { name: "NOW", path: "/main" },
    { name: "최신 질문", path: "/main/new" },
    { name: "인기 질문", path: "/main/pop" },
  ];

  const results = [
    {
      id: 1,
      question:
        "기억을 지운다는 건 고통을 없애기 위함일까, 아니면 다시 사랑하기 위해 자신을 비워내는 행위일까?",
      description:
        "아픈 기억이 사라지면 편해질 것 같지만, 그 기억이 사라지면 지금의 나도 조금 달라질 것 같다는 생각이 들어요.",
      bookTitle: "이터널 선샤인",
      categoryPath: "도서 > 소설",
      category: ["사랑", "기억"],
      likes: 20,
      participants: "1/4",
    },
    {
      id: 2,
      question: "용서란 상대를 위한 걸까, 나를 위한 걸까?",
      description:
        "용서는 결국 내 마음의 짐을 덜기 위한 선택일지도 모르겠다는 생각이 들었어요.",
      bookTitle: "리틀 라이프",
      categoryPath: "도서 > 소설",
      category: ["용서", "기억"],
      likes: 20,
      participants: "3/5",
    },
  ];

  // ❤️ 하트 토글
  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ✨ 참여하기 토글 + 팝업
  const toggleParticipate = (id) => {
    const now = !participate[id];
    setParticipate((prev) => ({ ...prev, [id]: now }));

    setPopup(now ? "participate" : "cancel");

    setTimeout(() => setPopup(null), 2000); // ⏳ 2초 뒤 자동 닫힘
  };

  // 태그 삭제
  const handleRemoveTag = (tag) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);

    if (updated.length === 0) setQuery("");
  };

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <Navbar />

              {/* 🔶 탭 메뉴 */}
        <div className="flex justify-start px-[1.5rem] w-full bg-white gap-x-[2.25rem]">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;

            return (
              <button
                key={tab.name}
                onClick={() => navigate(tab.path)}
                className={`relative flex flex-col items-center justify-center h-[2.5rem] bg-transparent border-none outline-none pb-2 text-[0.9rem] transition-colors duration-200 ${
                  active ? "text-black font-medium-bold" : "text-black"
                }`}
              >
                {tab.name}

                {active && (
                  <span className="absolute mt-[2rem] ml-[0rem] left-0 w-full h-[2px] bg-[#FA502E] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

      {/* ------------------------------- */}
      {/* ⭐ 팝업 (사진과 동일한 디자인) */}
      {/* ------------------------------- */}
      {popup && (
            <div className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 
                            w-[100%] max-w-[500px]
                            p-4 z-[200]
                            animate-slide-down">

          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#F2F2F2]">
            <div className="flex items-start gap-3">

              <img
                src="/icons/popup-check.svg"
                className="w-[1.2rem] h-[1.2rem] mt-[0.2rem]"
                alt=""
              />

              <div className="flex flex-col">
                {/* 제목 */}
                <p className="text-[0.875rem] font-bold text-[#3B3D40] leading-[1.4rem]">
                  {popup === "participate"
                    ? "질문 참여가 등록되었습니다"
                    : "참여가 취소되었어요"}
                </p>

                {/* 설명 */}
                <p className="text-[0.75rem] text-[#3B3D40] leading-[1.3rem] mt-[0.25rem] whitespace-pre-line">
                  {popup === "participate"
                    ? "대화 인원이 모두 모이면 알려드릴게요.\n알림을 받으면 30초 안에 ‘준비 완료’를 눌러 참여할 수 있습니다."
                    : "다시 참여하려면 ‘참여하기’를 눌러주세요."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ------------------------------- */}
      {/* 검색창 */}
      {/* ------------------------------- */}
      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-[500px] mx-auto">
        {/* ------------------------------- */}
        {/* 결과 리스트 */}
        {/* ------------------------------- */}
        <div className="overflow-y-auto flex-1 px-[2.5rem] mt-[0.5rem] pb-[8rem] scrollbar-hide">
          {results.map((item) => (
            <div 
              key={item.id} 
              className="pb-[1.25rem] mb-[1.25rem] cursor-pointer"
              onClick={() => navigate("/detail", {state: {item} })}
            >

              <img src="/icons/quote.svg" className="w-[1rem] h-[1rem] mt-[0.75rem] opacity-70" />

              <p className="text-[1rem] font-medium leading-[1.6rem] mt-[0.5rem]">
                {item.question}
              </p>

              <p
                className="text-[0.875rem] text-[#91969A] leading-[1.4rem] mt-[0.5rem] line-clamp-2"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.description}
              </p>

              <img src="/icons/line.svg" className="w-full mt-[0.8rem] mb-[0.5rem]" />

              <div className="flex items-center gap-[0.5rem]">
                <img src="/icons/profile-gray.svg" className="w-[1.5rem] h-[1.5rem]" />
                <span className="text-[#9CA3AF] text-[0.85rem]">익명의 사자</span>
              </div>

              <p className="font-semibold text-[0.9rem] mt-[0.4rem]">{item.bookTitle}</p>
              <p className="text-[0.7rem] text-[#555] mt-[0.2rem]">{item.categoryPath}</p>

              <div className="flex items-center flex-wrap gap-[0.38rem] mt-[0.75rem]">
                <div className="flex items-center text-[0.75rem] bg-[#F2F4F8] rounded-md px-[0.4rem] py-[0.2rem]">
                  <img src="/icons/people.svg" className="w-[1rem] h-[1rem] mr-[0.25rem]" />
                  {item.participants}
                </div>

                {item.category.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-[0.5rem] py-[0.25rem] bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-[0.8rem]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                    className="flex items-center gap-[0.25rem]"
                  >
                  <img
                    src={
                      likes[item.id]
                        ? "/icons/heart-filled.svg"
                        : "/icons/heart.svg"
                    }
                    className="w-[1rem] h-[1rem]"
                  />
                  <span className="text-[0.875rem] text-[#6B7280]">
                    {item.likes + (likes[item.id] ? 1 : 0)}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleParticipate(item.id);
                  }}
                  className={`px-[1rem] py-[0.4rem] rounded-md text-[0.875rem] font-medium ${
                    participate[item.id] ? "bg-[#B5BBC1] text-white" : "bg-[#FA502E] text-white"
                  }`}
                >
                  {participate[item.id] ? "참여 취소" : "참여하기"}
                </button>
              </div>

              <div className="w-[30rem] h-[0.5rem] bg-[#F2F4F8] ml-[-2.5rem] mt-[1.5rem]"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 질문하기 버튼 */}
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
