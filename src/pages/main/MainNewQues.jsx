// src/screens/main/SearchResult.jsx (예시 경로)

import React, { useState, useEffect } from "react";
import Navbar from "../../components/main/Navbar";
import BottomNav from "../../components/main/BottomNav";
import { useNavigate, useLocation } from "react-router-dom";
import {
  searchQuestions,
  participateQuestion,
  cancelParticipateQuestion,
} from "../../lib/questionService";
import {
  getLikeStatus,
  likeQuestion,
  unlikeQuestion,
} from "../../lib/likeService";

/* ================= 공통 함수들 ================= */

// 백엔드 상태값 → 화면에 보여줄 한글 라벨로 변환
function getStatusLabel(status, current, max) {
  if (!status) return null;

  switch (status) {
    case "RECRUITING":
      // 모집 중인데 인원이 다 찼으면 진행중처럼 보이게 하고 싶으면 이 if 유지
      if (max && current >= max) return "진행중";
      return "참여 가능";
    case "PROGRESS":
    case "IN_PROGRESS":
      return "진행중";
    case "COMPLETED":
    case "DONE":
      return "종료";
    default:
      return null;
  }
}

// 상태칩 스타일 결정
function getStatusChipClass(label) {
  if (label === "진행중") {
    // 연두색 배경 + 초록 글자
    return "bg-[#F3FFE1] text-[#6BB600]";
  }
  if (label === "종료") {
    // 연회색 배경 + 진회색 글자
    return "bg-[#F3F4F6] text-[#4B5563]";
  }
  // 참여 가능
  return "bg-[#E3F2FF] text-[#1D72FF]"; // 연파랑 배경 + 파랑 글자
}

/* ================= 메인 컴포넌트 ================= */

