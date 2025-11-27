// src/screens/mypage/MyPageQuesScreen.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";
import MyPageNav from "../../components/mypage/MyPageNav";
import { getMyQuestions } from "../../lib/questionService";
import {
  getLikeStatus,
  likeQuestion,
  unlikeQuestion,
} from "../../lib/likeService";

// 🔹 상태 라벨: 모집중 / 진행중 / 종료
function getStatusLabel(status, current, max) {
  if (!status) return null;
  const s = String(status).toUpperCase();

  switch (s) {
    case "RECRUITING":
      // 아직 자리가 남아 있는 모집 중
      if (max && current >= max) return "진행중";
      return "모집중";

    case "PROGRESS":
    case "ACTIVE":
    case "READY_CHECK": // ready_check 도 진행중으로
      return "진행중";

    case "COMPLETED":
    case "DONE":
    case "FINISHED":
      return "종료";

    default:
      return null;
  }
}

// 🔹 라벨별 칩 색상
function getStatusChipClass(label) {
  if (label === "모집중") {
    return "bg-[#E3F2FF] text-[#1D72FF]";
  }
  if (label === "진행중") {
    return "bg-[#F3FFE1] text-[#6BB600]";
  }
  if (label === "종료") {
    return "bg-[#F3F4F6] text-[#4B5563]";
  }
  return "bg-[#F2F4F8] text-[#4B5563]";
}

