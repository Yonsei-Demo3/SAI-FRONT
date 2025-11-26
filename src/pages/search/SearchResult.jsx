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

export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달받은 값 (state 없을 수도 있으니까 안전하게 옵셔널 체이닝)
  const initialQuery = location.state?.query || "";
  const initialTags = location.state?.tags || [];

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [tags, setTags] = useState(initialTags);

  // 상태
  const [likeState, setLikeState] = useState({});
  const [results, setResults] = useState([]);
  const [popup, setPopup] = useState(null);
  const [openSort, setOpenSort] = useState(false);
  const [sortType, setSortType] = useState("인기순");

  // 검색 결과 불러오기
  const fetchResults = async () => {
    try {
      if (!query && tags.length === 0) {
        setResults([]);
        return;
      }

      const data = await searchQuestions({
        keyword: query,
        tags,
        page: 0,
        size: 10,
        sortType,
      });

      // 여기서 이미 각 item에 myParticipationStatus 가 들어온다고 가정
      setResults(data.content || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  // query / tags / sortType 바뀔 때만 검색
  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tags, sortType]);

  // ❤️ 좋아요 토글
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

  // 참여 / 참여취소 토글 (myParticipationStatus 기반)
  const handleToggleParticipate = async (questionId, currentMyStatus) => {
    try {
      if (currentMyStatus === "NONE") {
        // 참여 신청
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
        // 대기 중인 상태만 취소 가능
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
        // JOINED에서는 여기 안 들어오는 게 정상. 들어오면 그냥 무시
        return;
      }
    } catch (e) {
      console.error("참여 API 실패", e);
      setPopup("error");
    } finally {
      setTimeout(() => setPopup(null), 2000);
    }
  };


  // 상태 라벨 매핑 함수
  const getStatusLabel = (status, current, max) => {
    if (!status) return null;

    switch (status) {
      case "RECRUITING":
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

  // 태그 삭제
  const handleRemoveTag = (tag) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    if (updated.length === 0) {
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

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <Navbar />

      {/* 팝업 */}
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
                    {"대화 인원이 모두 모이면 알려드릴게요.\n알림을 받으면 30초 안에 ‘준비 완료’를 눌러 참여할 수 있습니다."}
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

      {/* 검색 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-[500px] mx-auto">
        <SearchBar
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          tags={tags}
          onRemoveTag={handleRemoveTag}
          onEnter={() => setQuery(inputQuery)}
        />

        {/* 결과 상단 */}
        <div className="flex justify-between items-center px-[2.5rem] mt-[1.5rem]">
          <p className="text-[1rem] font-semibold">검색결과 {results.length}</p>

          <div className="relative text-[0.75rem]">
            <button
              className="text-[#6B7280] text-[0.75rem] flex items-center"
              onClick={() => setOpenSort(!openSort)}
            >
              {sortType}
              <img
                src="/icons/arrow-down.svg"
                className="w-[1rem] h-[1rem] ml-[0.25rem]"
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
              const max = item.maxParticipants ?? item.maxparticipants ?? 0;

              const statusLabel = getStatusLabel(
                item.questionStatus,
                current,
                max
              );
              const showJoinButton = statusLabel === "참여 가능";

              const myStatus = item.myParticipationStatus || "NONE";

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
                  />

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

                  {/* 인원수 + 상태 + 태그 */}
                  <div className="flex items-center flex-wrap gap-[0.38rem] mt-[0.75rem]">
                    <div className="flex items-center text-[0.75rem] bg-[#F2F4F8] rounded-md px-[0.4rem] py-[0.2rem]">
                      <img
                        src="/icons/people.svg"
                        className="w-[1rem] h-[1rem] mr-[0.25rem]"
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

                  <div className="flex justify-between items-center mt-[0.8rem]">
                    {/* 좋아요 버튼 */}
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
                      />
                      <span className="text-[0.875rem] text-[#6B7280]">
                        {likeInfo.count}
                      </span>
                    </button>

                    {/* 참여 / 대화 보기 버튼 */}
                      {myStatus === "JOINED" ? (
                        // 1) 참여 중인 상태 → 항상 대화 보기 버튼
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
                      ) : showJoinButton ? (
                        // 2) 모집 중(참여 가능)일 때 → NONE: 참여하기 / WAITING: 참여 취소
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleParticipate(item.questionId, myStatus);
                          }}
                          className={`px-[1rem] py-[0.4rem] rounded-md text-[0.875rem] font-medium ${
                            myStatus === "WAITING"
                              ? "bg-[#B5BBC1] text-white" // 대기 중일 때: 참여 취소(회색)
                              : "bg-[#FA502E] text-white" // 신청 안 함일 때: 참여하기(주황)
                          }`}
                        >
                          {myStatus === "WAITING" ? "참여 취소" : "참여하기"}
                        </button>
                      ) : (
                        // 3) 모집 중이 아닐 때 → 그냥 대화 보기 (NONE / WAITING 둘 다)
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
