// src/screens/friend/FriendProfileScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  getBlocksList,
  blockFriends,
  unblockFriends,
} from "../../lib/friendService";
import { getMyInfo } from "../../lib/memberService";   // ✅ 추가

export default function FriendProfileScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { memberId: memberIdParam } = useParams();

  // 1) URL 파라미터가 우선, 없으면 state에서
  const memberId = memberIdParam || state?.memberId;
  const nickname = state?.nickname ?? "익명";
  const profileImage = "/icons/profile-avatar.svg";

  const [isBlocked, setIsBlocked] = useState(false);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);

  // ✅ 내 정보
  const [myMemberId, setMyMemberId] = useState(null);
  const [meLoading, setMeLoading] = useState(true);

  if (!memberId) {
    return (
      <div className="flex items-center justify-center h-screen">
        잘못된 접근입니다.
      </div>
    );
  }

  // ✅ 내 정보 조회
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMyInfo();
        setMyMemberId(me.memberId); // 백에서 내려주는 memberId
      } catch (e) {
        console.error("내 정보 조회 실패", e);
      } finally {
        setMeLoading(false);
      }
    };

    fetchMe();
  }, []);

  // ✅ 내 프로필인지 여부
  const isMe =
    !meLoading &&
    myMemberId != null &&
    String(myMemberId) === String(memberId);

  // 차단 여부는 “내 프로필이 아닐 때만” 조회
  useEffect(() => {
    if (!memberId || meLoading || isMe) return;

    const checkBlocked = async () => {
      try {
        const list = await getBlocksList();
        const found = list.some(
          (item) => String(item.blockedMemberId) === String(memberId)
        );
        setIsBlocked(found);
      } catch (e) {
        console.error("차단 목록 조회 실패", e);
      }
    };

    checkBlocked();
  }, [memberId, meLoading, isMe]);

  const handleOpenBlockConfirm = () => {
    setBlockConfirmOpen(true);
  };

  const handleCloseBlockConfirm = () => {
    setBlockConfirmOpen(false);
  };

  // 실제 차단 API 호출
  const handleBlock = async () => {
    try {
      await blockFriends(memberId);
      setIsBlocked(true);
    } catch (e) {
      console.error("차단 실패", e);
      alert("차단에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBlockConfirmOpen(false);
    }
  };

  // 차단 해제
  const handleUnblock = async () => {
    try {
      await unblockFriends(memberId);
      setIsBlocked(false);
    } catch (e) {
      console.error("차단 해제 실패", e);
      alert("차단 해제에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  // 친구 추가 화면으로 이동
  const goToAddFriend = () => {
    navigate("/friend/add", {
      state: {
        memberId,
        nickname,
        profileImage,
      },
    });
  };

  // 아직 내 정보 로딩 중이면 간단한 로딩만
  if (meLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#B74023] text-white">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#B74023] text-white font-[Pretendard]">
      {/* 상단 닫기 버튼 */}
      <div className="flex items-center justify-between px-6 pt-10">
        <button onClick={() => navigate(-1)}>
          <span className="text-3xl font-light">×</span>
        </button>
      </div>

      {/* 가운데 프로필 */}
      <div className="flex-1 flex flex-col mt-[28rem] items-center justify-center">
        <div className="w-[4.75rem] h-[4.75rem] overflow-hidden mb-4">
          <img
            src={profileImage}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-[1.25rem] font-semibold">{nickname}</p>
      </div>

      {/* ✅ 내 프로필이면 하단 버튼 안 보이게 */}
      {!isMe && (
        <>
          {/* 하단 구분선 */}
          <div className="h-[1px] w-full bg-white/40" />

          {/* 하단 버튼 영역 */}
          <div className="pb-10 pt-6 flex justify-center">
            {!isBlocked ? (
              // 차단 전 : 친구 추가 + 차단
              <div className="flex w-full max-w-[320px] gap-[4rem] items-center justify-center">
                <button
                  className="flex flex-col items-center"
                  onClick={goToAddFriend}
                >
                  <img
                    src="/icons/friend-plus.svg"
                    onError={(e) => (e.target.style.display = "none")}
                    className="w-[1.75rem] h-[1.75rem] mb-1"
                    alt=""
                  />
                  <span className="text-[0.75rem]">친구 추가</span>
                </button>

                <button
                  className="flex flex-col items-center"
                  onClick={handleOpenBlockConfirm}
                >
                  <img
                    src="/icons/block.svg"
                    onError={(e) => (e.target.style.display = "none")}
                    className="w-[1.75rem] h-[1.75rem] mb-1"
                    alt=""
                  />
                  <span className="text-[0.75rem]">차단</span>
                </button>
              </div>
            ) : (
              // 이미 차단된 상태 : 차단 해제만
              <button
                className="flex flex-col items-center"
                onClick={handleUnblock}
              >
                <img
                  src="/icons/block.svg"
                  onError={(e) => (e.target.style.display = "none")}
                  className="w-7 h-7 mb-1"
                  alt=""
                />
                <span className="text-[0.95rem]">차단 해제</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* 차단 확인 팝업 */}
      {blockConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 반투명 배경 */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={handleCloseBlockConfirm}
          />
          {/* 팝업 카드 */}
          <div className="relative bg-white rounded-[0.5rem] w-[18rem] max-w-[80%] text-center shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <p className="px-6 pt-6 pb-4 text-[0.875rem] text-[#111827]">
              {nickname}님을 차단할까요?
            </p>
            <div className="h-[1px] bg-[#E5E7EB]" />
            <button
              className="w-full py-3 text-[#FA502E] text-[1rem] font-semibold"
              onClick={handleBlock}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