export default function MyPageQuesScreen() {
  const navigate = useNavigate();

  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================== 내 질문 불러오기 ==================
  useEffect(() => {
    const fetchMyQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const list = await getMyQuestions();

        const withLike = await Promise.all(
          list.map(async (q) => {
            try {
              const likeInfo = await getLikeStatus(q.questionId);

              return {
                id: q.questionId,
                questionTitle: q.questionTitle,
                questionDescription: q.questionDescription,
                hostNickname: q.hostNickname,
                contentName: q.contentName,
                mainCategory: q.mainCategory,
                subCategory: q.subCategory,
                participantCount: q.currentParticipants,
                maxParticipants: q.maxParticipants,
                questionStatus: q.questionStatus,      // 🔥 상태 그대로 보관
                tags: q.tagNames || [],
                likeCount: likeInfo.likeCount,
                likedByMe: likeInfo.likedByMe,
                createdAt: q.createdAt,
              };
            } catch (e) {
              console.error("좋아요 상태 조회 실패", e);
              return {
                id: q.questionId,
                questionTitle: q.questionTitle,
                questionDescription: q.questionDescription,
                hostNickname: q.hostNickname,
                contentName: q.contentName,
                mainCategory: q.mainCategory,
                subCategory: q.subCategory,
                participantCount: q.currentParticipants,
                maxParticipants: q.maxParticipants,
                questionStatus: q.questionStatus,
                tags: q.tagNames || [],
                likeCount: 0,
                likedByMe: false,
                createdAt: q.createdAt,
              };
            }
          })
        );

        setQuestions(withLike);
      } catch (e) {
        console.error("내 질문 목록 불러오기 실패", e);
        setError("질문 목록을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuestions();
  }, []);

  // ================== 정렬 ==================
  const sortedQuestions = useMemo(() => {
    const arr = [...questions];
    arr.sort((a, b) => {
      const da = new Date(a.createdAt);
      const db = new Date(b.createdAt);
      return sortType === "최신순" ? db - da : da - db;
    });
    return arr;
  }, [questions, sortType]);

  // ================== 좋아요 토글 ==================
  const handleToggleLike = async (questionId) => {
    let currentLiked = false;

    // 낙관적 업데이트
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
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
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
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

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <MyPageNav />

      {/* 정렬 버튼 */}
      <div className="flex justify-end items-center px-[1.5rem] mt-[1.25rem]">
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
            <div className="absolute right-0 mt-2 w-[4.5rem] bg-white rounded-[0.25rem] shadow-lg z-50">
              <button
                className="w-full text-right px-3 py-2 text-xs text-[#B5BBC1]"
                onClick={() => {
                  setSortType("최신순");
                  setSortOpen(false);
                }}
              >
                최신순
              </button>
              <button
                className="w-full text-right px-3 py-2 text-xs text-[#B5BBC1]"
                onClick={() => {
                  setSortType("오래된순");
                  setSortOpen(false);
                }}
              >
                오래된순
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[7rem] no-scrollbar">
        {loading && (
          <p className="mt-4 text-center text-[0.875rem] text-[#9CA3AF]">
            불러오는 중...
          </p>
        )}
        {error && (
          <p className="mt-4 text-center text-[0.875rem] text-red-500">
            {error}
          </p>
        )}
        {!loading && !error && sortedQuestions.length === 0 && (
          <p className="mt-4 text-center text-[0.875rem] text-[#9CA3AF]">
            등록한 질문이 없어요.
          </p>
        )}

        {!loading &&
          !error &&
          sortedQuestions.map((q) => {
            const current = q.participantCount ?? 0;
            const max = q.maxParticipants ?? 0;
            const statusLabel = getStatusLabel(
              q.questionStatus,
              current,
              max
            );

            return (
              <div
                key={q.id}
                className="bg-white rounded-[1rem] shadow-[0px_4px_20px_rgba(0,0,0,0.06)] mb-[1rem] py-[0.25rem] cursor-pointer"
                onClick={() =>
                  navigate("/detail", {
                    state: { questionId: q.id },
                  })
                }
              >
                {/* 질문 문장 */}
                <div className="relative w-full flex px-[1.5rem] mt-[0.5rem] items-start">
                  <img
                    src="/icons/quote.svg"
                    alt="quote"
                    className="w-[1rem] h-[1rem] opacity-70 mt-[0.5rem] flex-shrink-0"
                  />
                </div>
                <div className="relative text-left mt-[0.5rem] leading-[1.5] px-[1.5rem]">
                  <p className="text-[1rem] font-medium text-[#191D1F]">
                    {q.questionTitle}
                  </p>

                  <p className="text-[0.875rem] text-[#6B7280] mt-[0.5rem] mb-[0.75rem]">
                    {q.questionDescription}
                  </p>
                </div>

                {/* 구분선 */}

                {/* 닉네임 + 콘텐츠명 */}
                <div className="flex flex-col px-[1.5rem] gap-[0.2rem]">
                                  <div className="w-full h-[1px] px-[1.5rem] bg-[#E7EBEF] my-4" />

                  <p className="text-[0.75rem] text-[#6B7280]">
                    {q.hostNickname}
                  </p>
                  <p className="text-[0.75rem] text-[#9CA3AF]">
                    {q.mainCategory} &gt; {q.subCategory}
                  </p>
                  <p className="text-[0.9rem] font-bold text-[#3B3D40] mt-[0.1rem]">
                    {q.contentName}
                  </p>
                </div>

                {/* 인원 + 상태 + 태그 */}
                <div className="flex flex-wrap items-center px-[1.5rem] gap-2 mt-3">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F2F4F8] text-[#3B3D40] text-[0.75rem]">
                    <img src="/icons/people.svg" className="w-4 h-4" />
                    {current}/{max}
                  </div>

                  {statusLabel && (
                    <span
                      className={`px-2 py-1 text-[0.75rem] rounded-md ${getStatusChipClass(
                        statusLabel
                      )}`}
                    >
                      {statusLabel}
                    </span>
                  )}

                  {q.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 하트 버튼 */}
                <div className="flex items-center justify-between px-[1.5rem] mt-4 mb-[2rem]">
                  <button
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation(); // 카드 클릭 막기
                      handleToggleLike(q.id);
                    }}
                  >
                    <img
                      src={
                        q.likedByMe
                          ? "/icons/heart-filled.svg"
                          : "/icons/heart.svg"
                      }
                      className="w-5 h-5"
                      alt=""
                    />
                    <span className="text-[0.9rem] text-[#3B3D40]">
                      {q.likeCount}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
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
