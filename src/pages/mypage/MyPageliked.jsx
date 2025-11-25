// src/pages/mypage/MyPageliked.jsx  (파일 이름은 네가 쓰는 거 그대로 쓰면 돼)
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";
import MyPageNav from "../../components/mypage/MyPageNav";
import {
  getMyLikedQuestions,
  likeQuestion,
  unlikeQuestion,
} from "../../lib/likeService";
import {
  getQuestionDetail,
  participateQuestion,
  cancelParticipateQuestion,
} from "../../lib/questionService";

export default function MyPageScrapScreen() {
  const navigate = useNavigate();

  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");

  const [favoriteQuestions, setFavoriteQuestions] = useState([]);
  const [loadingLike, setLoadingLike] = useState(false);
  const [error, setError] = useState(null);

  // 👉 참여 상태 / 팝업
  const [participate, setParticipate] = useState({});
  const [popup, setPopup] = useState(null);

  // ===========================
  // 공통: 상태 라벨 / 칩 스타일 (SearchResult랑 동일)
  // ===========================
  const getStatusLabel = (status, current, max) => {
    if (!status) return null;

    switch (status) {
      case "RECRUITING":
        if (max && current >= max) return "진행중"; // 다 찼으면 진행중 취급
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
  };

  const getStatusChipClass = (label) => {
    if (label === "진행중") {
      return "bg-[#F3FFE1] text-[#6BB600]";
    }
    if (label === "종료") {
      return "bg-[#F3F4F6] text-[#4B5563]";
    }
    // 참여 가능
    return "bg-[#E3F2FF] text-[#1D72FF]";
  };

  // ===========================
  // 좋아요한 질문 목록 불러오기
  // ===========================
  useEffect(() => {
    const fetchLikedQuestions = async () => {
      try {
        setLoadingLike(true);
        setError(null);

        const likedList = await getMyLikedQuestions();
        console.log("liked questions:", likedList);

        const detailed = await Promise.all(
          likedList.map(async (item) => {
            const q = await getQuestionDetail(item.questionId);
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
              questionStatus: q.questionStatus, // 상태 그대로 저장
              tags: q.tagNames || [],
              likeCount: item.likeCount,
              likedByMe: item.likedByMe,
              createdAt: q.createdAt,
            };
          })
        );

        setFavoriteQuestions(detailed);
      } catch (e) {
        console.error("관심 질문 불러오기 실패", e);
        setError("관심 질문을 불러오지 못했어요.");
      } finally {
        setLoadingLike(false);
      }
    };

    fetchLikedQuestions();
  }, []);

  // 정렬
  const sortedFavoriteQuestions = useMemo(() => {
    const arr = [...favoriteQuestions];
    arr.sort((a, b) => {
      const da = new Date(a.createdAt);
      const db = new Date(b.createdAt);
      return sortType === "최신순" ? db - da : da - db;
    });
    return arr;
  }, [favoriteQuestions, sortType]);

  const totalCount = sortedFavoriteQuestions.length;

  // ===========================
  // 좋아요 토글 (취소 시 리스트에서 제거)
  // ===========================
  const handleToggleLikeQuestion = async (questionId) => {
    const target = favoriteQuestions.find((q) => q.id === questionId);
    if (!target) return;

    try {
      if (target.likedByMe) {
        // 이미 좋아요 → 취소 + 목록에서 제거
        await unlikeQuestion(questionId);
        setFavoriteQuestions((prev) => prev.filter((q) => q.id !== questionId));
      } else {
        // 아직 좋아요 아님 → 좋아요 등록
        const res = await likeQuestion(questionId);
        setFavoriteQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  likedByMe: res?.likedByMe ?? true,
                  likeCount: res?.likeCount ?? q.likeCount + 1,
                }
              : q
          )
        );
      }
    } catch (e) {
      console.error("관심 질문 좋아요 토글 실패", e);
      alert("좋아요 처리 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  // ===========================
  // 참여하기 / 취소 (SearchResult와 동일 로직)
  // ===========================
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

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <MyPageNav />

      {/* 참여/취소 팝업 (SearchResult와 동일 형식) */}
      {popup && popup !== "error" && (
        <div className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 w-[100%] max-w-[500px] p-4 z-[200] animate-slide-down">
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

      {/* 전체 개수 + 정렬 버튼 */}
      <div className="flex justify-between px-[1.5rem] mt-[1.25rem] items-center">
        <p className="text-[0.75rem] ml-[0.5rem] text-[#191D1F]">
          전체 {totalCount}
        </p>
        <div className="flex justify-end items-center">
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
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[7rem] no-scrollbar">
        {loadingLike ? (
          <p className="mt-4 text-start px-[0.5rem] text-[0.875rem] text-[#9CA3AF]">
            관심 질문을 불러오는 중이에요...
          </p>
        ) : error ? (
          <p className="mt-4 text-start px-[0.5rem] text-[0.875rem] text-red-500">
            {error}
          </p>
        ) : sortedFavoriteQuestions.length === 0 ? (
          <p className="mt-4 text-start px-[0.5rem] text-[0.875rem] text-[#9CA3AF]">
            아직 관심 질문이 없어요.
          </p>
        ) : (
          sortedFavoriteQuestions.map((q) => {
            const current = q.participantCount ?? 0;
            const max = q.maxParticipants ?? 0;
            const statusLabel = getStatusLabel(
              q.questionStatus,
              current,
              max
            );
            const showJoinButton = statusLabel === "참여 가능";
            const isParticipating = !!participate[q.id];

            return (
              <div
                key={q.id}
                className="bg-white rounded-[1rem] shadow-[0px_4px_20px_rgba(0,0,0,0.06)] mb-[1rem] px-[1.25rem] py-[0.25rem]"
              >
                {/* 질문 문장 + 따옴표 */}
                <div className="relative w-full flex px-[1.5rem] items-start">
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
                <div className="w-full h-[1px] px-[1.5rem] bg-[#E7EBEF] my-4" />

                {/* 닉네임 + 콘텐츠명 */}
                <div className="flex flex-col px-[1.5rem] gap-[0.2rem]">
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

                {/* 인원 + 상태 + 태그 (SearchResult 스타일) */}
                <div className="flex flex-wrap items-center px-[1.5rem] gap-2 mt-3">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F2F4F8] text-[#3B3D40] text-[0.75rem]">
                    <img src="/icons/people.svg" className="w-4 h-4" />
                    {current}/{max}
                  </div>

                  {statusLabel && (
                    <span
                      className={`px-[0.5rem] py-[0.25rem] text-[0.75rem] rounded-md ${getStatusChipClass(
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

                {/* 하트 + 참여하기/대화보기 버튼 (SearchResult와 동일 패턴) */}
                <div className="flex items-center justify-between px-[1.5rem] mt-4 mb-[1.5rem]">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => handleToggleLikeQuestion(q.id)}
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

                  {showJoinButton ? (
                    <button
                      onClick={() => toggleParticipate(q.id)}
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
                      onClick={() =>
                        navigate("/detail", {
                          state: { questionId: q.id, item: q },
                        })
                      }
                      className="px-[1rem] py-[0.4rem] rounded-md text-[0.875rem] font-medium bg-[#54575C] text-white"
                    >
                      대화 보기
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
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
