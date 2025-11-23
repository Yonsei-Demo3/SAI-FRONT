import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyInfo } from "../../lib/memberService";
import { getFriendCounts } from "../../lib/friendService";

export default function MyPageNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nickname, setNickname] = useState("닉네임");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await getMyInfo();
        setNickname(me.nickname || "닉네임");

        const counts = await getFriendCounts(me.userId);

        setFollowerCount(
          counts.followerCount ?? counts.FollowerCount ?? 0
        );
        setFollowingCount(
          counts.followingCount ?? counts.FollowingCount ?? 0
        );
      } catch (e) {
        console.error("마이페이지 정보 로드 실패:", e);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { name: "질문", path: "/mypage/ques" },
    { name: "대화", path: "/mypage/chats" },
    { name: "저장", path: "/mypage/save" },
    { name: "스크랩", path: "/mypage/scrap" },
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
          <img
            src="/icons/edit.svg"
            alt="편집"
            className="absolute bottom-0 right-0 w-[1.4rem] h-[1.4rem]"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-[1.25rem] font-semibold">{nickname}</p>
          <p className="text-[0.875rem] text-[#6B7280] mt-[0.25rem]">
            팔로워 {followerCount} | 팔로잉 {followingCount}
          </p>
        </div>
      </div>

      {/* 탭 영역 */}
      <div className="flex justify-around mt-[1.75rem] px-[1.5rem] text-center">
        {tabs.map((tab) => {
          const isActive =
            location.pathname === tab.path ||
            location.pathname.startsWith(tab.path + "/");

          return (
            <button
              key={tab.name}
              onClick={() => {
                navigate(tab.path);
              }}
              className={`relative flex flex-col items-center justify-center h-[2.5rem] bg-transparent border-none outline-none pb-2 text-[0.9rem] transition-colors duration-200 ${
                isActive ? "text-black font-bold" : "text-black"
              }`}
            >
              {tab.name}

              {isActive && (
                <span className="absolute mt-[2rem] left-0 w-full h-[2px] bg-[#FA502E] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
