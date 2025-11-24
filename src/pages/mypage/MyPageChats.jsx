// src/screens/mypage/MyPageChats.jsx

import React, { useState, useEffect } from "react";
import BottomNav from "../../components/main/BottomNav";
import MyPageNav from "../../components/mypage/MyPageNav";
import { useNavigate } from "react-router-dom";
import { getMyChats } from "../../lib/questionService";

export default function MyPageChats() {
  const navigate = useNavigate();
  const [sortOpen, setSortOpen] = useState(false);
  const [sortType, setSortType] = useState("최신순");

  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const data = await getMyChats();
        setChats(data || []);
        setStats((prev) => ({
          ...prev,
          chatCount: (data || []).length,
        }));
      } catch (e) {
        console.error("마이페이지 대화 목록 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (!chats.length) return;

    setChats((prev) => {
      const copy = [...prev];

      if (sortType === "가나다순") {
        copy.sort((a, b) =>
          (a.contentName || "").localeCompare(b.contentName || "")
        );
      } else if (sortType === "인기순") {
        // 🔥 백엔드에서 좋아요/참여 수 내려주면 그 기준으로 정렬
        // 일단 questionId 기준으로만 정렬
        copy.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      } else if (sortType === "최신순") {
        // createdAt 내려오면 그걸로 정렬
        // 없으면 questionId 역순 정도로
        copy.sort((a, b) => (b.questionId || 0) - (a.questionId || 0));
      }

      return copy;
    });
  }, [sortType]);

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      <MyPageNav stats={stats} />

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

      {/* 대화 리스트 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] mt-[1rem] pb-[6rem] no-scrollbar">
        {loading && (
          <p className="text-xs text-[#9CA3AF] mt-[0.5rem]">불러오는 중...</p>
        )}

        {!loading && chats.length === 0 && (
          <p className="text-xs text-[#9CA3AF] mt-[0.5rem]">
            아직 참여한 대화가 없어요.
          </p>
        )}

        {!loading &&
          chats.map((chat) => (
            <div
              key={chat.questionId}
              className="flex items-start mb-[1.5rem] cursor-pointer"
              onClick={() =>
                navigate(`/mypage/chat/:id`, { state: { item: chat } })
              }
            >
              <img
                src={chat.thumbnailUrl || "/icons/sample1.svg"}
                className="w-[3.1875rem] h-[4.25rem] rounded-lg mr-[1rem] object-cover"
                alt="thumbnail"
              />

              <div className="flex flex-col">
                <p className="text-[0.875rem] text-[#9CA3AF]">
                  {chat.mainCategory && chat.subCategory
                    ? `${chat.mainCategory} / ${chat.subCategory}`
                    : chat.mainCategory || chat.subCategory || "콘텐츠명"}
                </p>

                <p className="text-[1.0rem] font-semibold mt-[0.25rem] line-clamp-1">
                  {chat.contentName || chat.questionTitle}
                </p>

                <p className="text-[0.875rem] text-[#6B7280] mt-[0.25rem]">
                  함께한 질문 {chat.joinedQuestionCount ?? 1} | 저장한 대화{" "}
                  {chat.savedChatCount ?? 0}
                </p>
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