export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialQuery = location.state?.query || "";
  const initialTags = location.state?.tags || [];

  const [query, setQuery] = useState(initialQuery); // 지금은 안 써도 일단 유지
  const [tags, setTags] = useState(initialTags);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [participate, setParticipate] = useState({});
  const [popup, setPopup] = useState(null);

  const tabs = [
    { name: "NOW", path: "/main" },
    { name: "최신 질문", path: "/main/new" },
    { name: "인기 질문", path: "/main/pop" },
  ];

  // 최신 질문 불러오기
  useEffect(() => {
    const fetchLatestQuestions = async () => {
      setLoading(true);
      try {
        const data = await searchQuestions({
          keyword: "",
          categories: [],
          tags: [],
          page: 0,
          size: 20,
          sortType: "최신순",
        });

        const list = data.content || [];

        const listWithLike = await Promise.all(
          list.map(async (q) => {
            try {
              const likeInfo = await getLikeStatus(q.questionId);
              return {
                ...q,
                likeCount: likeInfo.likeCount,
                likedByMe: likeInfo.likedByMe,
              };
            } catch (e) {
              console.error("좋아요 상태 조회 실패", e);
              return {
                ...q,
                likeCount: 0,
                likedByMe: false,
              };
            }
          })
        );

        setResults(listWithLike);
      } catch (e) {
        console.error("최신 질문 불러오기 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestQuestions();
  }, []);

  // 좋아요 토글
  const toggleLike = async (questionId) => {
    let currentLiked = false;

    // 화면 먼저 반영
    setResults((prev) =>
      prev.map((q) => {
        if (q.questionId === questionId) {
          currentLiked = q.likedByMe;
          return {
            ...q,
            likedByMe: !q.likedByMe,
            likeCount: q.likeCount + (q.likedByMe ? -1 : 1),
          };
        }
        return q;
      })
    );

    try {
      if (currentLiked) {
        await unlikeQuestion(questionId);
      } else {
        await likeQuestion(questionId);
      }
    } catch (e) {
      console.error("좋아요 토글 실패", e);
      // 실패 시 롤백
      setResults((prev) =>
        prev.map((q) => {
          if (q.questionId === questionId) {
            return {
              ...q,
              likedByMe: currentLiked,
              likeCount: q.likeCount + (currentLiked ? 1 : -1),
            };
          }
          return q;
        })
      );
    }
  };

  // 참여 토글
  const toggleParticipate = async (questionId) => {
    const now = !participate[questionId];
    try {
      if (now) {
        const res = await participateQuestion(questionId);
        console.log("참여 성공:", res);
      } else {
        await cancelParticipateQuestion(questionId);
      }
      setParticipate((prev) => ({ ...prev, [questionId]: now }));
      setPopup(now ? "participate" : "cancel");
      setTimeout(() => setPopup(null), 2000);
    } catch (e) {
      console.error("참여 API 실패", e);
      setPopup("error");
      setTimeout(() => setPopup(null), 2000);
    }
  };

  // 태그 삭제 (나중에 검색이랑 다시 연결할 때 사용)
  const handleRemoveTag = (tag) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    if (updated.length === 0) setQuery("");
  };

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <Navbar />

      {/* 탭 메뉴 */}
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
                <span className="absolute mt-[2rem] ml-[0rem] left-0 w-full h-[2px] bg-[#FA502E] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 참여/취소 팝업 */}
      {popup && (
        <div
          className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 
                      w-[100%] max-w-[500px]
                      p-4 z-[200]
                      animate-slide-down"
        >
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#F2F2F2]">
            <div className="flex items-start gap-3">
              <img
                src="/icons/popup-check.svg"
                className="w-[1.2rem] h-[1.2rem] mt-[0.2rem]"
                alt=""
              />

              <div className="flex flex-col">
                <p className="text-[0.875rem] font-bold text-[#3B3D40] leading-[1.4rem]">
                  {popup === "participate"
                    ? "질문 참여가 등록되었습니다"
                    : "참여가 취소되었어요"}
                </p>

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

      {/* 리스트 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-[500px] mx-auto">
        <div className="overflow-y-auto flex-1 px-[2.5rem] mt-[0.5rem] pb-[8rem] scrollbar-hide">
          {loading && (
            <div className="py-6 text-sm text-gray-500">불러오는 중...</div>
          )}

          {!loading &&
            results.map((item) => {
              const statusLabel = getStatusLabel(
                item.questionStatus,
                item.currentParticipants ?? 0,
                item.maxParticipants ?? 0
              );
              const canParticipate = statusLabel === "참여 가능";
              const isParticipating = !!participate[item.questionId];

              return (
                <div
                  key={item.questionId}
                  className="pb-[1.25rem] mb-[1.25rem] cursor-pointer"
                  onClick={() =>
                    navigate("/detail", {
                      state: { questionId: item.questionId, item },
                    })
                  }
                >
                  <img
                    src="/icons/quote.svg"
                    className="w-[1rem] h-[1rem] mt-[0.75rem] opacity-70"
                    alt=""
                  />

                  <p className="text-[1rem] font-medium leading-[1.6rem] mt-[0.5rem]">
                    {item.questionTitle}
                  </p>

                  <p
                    className="text-[0.875rem] text-[#91969A] leading-[1.4rem] mt-[0.5rem] line-clamp-2"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.questionDescription}
                  </p>

                  <img
                    src="/icons/line.svg"
                    className="w-full mt-[0.8rem] mb-[0.5rem]"
                    alt=""
                  />

                  <div className="flex items-center gap-[0.5rem]">
                    <img
                      src="/icons/profile-gray.svg"
                      className="w-[1.5rem] h-[1.5rem]"
                      alt=""
                    />
                    <span className="text-[#9CA3AF] text-[0.85rem]">
                      {item.hostNickname || "익명"}
                    </span>
                  </div>

                  <p className="font-semibold text-[0.9rem] mt-[0.4rem]">
                    {item.contentName}
                  </p>
                  <p className="text-[0.7rem] text-[#555] mt-[0.2rem]">
                    {item.mainCategory && item.subCategory
                      ? `${item.mainCategory} > ${item.subCategory}`
                      : ""}
                  </p>

                  {/* 인원 + 상태 + 태그 */}
                  <div className="flex items-center flex-wrap gap-[0.38rem] mt-[0.75rem]">
                    {/* 인원 */}
                    <div className="flex items-center text-[0.75rem] bg-[#F2F4F8] rounded-md px-[0.4rem] py-[0.2rem]">
                      <img
                        src="/icons/people.svg"
                        className="w-[1rem] h-[1rem] mr-[0.25rem]"
                        alt=""
                      />
                      {`${item.currentParticipants ?? 0}/${item.maxParticipants}`}
                    </div>

                    {/* 상태칩 */}
                    {statusLabel && (
                      <span
                        className={`px-[0.5rem] py-[0.25rem] text-[0.75rem] rounded-md ${getStatusChipClass(
                          statusLabel
                        )}`}
                      >
                        {statusLabel}
                      </span>
                    )}

                    {/* 태그들 */}
                    {item.tagNames?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-[0.5rem] py-[0.25rem] bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 좋아요 + 참여/대화 버튼 */}
                  <div className="flex justify-between items-center mt-[0.8rem]">
                    {/* 좋아요 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(item.questionId);
                      }}
                      className="flex items-center gap-[0.25rem]"
                    >
                      <img
                        src={
                          item.likedByMe
                            ? "/icons/heart-filled.svg"
                            : "/icons/heart.svg"
                        }
                        className="w-[1rem] h-[1rem]"
                        alt=""
                      />
                      <span className="text-[0.875rem] text-[#6B7280]">
                        {item.likeCount ?? 0}
                      </span>
                    </button>

                    {/* 참여 가능 → 참여하기 / 나머지 → 대화 보기 */}
                    {canParticipate ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleParticipate(item.questionId);
                        }}
                        className={`px-[1rem] py-[0.4rem] rounded-md text-[0.875rem] font-medium ${
                          isParticipating
                            ? "bg-[#B5BBC1] text-white"
                            : "bg-[#FA502E] text-white"
                        }`}
                      >
                        {isParticipating ? "참여 취소" : "참여하기"}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/detail", {
                            state: { questionId: item.questionId, item },
                          });
                        }}
                        className="px-[1rem] py-[0.4rem] rounded-md text-[0.875rem] font-medium bg-[#54575C] text-white"
                      >
                        대화 보기
                      </button>
                    )}
                  </div>

                  <div className="w-[30rem] h-[0.5rem] bg-[#F2F4F8] ml-[-2.5rem] mt-[1.5rem]" />
                </div>
              );
            })}

          {!loading && results.length === 0 && (
            <div className="py-6 text-sm text-gray-400">
              아직 최신 질문이 없어요.
            </div>
          )}
        </div>
      </div>

      {/* 질문하기 버튼 */}
      <button
        className="fixed bottom-[5.5rem] right-[1.5rem] w-[7rem] h-[2.75rem] bg-[#FA502E] text-[#FFFFFF] rounded-[1.5rem] text-[0.875rem] font-medium shadow-md flex items-center justify-center gap-[0.5rem] z-50 border-none outline-none"
        onClick={() => navigate("/question")}
      >
        <img
          src="/icons/question.svg"
          alt="질문"
          className="w-[1rem] h-[1rem]"
        />
        질문하기
      </button>

      <BottomNav />
    </div>
  );
}
