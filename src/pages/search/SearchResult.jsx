// src/screens/search/SearchResult.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../../components/main/Navbar";
import BottomNav from "../../components/main/BottomNav";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar";
import {
  searchQuestions,
  participateQuestion,
  cancelParticipateQuestion,
} from "../../lib/questionService";
import { likeQuestion, unlikeQuestion } from "../../lib/likeService";

/* ================= 공통 상태 라벨 / 칩 ================= */

// 메인 / 마이페이지에서 쓰던 것과 동일하게 맞춤
function getStatusLabel(status, current, max) {
  if (!status) return null;

  switch (status) {
    case "RECRUITING":
      // 모집 중인데 인원이 다 찼으면 진행중으로 처리
      if (max && current >= max) return "진행중";
      return "참여 가능";
    case "ACTIVE":
    case "READY_CHECK":
      return "진행중";
    case "COMPLETED":
    case "DONE":
    case "FINISHED":
      return "종료";
    default:
      return null;
  }
}

function getStatusChipClass(label) {
  if (label === "진행중") {
    return "bg-[#F3FFE1] text-[#6BB600]";
  }
  if (label === "종료") {
    return "bg-[#F3F4F6] text-[#4B5563]";
  }
  // 참여 가능
  return "bg-[#E3F2FF] text-[#1D72FF]";
}

