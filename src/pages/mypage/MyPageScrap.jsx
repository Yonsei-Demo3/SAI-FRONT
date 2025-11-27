import React, { useState, useEffect, useMemo } from "react";
import BottomNav from "../../components/main/BottomNav";
import { useNavigate } from "react-router-dom";
import MyPageNav from "../../components/mypage/MyPageNav";
import { getMyScraps, cancelScrap } from "../../lib/scrapService";

export default function MyPageSaves() {
  const navigate = useNavigate();
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");
  const [saves, setSaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 서울 시간 포맷 함수
  const formatKoreanTime = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    // 브라우저 로컬 타임존과 상관없이 서울 시간대로 변환
    const seoul = new Date(
      d.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );

    const year = seoul.getFullYear();
    const month = String(seoul.getMonth() + 1).padStart(2, "0");
    const day = String(seoul.getDate()).padStart(2, "0");
    const hour = String(seoul.getHours()).padStart(2, "0");
    const minute = String(seoul.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hour}:${minute}`;
  };

  useEffect(() => {
    const fetchSaves = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await getMyScraps();

        const mapped = list.map((item) => ({
          scrapId: item.scrapId,
          messageId: item.messageId,
          messageContent: item.messageContent, // 메시지 내용
          roomId: item.roomId,
          highlight: item.content, // 필요하면 나중에 쓸 수 있게 그대로 둠
          contentTitle: item.contentTitle || "콘텐츠 제목",
          questionTitle: item.questionTitle || "질문 제목",
          savedAt: item.scrappedAt, // 저장 시각
        }));

        setSaves(mapped);
      } catch (e) {
        console.error("스크랩 목록 불러오기 실패", e);
        setError("스크랩한 문장을 불러오는 데 실패했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchSaves();
  }, []);

  const sortedSaves = useMemo(() => {
    const arr = [...saves];
    arr.sort((a, b) => {
      const da = new Date(a.savedAt);
      const db = new Date(b.savedAt);
      if (sortType === "최신순") {
        return db - da;
      }
      // 오래된순
      return da - db;
    });
    return arr;
  }, [saves, sortType]);

  const handleDelete = async (messageId) => {
    try {
      await cancelScrap(messageId);
      setSaves((prev) => prev.filter((s) => s.messageId !== messageId));
    } catch (e) {
      console.error("스크랩 삭제 실패", e);
      alert("스크랩을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

    // 공유하기
  const handleShare = async (item) => {
    // 공유에 쓸 텍스트
    const text = `"${item.messageContent}"\n\n- ${item.contentTitle}\n${item.questionTitle}`;

    // 앱에서 이 스크랩으로 들어오는 링크 (경로는 서비스에 맞게 바꿔도 돼)
    const url = `${window.location.origin}/scrap/${item.scrapId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.contentTitle,
          text,
          url,
        });
      } catch (e) {
        // 사용자가 취소한 경우 등
        console.log("share cancelled or failed", e);
      }
    } else {
      // Web Share 를 못 쓰는 브라우저용 폴백: 텍스트+링크 복사
      try {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        alert("공유 링크를 클립보드에 복사했어요.");
      } catch {
        alert("이 브라우저에서는 공유하기를 지원하지 않아요.");
      }
    }
  };


  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      {/* 상단 프로필 + 탭 */}
      <MyPageNav />



      {/* 정렬 드롭다운 */}
      <div className="flex justify-end items-center pr-[1.5rem] mt-[1.25rem]">
        <div className="relative text-[0.75rem]">
          <button
            className="text-[#6B7280] text-xs flex items-center"
            onClick={() => setSortOpen(!sortOpen)}
          >
            {sortType}
            <img
              src="/icons/arrow-down.svg"
              className="w-[1rem] h-[1rem] ml-[0.25rem]"
              alt=""
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

      {/* 저장 리스트 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[6rem] no-scrollbar">
        {loading && (
          <p className="text-sm text-gray-500 mt-4">불러오는 중...</p>
        )}
        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        {!loading && !error && sortedSaves.length === 0 && (
          <p className="text-sm text-[#9CA3AF] mt-4">
            아직 스크랩한 문장이 없어요.
          </p>
        )}

        {!loading &&
          !error &&
          sortedSaves.map((item) => (
            <div
              key={item.scrapId}
              className="w-full bg-white rounded-[1rem] border border-[#E7EBEF] p-5 mb-[1rem]"
            >
              {/* 상단: 따옴표 + 메시지 컨텐트 */}
              <div className="flex items-start px-[0.5rem]">
                <img
                  src="/icons/quote.svg"
                  alt="quote"
                  className="w-[1rem] h-[1rem] opacity-70 mt-[0.2rem] mr-[0.5rem]"
                />
              </div>
              <p className="text-[1rem] px-[0.5rem] mt-[0.25rem] leading-[1.6rem] text-[#111827]">
                {item.messageContent}
              </p>

              {/* 콘텐츠 제목 + questionTitle */}
              <div className="mt-[1.25rem]">
                <p className="text-[0.625rem] text-[#9CA3AF] mb-[0.25rem]">
                  {item.contentTitle}
                </p>
                <p className="text-[0.75rem] font-bold text-[#111827] leading-[1.4rem]">
                  {item.questionTitle}
                </p>
              </div>

              {/* 날짜 + 아이콘들 */}
              <div className="flex items-center justify-between mt-[1rem] mb-[0.5rem]">
                <p className="text-[0.75rem] text-[#9CA3AF]">
                  {formatKoreanTime(item.savedAt)}
                </p>

                <div className="flex items-center gap-[1rem]">
                  <button
                    type="button"
                    className="bg-transparent border-none outline-none"
                    onClick={() => handleShare(item)}
                  >
                    <img
                      src="/icons/share.svg"
                      alt="공유"
                      className="w-[1rem] h-[1rem]"
                    />
                  </button>

                  <button
                    type="button"
                    className="bg-transparent border-none outline-none"
                    onClick={() => handleDelete(item.messageId)}
                  >
                    <img
                      src="/icons/trash.svg"
                      alt="삭제"
                      className="w-[1rem] h-[1rem]"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
