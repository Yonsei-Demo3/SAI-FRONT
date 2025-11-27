import Navbar from "../../components/main/Navbar.jsx";
import BottomNav from "../../components/main/BottomNav.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
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
import { getPopularScraps } from "../../lib/scrapService";

export default function MainScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const [popup, setPopup] = useState(null);

  // 참여 상태 (질문별)
  const [participate, setParticipate] = useState({});

  // 홈에 띄울 목록
  const [popularQuestions, setPopularQuestions] = useState([]); // 섹션1
  const [latestQuestions, setLatestQuestions] = useState([]); // 섹션3
  const [popularScraps, setPopularScraps] = useState([]); // 섹션2 하이라이트

  const [loading, setLoading] = useState({
    popular: false,
    latest: false,
  });
  const [scrapLoading, setScrapLoading] = useState(false);

  // 🔶 탭 메뉴 데이터
  const tabs = [
    { name: "NOW", path: "/main" },
    { name: "최신 질문", path: "/main/new" },
    { name: "인기 질문", path: "/main/pop" },
  ];

  const formatTimeAgo = (isoString) => {
    if (!isoString) return "";
    const created = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "오늘";
    return `${diffDays}일 전`;
  };

  const getStatusLabel = (status, current, max) => {
    if (!status) return null;

    switch (status) {
      case "RECRUITING":
        // 인원 다 찼으면 진행중으로 처리
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
  };

  // 상태 뱃지 색
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

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading((prev) => ({ ...prev, popular: true }));
      try {
        const data = await searchQuestions({
          keyword: "",
          categories: [],
          tags: [],
          page: 0,
          size: 10,
          sortType: "인기순",
        });

        const list = data.content || [];

        // 좋아요 상태 붙이기
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
              console.error("홈 인기질문 좋아요 상태 조회 실패", e);
              return {
                ...q,
                likeCount: q.likeCount ?? 0,
                likedByMe: q.likedByMe ?? false,
              };
            }
          })
        );

        listWithLike.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        const top3 = listWithLike.slice(0, 3);

        setPopularQuestions(top3);
      } catch (e) {
        console.error("홈 인기질문 불러오기 실패", e);
      } finally {
        setLoading((prev) => ({ ...prev, popular: false }));
      }
    };

    const fetchLatest = async () => {
      setLoading((prev) => ({ ...prev, latest: true }));
      try {
        const data = await searchQuestions({
          keyword: "",
          categories: [],
          tags: [],
          page: 0,
          size: 3,
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
              console.error("홈 최신질문 좋아요 상태 조회 실패", e);
              return {
                ...q,
                likeCount: q.likeCount ?? 0,
                likedByMe: q.likedByMe ?? false,
              };
            }
          })
        );

        setLatestQuestions(listWithLike);
      } catch (e) {
        console.error("홈 최신질문 불러오기 실패", e);
      } finally {
        setLoading((prev) => ({ ...prev, latest: false }));
      }
    };

    const fetchHighlights = async () => {
      setScrapLoading(true);
      try {
        const list = await getPopularScraps(5); // 필요하면 숫자 조정
        setPopularScraps(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("하이라이트 인기 스크랩 불러오기 실패", e);
      } finally {
        setScrapLoading(false);
      }
    };

    fetchPopular();
    fetchLatest();
    fetchHighlights();
  }, []);

  const toggleLike = async (questionId) => {
    let currentLiked = false;

    // 화면 먼저 업데이트 (인기/최신 둘 다 반영)
    setPopularQuestions((prev) =>
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
    setLatestQuestions((prev) =>
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
      console.error("홈 좋아요 토글 실패", e);
      // 실패 시 롤백
      setPopularQuestions((prev) =>
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
      setLatestQuestions((prev) =>
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

  // 참여 / 취소 (myParticipationStatus: NONE ↔ WAITING)
  const handleToggleParticipate = async (questionId, currentMyStatus) => {
    try {
      if (currentMyStatus === "NONE") {
        // 참여 신청
        await participateQuestion(questionId);

        // 인기 질문/최신 질문 둘 다에 반영
        setPopularQuestions((prev) =>
          prev.map((item) =>
            item.questionId === questionId
              ? { ...item, myParticipationStatus: "WAITING" }
              : item
          )
        );
        setLatestQuestions((prev) =>
          prev.map((item) =>
            item.questionId === questionId
              ? { ...item, myParticipationStatus: "WAITING" }
              : item
          )
        );

        setPopup("participate");
      } else if (currentMyStatus === "WAITING") {
        // 대기 중 취소
        await cancelParticipateQuestion(questionId);

        setPopularQuestions((prev) =>
          prev.map((item) =>
            item.questionId === questionId
              ? { ...item, myParticipationStatus: "NONE" }
              : item
          )
        );
        setLatestQuestions((prev) =>
          prev.map((item) =>
            item.questionId === questionId
              ? { ...item, myParticipationStatus: "NONE" }
              : item
          )
        );

        setPopup("cancel");
      } else {
        // JOINED는 여기서 아무것도 안 함 (대화 보기에서 처리)
        return;
      }
    } catch (e) {
      console.error("참여 API 실패", e);
      setPopup("error");
    } finally {
      setTimeout(() => setPopup(null), 2000);
    }
  };


  const renderQuestionCard = (item) => {
    const statusLabel = getStatusLabel(
      item.questionStatus,
      item.currentParticipants,
      item.maxParticipants
    );

    const isJoinable = statusLabel === "참여 가능";

    const myStatus = item.myParticipationStatus || "NONE";

    return (
      <div
        key={item.questionId}
        className="w-[20.4375rem] bg-white rounded-[1rem] shadow-[0px_2px_19px_rgba(0,0,0,0.10)] p-6 my-[1rem] relative flex flex-col"
        onClick={() =>
          navigate("/detail", { state: { questionId: item.questionId, item } })
        }
      >
        <div className="flex-1">
          {/* 따옴표 + 문장 */}
          <div className="relative w-full ml-[-0.2rem] mt-[1.5rem] flex items-start justify-center">
            <img
              src="/icons/quote.svg"
              alt="quote"
              className="w-[1rem] h-[1rem] opacity-70 mt-[0.5rem] flex-shrink-0 ml-[-1rem] mr-2"
            />

            <div className="relative max-w-[14rem] text-center mt-[0.5rem] leading-[1.5]">
              <p className="text-[1rem] font-medium ml-[0.5rem] text-gray-800 line-clamp-3">
                {item.questionTitle}
              </p>

              <img
                src="/icons/quote-down.svg"
                alt="quote close"
                className="w-[1rem] h-[1rem] mr-[-2rem] opacity-70 absolute right-0 bottom-0 translate-y-[20%]"
              />
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-full mt-[2.5rem] h-[1px] bg-[#E7EBEF] my-4" />

          {/* 닉네임 + 콘텐츠 제목 */}
          <div>
            <p className="text-[0.75rem] text-[#6B7280] mb-1">
              {item.hostNickname || "익명의 닉네임"}
            </p>
            <p className="text-[0.9rem] font-bold text-[#3B3D40] line-clamp-1">
              {item.contentName}
            </p>
          </div>

          {/* 참여 인원 + 상태 + 태그 */}
          <div className="flex flex-wrap gap-[0.5rem] items-center mt-3">
            <div className="flex items-center gap-[0.12rem] px-2 py-1 rounded-md bg-[#F2F4F8] text-[#3B3D40] text-[0.75rem]">
              <img src="/icons/people.svg" className="w-4 h-4" />
              {` ${item.currentParticipants ?? 0}/${item.maxParticipants}`}
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

            {(item.tagNames || []).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 하트 + 참여/대화 버튼 */}
        <div className="flex items-center justify-between mt-[1rem]">
          {/* ❤️ 하트 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(item.questionId);
            }}
            className="flex items-center gap-1"
          >
            <img
              src={
                item.likedByMe ? "/icons/heart-filled.svg" : "/icons/heart.svg"
              }
              className="w-6 h-6"
            />
            <span className="text-[0.9rem] text-[#3B3D40]">
              {item.likeCount ?? 0}
            </span>
          </button>

            {/* 상태에 따라 버튼 변경 */}
            {myStatus === "JOINED" ? (
              // 1) 이미 참여 중이면 → 항상 대화 보기
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/detail", {
                    state: { questionId: item.questionId, item },
                  });
                }}
                className="px-4 py-[0.4rem] rounded-md text-[0.875rem] font-medium bg-[#54575C] text-white"
              >
                대화 보기
              </button>
            ) : isJoinable ? (
              // 2) 참여 가능 상태 → NONE: 참여하기 / WAITING: 참여 취소
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleParticipate(item.questionId, myStatus);
                }}
                className={`px-4 py-[0.4rem] rounded-md text-[0.875rem] font-medium ${
                  myStatus === "WAITING"
                    ? "bg-[#B5BBC1] text-white" // 대기 중: 참여 취소(회색)
                    : "bg-[#FA502E] text-white" // 신청 안 함: 참여하기(주황)
                }`}
              >
                {myStatus === "WAITING" ? "참여 취소" : "참여하기"}
              </button>
            ) : (
              // 3) 모집 중이 아니면 → 대화 보기
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/detail", {
                    state: { questionId: item.questionId, item },
                  });
                }}
                className="px-4 py-[0.4rem] rounded-md text-[0.875rem] font-medium bg-[#54575C] text-white"
              >
                대화 보기
              </button>
            )}

        </div>
      </div>
    );
  };

  // 하이라이트 카드
  const renderHighlightCard = (item, index) => {
    const nickname = item.nickname || "익명의 회원";
    const contentTitle = item.contentTitle || "콘텐츠 제목";
    const questionTitle = item.questionTitle || "질문 제목";
    const messageContent =
      item.content ||
      item.messageContent ||
      "하이라이트 문장이 여기에 들어가요.";
    const createdAt = item.latestScrappedAt || item.createdAt;
    const timeLabel = formatTimeAgo(createdAt);

    return (
        <div
        key={item.messageId ?? index}
        className="w-[20.4375rem] bg-white rounded-[1rem] shadow-[0px_2px_19px_rgba(0,0,0,0.10)] p-5 border border-gray-100 my-[1rem]"
      >
        
        <div className="relative w-full flex items-start">
          <div className="mt-[0.5rem] ml-[0.25rem] leading-[1.5]">
            <div className="flex items-center mb-[0.25rem]">
              <img
                src="/icons/profile-gray.svg"
                alt="프로필"
                className="w-[2rem] h-[2rem]"
              />
              <div className="flex flex-col ml-[0.5rem]">
                <p className="text-[#3B3D40] text-[0.75rem]">{nickname}</p>
                <p className="text-[#3B3D40] text-[0.625rem]">
                  하이라이트{timeLabel ? ` • ${timeLabel}` : ""}
                </p>
              </div>
            </div>

            <p className="text-[0.75rem] mt-[0.75rem] font-regular text-[#3B3D40]">
              {contentTitle}
            </p>
            <p className="text-[0.875rem] font-bold text-[#3B3D40]">
              {questionTitle}
            </p>

            <div className="w-full h-[0.0625rem] bg-[#E7EBEF] mt-[0.75rem]" />

            <p className="text-[0.875rem] text-[#3B3D40] mt-[1.5rem]">
              {messageContent}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#FAFAFA] font-[Pretendard]">
      <div className="flex-shrink-0">
        <Navbar />

        {/* 🔶 탭 메뉴 */}
        <div className="flex justify-start w-full px-[1.5rem] bg-white gap-x-[2.25rem]">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;

            return (
              <button
                key={tab.name}
                onClick={() => navigate(tab.path)}
                className={`relative flex flex-col items-center justify-center h-[2.5rem] bg-transparent border-none outline-none pb-2 text-[0.9rem] transition-colors duration-200 ${
                  active ? "text-black font-bold" : "text-black"
                }`}
              >
                <span className={`${active ? "font-bold" : ""}`}>
                  {tab.name}
                </span>

                {active && (
                  <span className="absolute mt-[2rem] ml-[0rem] left-0 w-full h-[2px] bg-[#FA502E] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 참여 팝업 */}
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

      <div className="flex-1 min-h-0 overflow-y-auto pb-[6rem]">
        <div className="flex flex-col">
          <div className="w-full px-[1.5rem] flex justify-center relative z-10">
            <div className="w-full h-[21.3125rem] mt-[1.5rem] rounded-[1.25rem] overflow-hidden shadow-sm relative bg-gradient-to-b from-[#FFDAC0] to-[#FA502E]">
              <img
                src="/icons/main-character.svg"
                alt="Main Character"
                className="px-[1.75rem] mr-[1rem] mt-[3.25rem] w-full h-[10.6875rem]"
              />

              <div className="p-6 text-white rounded-[1.25rem] relative overflow-hidden">
                <div className="z-10 relative font-Pretendard text-[#FFFFFF] ml-[0.75rem] mt-[-0.2rem]">
                  <h2 className="text-[1.5rem] font-bold leading-[1] mb-[0.5rem]">
                    사이, 이렇게 시작해보세요
                  </h2>
                  <p className="text-[0.875rem] font-bold leading-[1.5]">
                    질문으로 시작하는 대화,
                    <br />
                    처음이라도 어렵지 않아요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 🔸 섹션 1 : 인기 질문 상위 3개 */}
          <div className="w-full px-6 mt-10 flex justify-between items-center z-0 relative">
            <p className="text-[1.25rem] font-bold">
              가장 많은 시선을 끈 질문들
            </p>
            <button onClick={() => navigate("/main/pop")}>
              <img src="/icons/next.svg" alt="next" className="w-4 h-6" />
            </button>
          </div>

          <div
            className="w-full mt-4 overflow-x-auto overflow-y-visible no-scrollbar relative z-10"
            style={{ overflowY: "visible" }}
          >
            <div className="flex gap-4 w-max pl-[1.5rem] pr-6">
              {loading.popular && popularQuestions.length === 0 && (
                <div className="pl-[1.5rem] text-sm text-gray-500">
                  인기 질문 불러오는 중...
                </div>
              )}
              {!loading.popular &&
                popularQuestions.map((item) => renderQuestionCard(item))}
            </div>
          </div>

          {/* 🔸 섹션 2 : 대화 사이에 머문 하이라이트 */}
          <div className="w-full px-6 mt-[2rem]">
            <div className="flex items-center justify-between">
              <p className="text-[1.5rem] font-bold">
                대화 사이에 머문 하이라이트
              </p>
            </div>
            <p className="text-[0.875rem] text-gray-500">
              다른 회원들이 하이라이트로 저장한 문장을 만나보세요.
            </p>
          </div>

          <div
            className="w-full mt-4 overflow-x-auto overflow-y-visible no-scrollbar relative z-10"
            style={{ overflowY: "visible" }}
          >
            <div className="flex gap-[1rem] w-max px-[1.5rem] pr-6">
              {scrapLoading && popularScraps.length === 0 && (
                <div className="pl-[1.5rem] text-sm text-gray-500">
                  하이라이트 불러오는 중...
                </div>
              )}

              {!scrapLoading && popularScraps.length === 0 && (
                <div className="pl-[1.5rem] text-sm text-gray-400 my-[1.5rem]">
                  아직 하이라이트가 없어요.
                </div>
              )}

              {!scrapLoading &&
                popularScraps.map((item, idx) =>
                  renderHighlightCard(item, idx)
                )}
            </div>
          </div>

          {/* 🔸 섹션 3 : 최신 질문 상위 3개 */}
          <div className="w-full px-6 mt-10 flex justify-between items-center z-0 relative">
            <p className="text-[1.25rem] font-bold">지금 새로 올라온 질문들</p>
            <button onClick={() => navigate("/main/new")}>
              <img src="/icons/next.svg" alt="next" className="w-4 h-6" />
            </button>
          </div>

          <div
            className="w-full mt-4 overflow-x-auto overflow-y-visible no-scrollbar relative z-10"
            style={{ overflowY: "visible" }}
          >
            <div className="flex gap-4 w-max pl-[1.5rem] pr-6">
              {loading.latest && latestQuestions.length === 0 && (
                <div className="pl-[1.5rem] text-sm text-gray-500">
                  최신 질문 불러오는 중...
                </div>
              )}
              {!loading.latest &&
                latestQuestions.map((item) => renderQuestionCard(item))}
            </div>
          </div>
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

      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}
