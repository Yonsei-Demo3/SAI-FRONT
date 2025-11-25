// src/components/mypage/MyPageNav.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyInfo } from "../../lib/memberService";
import { getMyQuestions } from "../../lib/questionService";
import { getMyScraps } from "../../lib/scrapService";
import { getMyLikedQuestions } from "../../lib/likeService";
import { getFriendList } from "../../lib/friendService";

export default function MyPageNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nickname, setNickname] = useState("닉네임");
  const [friendCount, setFriendCount] = useState(0);

  // 숫자들
  const [stats, setStats] = useState({
    questionCount: 0,
    likeCount: 0,
    scrapCount: 0,
  });

  // 프로필 정보
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const me = await getMyInfo();
        setNickname(me.nickname || "닉네임");
      } catch (e) {
        console.error("마이페이지 정보 로드 실패:", e);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [myQuestions, likedQuestions, scraps] = await Promise.all([
          getMyQuestions(),
          getMyLikedQuestions(),
          getMyScraps(),
        ]);

        const questionCount = Array.isArray(myQuestions)
          ? myQuestions.length
          : 0;
        const likeCount = Array.isArray(likedQuestions)
          ? likedQuestions.length
          : 0;
        const scrapCount = Array.isArray(scraps) ? scraps.length : 0;

        setStats({
          questionCount,
          likeCount,
          scrapCount,
        });
      } catch (e) {
        console.error("마이페이지 통계 로드 실패:", e);
      }
    };

    fetchStats();
  }, []);

  // 탭 + 숫자 매핑
  const tabs = [
    {
      key: "question",
      label: "내 질문",
      path: "/mypage/ques",
      value: stats.questionCount,
    },
    {
      key: "like",
      label: "좋아요",
      path: "/mypage/liked",
      value: stats.likeCount,
    },
    {
      key: "scrap",
      label: "스크랩",
      path: "/mypage/scrap",
      value: stats.scrapCount,
    },
  ];

  useEffect(() => {
    const fetchFriendCount = async () => {
      try {
        const list = await getFriendList(); // GET /api/v1/friends/me
        setFriendCount(Array.isArray(list) ? list.length : 0);
      } catch (e) {
        console.error("친구 목록 불러오기 실패:", e);
        setFriendCount(0);
      }
    };

    fetchFriendCount();
  }, []);

  return (
    <div className="flex flex-col bg-white font-[Pretendard]">
      <div className="mx-[1.5rem] mt-[1.5rem] bg-white pt-[1.25rem]">
        {/* 상단 타이틀 + 설정 */}
        <div className="flex justify-between items-center">
          <p className="text-[1.25rem] font-bold">마이페이지</p>
          <button onClick={() => navigate("/settings")}>
            <img
              src="/icons/setting.svg"
              className="w-[1.5rem] h-[1.5rem]"
              alt="설정"
            />
          </button>
        </div>

        {/* 프로필 영역 */}
        <div className="mt-[1.5rem] flex items-center gap-[1rem]">
          <div className="relative">
            <img
              src="/icons/profile-avatar.svg"
              alt="프로필"
              className="w-[4.5rem] h-[4.5rem] rounded-full"
            />
            <button
              type="button"
              onClick={() => navigate("/mypage/profile/edit")}
              className="absolute bottom-0 right-0 bg-transparent border-none outline-none"
            >
              <img
                src="/icons/edit.svg"
                alt="편집"
                className="w-[1.4rem] h-[1.4rem]"
              />
            </button>
          </div>

          <div className="flex flex-col">
            <p className="text-[1.25rem] font-semibold">{nickname}</p>
            {/* 친구 사이는 아직 API 없어서 0으로 표시 */}
            <p className="text-[0.875rem] text-[#6B7280] mt-[0.2rem]"
              onClick={()=> navigate('/settings/friends')}>
              친구 사이 {friendCount}
            </p>
          </div>
        </div>

        {/* 숫자 탭 영역 */}
        <div className="flex justify-between gap-[2.5rem] mt-[1.75rem]">
          {tabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              location.pathname.startsWith(tab.path + "/");

            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center flex-1 bg-transparent border-none outline-none"
              >
                {/* 숫자 */}
                <span className="text-[1rem] font-bold">{tab.value}</span>
                {/* 라벨 */}
                <span
                  className={`mt-[0.15rem] text-[0.85rem] ${
                    isActive ? "text-[#111827]" : "text-[#6B7280]"
                  }`}
                >
                  {tab.label}
                </span>
                {/* 언더라인 */}
                {isActive && (
                  <span className="mt-[0.25rem] w-[5.1458rem] h-[2px] bg-[#FA502E] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
