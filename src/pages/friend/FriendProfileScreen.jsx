// src/screens/friend/FriendProfileScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  getBlocksList,
  blockFriends,
  unblockFriends,
  getFriendList,
  getOutgoingFriendRequests,
} from "../../lib/friendService";
import { getMyInfo } from "../../lib/memberService";

export default function FriendProfileScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { memberId: memberIdParam } = useParams();

  const memberId = memberIdParam || state?.memberId;
  const nickname = state?.nickname ?? "익명";
  const profileImage = "/icons/profile-avatar.svg";

  const [isBlocked, setIsBlocked] = useState(false);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const [myMemberId, setMyMemberId] = useState(null);
  const [meLoading, setMeLoading] = useState(true);

  // ✅ 내 정보 조회
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMyInfo();
        setMyMemberId(me.memberId);
      } catch (e) {
        console.error("내 정보 조회 실패", e);
      } finally {
        setMeLoading(false);
      }
    };
    fetchMe();
  }, []);

  const isMe =
    !meLoading &&
    myMemberId != null &&
    String(myMemberId) === String(memberId);

  // ✅ 차단 여부 (내 프로필 아닐 때만)
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

  // ✅ 친구 여부 + 내가 보낸 친구 요청(PENDING) 여부
  useEffect(() => {
    if (!memberId) return;

    const fetchRelation = async () => {
      try {
        const [friends, outgoing] = await Promise.all([
          getFriendList(),
          getOutgoingFriendRequests(),
        ]);

        const friendFound = friends.some(
          (f) => String(f.memberId) === String(memberId)
        );
        setIsFriend(friendFound);

        const pendingFound = outgoing.some(
          (req) =>
            String(req.toMemberId) === String(memberId) &&
            req.status === "PENDING"
        );

        setIsRequestPending(friendFound ? false : pendingFound);
      } catch (e) {
        console.error("친구/보낸 요청 관계 조회 실패", e);
      }
    };

    fetchRelation();
  }, [memberId]);

  const handleOpenBlockConfirm = () => setBlockConfirmOpen(true);
  const handleCloseBlockConfirm = () => setBlockConfirmOpen(false);

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

  const handleUnblock = async () => {
    try {
      await unblockFriends(memberId);
      setIsBlocked(false);
    } catch (e) {
      console.error("차단 해제 실패", e);
      alert("차단 해제에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  const goToAddFriend = () => {
    navigate("/friend/add", {
      state: { memberId, nickname, profileImage },
    });
  };

  // ✅ 여기부터는 hooks 다 호출된 뒤라 return 해도 됨
  if (!memberId) {
    return (
      <div className="flex items-center justify-center h-screen">
        잘못된 접근입니다.
      </div>
    );
  }

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

      {!isMe && (
        <>
          <div className="h-[1px] w-full bg-white/40" />

          <div className="pb-10 pt-6 flex justify-center">
            {isBlocked ? (
              /* 1) 이미 차단된 상태 → 차단 해제만 */
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
            ) : isFriend ? (
              /* 2) 이미 친구인 상태 → '차단'만 */
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
            ) : isRequestPending ? (
              /* 3) 내가 친구 신청 보내놓고 답 기다리는 상태 */
              <div className="flex w-full max-w-[320px] gap-[4rem] items-center justify-center">
                <button
                  className="flex flex-col items-center opacity-70 cursor-default"
                  disabled
                >
                  <img
                    src="/icons/friend-plus.svg"
                    onError={(e) => (e.target.style.display = "none")}
                    className="w-[1.75rem] h-[1.75rem] mb-1"
                    alt=""
                  />
                  <span className="text-[0.75rem]">친구 요청 중</span>
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
              /* 4) 아무 관계도 아님 → 친구 추가 + 차단 */
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
            )}
          </div>
        </>
      )}

      {blockConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={handleCloseBlockConfirm}
          />
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
