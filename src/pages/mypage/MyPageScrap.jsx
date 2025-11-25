import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";
import MyPageNav from "../../components/mypage/MyPageNav";
import { getMyScraps, cancelScrap } from "../../lib/scrapService";
import { getMyLikedQuestions, likeQuestion, unlikeQuestion } from "../../lib/likeService";
import { getQuestionDetail } from "../../lib/questionService";

export default function MyPageScrapScreen() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("관심 대화");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");

  const [scrapChats, setScrapChats] = useState([]);
  const [favoriteQuestions, setFavoriteQuestions] = useState([]);

  const [loadingScrap, setLoadingScrap] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [error, setError] = useState(null);

  // ✅ 스크랩(관심 대화) 불러오기
  useEffect(() => {
    const fetchScraps = async () => {
      try {
        setLoadingScrap(true);
        setError(null);

        const list = await getMyScraps();
        console.log("my scraps:", list);

        const mapped = list.map((item) => ({
          id: item.scrapId,
          messageId: item.messageId,
          roomId: item.roomId,
          question: item.content,
          contentTitle: item.contentTitle || "콘텐츠 제목",
          bookTitle: item.questionTitle || "질문 제목",
          date: item.scrappedAt,
          source: item.source,
        }));

        setScrapChats(mapped);
      } catch (e) {
        console.error("스크랩 목록 불러오기 실패", e);
        setError("스크랩한 대화를 불러오지 못했어요.");
      } finally {
        setLoadingScrap(false);
      }
    };

    fetchScraps();
  }, []);

  // ✅ 내가 좋아요 누른 질문들 불러오기 (관심 질문)
  useEffect(() => {
    const fetchLikedQuestions = async () => {
      try {
        setLoadingLike(true);
        setError(null);

        // 1) /questions/likes/me 로 questionId + likeCount 목록
        const likedList = await getMyLikedQuestions();
        console.log("liked questions:", likedList);

        // 2) 각 questionId에 대해 상세 정보 조회
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
              chatTags: [
                q.questionStatus === "RECRUITING" ? "진행중" : "마감",
              ],
              tags: q.tagNames || [],
              likeCount: item.likeCount,
              likedByMe: item.likedByMe ?? true, // ⭐ 좋아요 상태
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

  // ✅ 정렬된 스크랩 리스트
  const sortedScrapChats = useMemo(() => {
    const arr = [...scrapChats];
    arr.sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      return sortType === "최신순" ? db - da : da - db;
    });
    return arr;
  }, [scrapChats, sortType]);

  // ✅ 정렬된 관심 질문 리스트
  const sortedFavoriteQuestions = useMemo(() => {
    const arr = [...favoriteQuestions];
    arr.sort((a, b) => {
      const da = new Date(a.createdAt);
      const db = new Date(b.createdAt);
      return sortType === "최신순" ? db - da : da - db;
    });
    return arr;
  }, [favoriteQuestions, sortType]);

  const totalCount =
    selectedTab === "관심 대화"
      ? sortedScrapChats.length
      : sortedFavoriteQuestions.length;

  const handleDeleteScrap = async (messageId) => {
    try {
      await cancelScrap(messageId);
      setScrapChats((prev) =>
        prev.filter((item) => item.messageId !== messageId)
      );
    } catch (e) {
      console.error("스크랩 삭제 실패", e);
      alert("스크랩을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  // ✅ 관심 질문에서 좋아요 토글 (취소 포함)
  const handleToggleLikeQuestion = async (questionId) => {
    let currentLiked = false;

    // 낙관적 업데이트
    setFavoriteQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          currentLiked = q.likedByMe ?? true;
          const nextLiked = !currentLiked;
          const nextCount =
            (q.likeCount ?? 0) + (currentLiked ? -1 : 1);
          return {
            ...q,
            likedByMe: nextLiked,
            likeCount: nextCount < 0 ? 0 : nextCount,
          };
        }
        return q;
      })
    );

    try {
      if (currentLiked) {
        await unlikeQuestion(questionId); // 좋아요 취소
      } else {
        await likeQuestion(questionId);   // 다시 좋아요
      }
    } catch (e) {
      console.error("관심 질문 좋아요 토글 실패", e);
      // 실패 시 롤백
      setFavoriteQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
            const rollbackCount =
              (q.likeCount ?? 0) + (currentLiked ? 1 : -1);
            return {
              ...q,
              likedByMe: currentLiked,
              likeCount: rollbackCount < 0 ? 0 : rollbackCount,
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

      {/* 상단 탭 (관심 대화 / 관심 질문) */}
      <div className="flex gap-[0.75rem] px-[1.37rem] mt-[1.5rem] text-[0.75rem]">
        {["관심 대화", "관심 질문"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTab(t)}
            className={`px-[0.5rem] py-1 rounded-[0.5rem] border ${
              selectedTab === t
                ? "bg-[#FFEEEA] border-[#FA502E] text-[#FA502E]"
                : "bg-[#F2F4F8] border-none text-[#3B3D40]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

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
        {/* ==== 관심 대화 탭 ==== */}
        {selectedTab === "관심 대화" && (
          <>
            {loadingScrap ? (
              <p className="mt-4 text-start px-[0.5rem] text-[0.875rem] text-[#9CA3AF]">
                스크랩을 불러오는 중이에요...
              </p>
            ) : sortedScrapChats.length === 0 ? (
              <p className="mt-4 text-start px-[0.5rem] text-[0.875rem] text-[#9CA3AF]">
                아직 스크랩한 문장이 없어요.
              </p>
            ) : (
              sortedScrapChats.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[0.5rem] border border-[#F3F4F6] p-5 mb-6 relative"
                >
                  {/* 따옴표 + 문장 */}
                  <div className="mt-[0.25rem]">
                    <img
                      src="/icons/quote.svg"
                      className="w-[1rem] h-[1rem] mb-2"
                      alt=""
                    />
                    <p className="text-[1rem] leading-[1.6rem] text-[#191D1F]">
                      {item.question}
                    </p>
                  </div>

                  {/* 책 제목 + 질문 문장 */}
                  <div className="mt-[1.25rem]">
                    <p className="text-[0.625rem] text-[#6B7280] mb-1">
                      {item.contentTitle}
                    </p>
                    <p className="text-[0.75rem] font-bold text-[#191D1F] leading-[1.4rem]">
                      {item.bookTitle}
                    </p>
                  </div>

                  {/* 날짜 + 아이콘 */}
                  <div className="flex justify-between items-center mt-[1rem] text-[0.75rem] text-[#6B7280] mb-[0.5rem]">
                    <p>{item.date}</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          console.log("share", item.messageId);
                        }}
                      >
                        <img
                          src="/icons/share.svg"
                          className="w-[1.2rem] h-[1.2rem]"
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteScrap(item.messageId)}
                      >
                        <img
                          src="/icons/trash.svg"
                          className="w-[1.2rem] h-[1.2rem]"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ==== 관심 질문 탭 ==== */}
        {selectedTab === "관심 질문" && (
          <>
            {loadingLike ? (
              <p className="mt-4 text-start px-[0.5rem] text-[0.875rem] text-[#9CA3AF]">
                관심 질문을 불러오는 중이에요...
              </p>
            ) : sortedFavoriteQuestions.length === 0 ? (
              <p className="mt-4 text-start px-[0.5rem] text-[0.875rem] text-[#9CA3AF]">
                아직 관심 질문이 없어요.
              </p>
            ) : (
              sortedFavoriteQuestions.map((q) => (
                <div key={q.id}>
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

                  {/* 참여 인원 + 태그 */}
                  <div className="flex flex-wrap items-center px-[1.5rem] gap-2 mt-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F2F4F8] text-[#3B3D40] text-[0.75rem]">
                      <img src="/icons/people.svg" className="w-4 h-4" />
                      {q.participantCount}/{q.maxParticipants}
                    </div>

                    {q.chatTags.map((chatTag) => (
                      <span
                        key={chatTag}
                        className="px-2 py-1 bg-[#F0FFD9] text-[#7DCA01] text-[0.75rem] rounded-md"
                      >
                        {chatTag}
                      </span>
                    ))}

                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[#FFF2EE] text-[#FA502E] text-[0.75rem] rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 하트 + 대화 보기 버튼 */}
                  <div className="flex items-center justify-between px-[1.5rem] mt-4 mb-[2rem]">
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

                    <button
                      className="px-4 py-[0.4rem] rounded-[0.5rem] bg-[#54575C] text-white text-[0.75rem] font-bold"
                      onClick={() =>
                        navigate("/detail", {
                          state: { questionId: q.id, item: q },
                        })
                      }
                    >
                      대화 보기
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
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