export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialQuery = location.state?.query || "";
  const initialTags = location.state?.tags || [];
  const initialCategories = location.state?.categories || [];

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [tags, setTags] = useState(initialTags); // 칩 표시용(문자열)
  const [categories, setCategories] = useState(initialCategories); // {main, sub} 배열

  const [likeState, setLikeState] = useState({});
  const [results, setResults] = useState([]);
  const [popup, setPopup] = useState(null);
  const [openSort, setOpenSort] = useState(false);
  const [sortType, setSortType] = useState("인기순");

  /* ================= 검색 호출 ================= */

  const fetchResults = async () => {
    try {
      const hasCategories = categories && categories.length > 0;
      const hasTextOrTags =
        (query && query.trim().length > 0) || (tags && tags.length > 0);

      // 아무 조건도 없으면 검색 안 함
      if (!hasCategories && !hasTextOrTags) {
        setResults([]);
        return;
      }

      let keywordToUse = "";
      let categoriesToSend = [];
      let tagsToSend = [];

      if (hasCategories) {
        // 카테고리 검색: main/sub 기준만 사용
        categoriesToSend = categories;
        keywordToUse = "";
        tagsToSend = [];
      } else {
        // 일반 검색 (키워드 + 태그)
        keywordToUse = (query || "").trim();
        categoriesToSend = [];
        tagsToSend = tags;
      }

      const data = await searchQuestions({
        keyword: keywordToUse,
        categories: categoriesToSend,
        tags: tagsToSend,
        page: 0,
        size: 10,
        sortType,
      });

      setResults(data.content || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tags, sortType, categories]);

  /* ================= 좋아요 ================= */

  const handleToggleLike = async (questionId) => {
    const base = results.find((r) => r.questionId === questionId) || {};
    const current = likeState[questionId] || {
      liked: base.likedByMe ?? false,
      count: base.likeCount ?? 0,
    };

    try {
      let res;
      if (!current.liked) {
        res = await likeQuestion(questionId);
      } else {
        res = await unlikeQuestion(questionId);
      }

      setLikeState((prev) => ({
        ...prev,
        [questionId]: {
          liked: res.likedByMe,
          count: res.likeCount,
        },
      }));
    } catch (e) {
      console.error("좋아요 토글 실패:", e);
    }
  };

  /* ================= 참여/취소 ================= */

  const handleToggleParticipate = async (questionId, currentMyStatus) => {
    try {
      if (currentMyStatus === "NONE") {
        await participateQuestion(questionId);
        setResults((prev) =>
          prev.map((item) =>
            item.questionId === questionId
              ? { ...item, myParticipationStatus: "WAITING" }
              : item
          )
        );
        setPopup("participate");
      } else if (currentMyStatus === "WAITING") {
        await cancelParticipateQuestion(questionId);
        setResults((prev) =>
          prev.map((item) =>
            item.questionId === questionId
              ? { ...item, myParticipationStatus: "NONE" }
              : item
          )
        );
        setPopup("cancel");
      } else {
        // JOINED는 여기서 안 바꿈
        return;
      }
    } catch (e) {
      console.error("참여 API 실패", e);
      setPopup("error");
    } finally {
      setTimeout(() => setPopup(null), 2000);
    }
  };

  /* ================= 태그/프로필/이동 ================= */

  const handleRemoveTag = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);

    // 카테고리 검색이었다면 categories에서도 sub 삭제
    if (categories && categories.length > 0) {
      setCategories((prev) => prev.filter((c) => c.sub !== tag));
    }

    if (
      updatedTags.length === 0 &&
      (!categories || categories.length === 0)
    ) {
      setQuery("");
      setInputQuery("");
    }
  };

  const handleProfileClick = (e, item) => {
    e.stopPropagation();

    const hostId = item.hostId;
    if (!hostId && hostId !== 0) {
      console.log("[SearchResult] item without hostId:", item);
      alert("질문 작성자 ID 정보를 찾을 수 없어요.");
      return;
    }

    navigate(`/friend/profile/${hostId}`, {
      state: {
        memberId: hostId,
        nickname: item.hostNickname || "익명",
        profileImage: item.imageUrl || "/icons/profile-avatar.svg",
      },
    });
  };

  // 질문 카드에서 "대화 보기" 눌렀을 때
  const goToChatOrDetail = (item) => {
    const status = item.questionStatus;
    const myStatus = item.myParticipationStatus || "NONE";

    const isFinished =
      status === "FINISHED" ||
      status === "COMPLETED" ||
      status === "DONE";

    const canWatchChat = isFinished || myStatus === "JOINED";

    // roomId 없으면 디테일에서 다시 처리
    if (!canWatchChat || !item.roomId) {
      navigate("/detail", {
        state: { questionId: item.questionId, item },
      });
      return;
    }

    navigate("/chat", {
      state: {
        questionId: item.questionId,
        roomId: item.roomId,
        questionTitle: item.questionTitle,
        status: item.questionStatus,
      },
    });
  };

  /* ================= 렌더 ================= */

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <Navbar />

      {/* 참여/취소 팝업 */}
      {popup && (
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
                    : popup === "cancel"
                    ? "참여가 취소되었어요"
                    : "참여 처리 중 오류가 발생했어요"}
                </p>
                {popup === "participate" && (
                  <p className="text-[0.75rem] text-[#3B3D40] leading-[1.3rem] mt-[0.25rem] whitespace-pre-line">
                    {
                      "대화 인원이 모두 모이면 알려드릴게요.\n알림을 받으면 30초 안에 ‘준비 완료’를 눌러 참여할 수 있습니다."
                    }
                  </p>
                )}
                {popup === "cancel" && (
                  <p className="text-[0.75rem] text-[#3B3D40] leading-[1.3rem] mt-[0.25rem] whitespace-pre-line">
                    {"다시 참여하려면 ‘참여하기’를 눌러주세요."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색 + 결과 */}
      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-[500px] mx-auto">
        <SearchBar
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          tags={tags}
          onRemoveTag={handleRemoveTag}
          onEnter={() => setQuery(inputQuery)}
        />

        {/* 상단 정보 */}
        <div className="flex justify-between items-center px-[2.5rem] mt-[1.5rem]">
          <p className="text-[1rem] font-semibold">
            검색결과 {results.length}
          </p>

          <div className="relative text-[0.75rem]">
            <button
              className="text-[#6B7280] text-[0.75rem] flex items-center"
              onClick={() => setOpenSort(!openSort)}
            >
              {sortType}
              <img
                src="/icons/arrow-down.svg"
                className="w-[1rem] h-[1rem] ml-[0.25rem]"
                alt=""
              />
            </button>

            {openSort && (
              <div className="absolute right-0 mt-2 w-[4.5rem] bg-white rounded-[0.25rem] shadow-lg z-50">
                <button
                  className="w-full text-left px-3 py-2 text-[0.75rem] text-[#B5BBC1]"
                  onClick={() => {
                    setSortType("인기순");
                    setOpenSort(false);
                  }}
                >
                  인기순
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-[0.75rem] text-[#B5BBC1]"
                  onClick={() => {
                    setSortType("최신순");
                    setOpenSort(false);
                  }}
                >
                  최신순
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-[0.5rem] bg-[#F2F4F8] mt-[1rem]" />

        {/* 결과 리스트 */}
        <div className="overflow-y-auto flex-1 px-[2.5rem] mt-[0.5rem] pb-[8rem] scrollbar-hide">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[#3B3D40]">
              <p className="text-[1.25rem] font-bold mb-[0.75rem]">
                검색 결과가 없어요
              </p>
              <p className="text-[0.9rem] text-[#6B7280] leading-[1.5rem]">
                다른 키워드로 다시 검색하거나, <br />
                직접 새로운 질문을 만들어보세요.
              </p>
            </div>
          ) : (
            results.map((item) => {
              const likeInfo = likeState[item.questionId] || {
                liked: item.likedByMe ?? false,
                count: item.likeCount ?? 0,
              };

              const current =
                item.currentParticipants ?? item.participants ?? 0;
              const max =
                item.maxParticipants ?? item.maxparticipants ?? 0;

              const statusLabel = getStatusLabel(
                item.questionStatus,
                current,
                max
              );
              const myStatus = item.myParticipationStatus || "NONE";
              const canParticipate = statusLabel === "참여 가능";

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

                  {/* 작성자/콘텐츠 정보 */}
                  <button
                    type="button"
                    onClick={(e) => handleProfileClick(e, item)}
                    className="flex items-center gap-[0.5rem]"
                  >
                    <img
                      src={"/icons/profile-gray.svg"}
                      className="w-[1.5rem] h-[1.5rem] rounded-full object-cover"
                      alt=""
                    />
                    <span className="text-[#9CA3AF] text-[0.85rem]">
                      {item.hostNickname || "익명"}
                    </span>
                  </button>

                  <p className="font-semibold text-[0.9rem] mt-[0.4rem]">
                    {item.contentName}
                  </p>
                  <p className="text-[0.7rem] text-[#555] mt-[0.2rem]">
                    {item.mainCategory} &gt; {item.subCategory}
                  </p>

                  {/* 인원 + 상태칩 + 태그 */}
                  <div className="flex flex-wrap items-center gap-[0.38rem] mt-[0.75rem]">
                    <div className="flex items-center text-[0.75rem] bg-[#F2F4F8] rounded-md px-[0.4rem] py-[0.2rem]">
                      <img
                        src="/icons/people.svg"
                        className="w-[1rem] h-[1rem] mr-[0.25rem]"
                        alt=""
                      />
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
                        handleToggleLike(item.questionId);
                      }}
                      className="flex items-center gap-[0.25rem]"
                    >
                      <img
                        src={
                          likeInfo.liked
                            ? "/icons/heart-filled.svg"
                            : "/icons/heart.svg"
                        }
                        className="w-[1rem] h-[1rem]"
                        alt=""
                      />
                      <span className="text-[0.875rem] text-[#6B7280]">
                        {likeInfo.count}
                      </span>
                    </button>

                    {/* 참여/취소/대화 보기 */}
                    {myStatus === "JOINED" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToChatOrDetail(item);
                        }}
                        className="px-[1rem] py-[0.4rem] rounded-md text-[0.875rem] font-medium bg-[#54575C] text-white"
                      >
                        대화 보기
                      </button>
                    ) : canParticipate ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleParticipate(
                            item.questionId,
                            myStatus
                          );
                        }}
                        className={`px-[1rem] py-[0.4rem] rounded-md text-[0.875rem] font-medium ${
                          myStatus === "WAITING"
                            ? "bg-[#B5BBC1] text-white"
                            : "bg-[#FA502E] text-white"
                        }`}
                      >
                        {myStatus === "WAITING" ? "참여 취소" : "참여하기"}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToChatOrDetail(item);
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
            })
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
