// src/components/mypage/MyPageNav.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyInfo } from "../../lib/memberService";
import { getFriendCounts } from "../../lib/friendService";
import { getMyChats } from "../../lib/questionService"; // ★ 방금 만든 함수

export default function MyPageNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nickname, setNickname] = useState("닉네임");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // 질문/대화/저장/스크랩 개수
  const [stats, setStats] = useState({
    questionCount: 0,
    chatCount: 0,
    saveCount: 0,
    scrapCount: 0,
  });

  // 프로필 + 친구 수
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const me = await getMyInfo();
        setNickname(me.nickname || "닉네임");

        const counts = await getFriendCounts(me.userId);
        setFollowerCount(counts.followerCount ?? counts.FollowerCount ?? 0);
        setFollowingCount(counts.followingCount ?? counts.FollowingCount ?? 0);
      } catch (e) {
        console.error("마이페이지 정보 로드 실패:", e);
      }
    };

    fetchProfile();
  }, []);

  // ✨ 개수 불러오기 (지금은 대화만 실제로 채워 줌)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 내가 참여한 대화 리스트
        const chats = await getMyChats();
        setStats((prev) => ({
          ...prev,
          chatCount: Array.isArray(chats) ? chats.length : 0,
          // questionCount / saveCount / scrapCount 도
          // 나중에 API 생기면 여기서 같이 채우면 됨
        }));
      } catch (e) {
        console.error("마이페이지 통계 로드 실패:", e);
      }
    };

    fetchStats();
  }, []);

  // 탭 + 숫자 매핑
  const tabs = [
    {
      key: "ques",
      label: "질문",
      path: "/mypage/ques",
      value: stats.questionCount,
    },
    {
      key: "chats",
      label: "대화",
      path: "/mypage/chats",
      value: stats.chatCount,
    },
    {
      key: "save",
      label: "저장",
      path: "/mypage/save",
      value: stats.saveCount,
    },
    {
      key: "scrap",
      label: "스크랩",
      path: "/mypage/scrap",
      value: stats.scrapCount,
    },
  ];

  return (
    <div className="flex flex-col bg-white font-[Pretendard]">
      {/* 상단 타이틀 */}
      <div className="px-[1.5rem] mt-[1.5rem] flex justify-between items-center">
        <p className="text-[1.25rem] font-bold">마이페이지</p>
        <button onClick={() => navigate("/settings")}>
          <img
            src="/icons/setting.svg"
            className="w-[1.5rem] h-[1.5rem]"
            alt="설정"
          />
        </button>
      </div>

      {/* 프로필 */}
      <div className="px-[1.5rem] mt-[1.5rem] flex items-center gap-[1rem]">
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
          <p className="text-[0.875rem] text-[#6B7280] mt-[0.25rem]">
            팔로워 {followerCount} | 팔로잉 {followingCount}
          </p>
        </div>
      </div>

      {/* 숫자 + 탭 한 줄에 붙이기 */}
      <div className="flex justify-around mt-[1.75rem] px-[1.5rem] text-center">
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
                <span className="mt-[0.25rem] w-[2rem] h-[2px] bg-[#FA502E] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
