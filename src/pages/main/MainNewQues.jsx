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
  likeQuestion,
  unlikeQuestion,
} from "../../lib/likeService";

// 백엔드 상태값 → 화면에 보여줄 한글 라벨로 변환
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
    case "FINISHED": // DetailScreen 에서 쓰던 값
      return "종료";

    default:
      return null;
  }
}

// 상태칩 스타일 결정
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

  const [query, setQuery] = useState(initialQuery); // 지금은 안 써도 일단 유지
  const [tags, setTags] = useState(initialTags);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
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
          size: 50,
          sortType: "최신순",
        });

        const list = data?.content || [];

        // 백에서 내려온 likeCount / isLikedByMe 그대로 사용
        const listWithLike = list.map((q) => ({
          ...q,
          likeCount: q.likeCount ?? 0,
          isLikedByMe: q.isLikedByMe ?? false,
        }));

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
          currentLiked = q.isLikedByMe;
          return {
            ...q,
            isLikedByMe: !q.isLikedByMe,
            likeCount: q.likeCount + (q.isLikedByMe ? -1 : 1),
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
              isLikedByMe: currentLiked,
              likeCount: q.likeCount + (currentLiked ? 1 : -1),
            };
          }
          return q;
        })
      );
    }
  };

  // 참여 / 취소 (NONE / WAITING 전환만 담당)
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
        // 대기 중 취소
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
        // JOINED면 여기서 아무 것도 안 함
        return;
      }
    } catch (e) {
      console.error("참여 API 실패", e);
      setPopup("error");
    } finally {
      setTimeout(() => setPopup(null), 2000);
    }
  };

  // 태그 삭제 (나중에 검색이랑 다시 연결할 때 사용)
  const handleRemoveTag = (tag) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    if (updated.length === 0) setQuery("");
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

  // 질문에 따라 바로 채팅으로 갈지, 디테일로 갈지 결정
  const goToChatOrDetail = (item) => {
    const status = item.questionStatus;
    const myStatus = item.myParticipationStatus || "NONE";

    const isFinished =
      status === "FINISHED" || status === "COMPLETED" || status === "DONE";
    const canWatchChat = isFinished || myStatus === "JOINED";

    // 채팅방 id 없으면 일단 디테일로 이동해서 다시 가져오게
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

      {/* 리스트 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-[500px] mx-auto">
        <div className="overflow-y-auto flex-1 px-[2.5rem] mt-[0.5rem] pb-[8rem] scrollbar-hide">
          {loading && (
            <div className="py-6 text-sm text-gray-500">불러오는 중...</div>
          )}

          {!loading &&
            results.map((item) => {
              const current = item.currentParticipants ?? 0;
              const max = item.maxParticipants ?? 0;

              const statusLabel = getStatusLabel(
                item.questionStatus,
                current,
                max
              );
              const canParticipate = statusLabel === "참여 가능";

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

                  <div className="w-full h-[1px] bg-[#E7EBEF] mx-auto mt-[0.8rem] mb-[0.75rem]" />

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
                    {item.mainCategory && item.subCategory
                      ? `${item.mainCategory} > ${item.subCategory}`
                      : ""}
                  </p>

                  {/* 인원 + 상태 + 태그 */}
                  <div className="flex items-center flex-wrap gap-[0.38rem] mt-[0.75rem]">
                    <div className="flex items-center text-[0.75rem] bg-[#F2F4F8] rounded-md px-[0.4rem] py-[0.2rem]">
                      <img
                        src="/icons/people.svg"
                        className="w-[1rem] h-[1rem] mr-[0.25rem]"
                        alt=""
                      />
                      {`${current}/${max}`}
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
                        toggleLike(item.questionId);
                      }}
                      className="flex items-center gap-[0.25rem]"
                    >
                      <img
                        src={
                          item.isLikedByMe
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

                    {/* 참여/취소/대화 버튼 */}
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

                  <div className="h-[0.5rem] bg-[#F2F4F8] ml-[-2.5rem] mt-[1.5rem]" />
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
