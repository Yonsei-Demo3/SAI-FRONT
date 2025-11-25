// src/screens/friend/FriendRequestScreen.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendFriendRequest } from "../../lib/friendService";

export default function FriendRequestScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const memberId = state?.memberId;
  const nickname = state?.nickname ?? "익명";
  const profileImage = state?.profileImage ?? "/icons/profile-avatar.svg";

  const [message, setMessage] = useState("저희 친한 ‘사이’ 되어봐요.");
  const [sending, setSending] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);

  if (!memberId) {
    return (
      <div className="flex items-center justify-center h-screen">
        잘못된 접근입니다.
      </div>
    );
  }

  const handleSend = async () => {
    if (!message.trim()) {
      alert("메시지를 입력해 주세요.");
      return;
    }

    try {
      setSending(true);
      await sendFriendRequest(memberId, message.trim());
      setShowDoneModal(true);
    } catch (e) {
      console.error("친구 신청 보내기 실패", e);
      alert("친구 신청 보내기에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSending(false);
    }
  };

  const handleCloseDoneModal = () => {
    setShowDoneModal(false);
    navigate(-1); // 다시 프로필 화면으로
  };

  const disabled = sending || showDoneModal;

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      {/* 상단바 */}
      <div className="px-[1.5rem] mt-[1.25rem] flex items-center">
        <button className="mr-[0.5rem]" onClick={() => navigate(-1)}>
          <img
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            className="w-[0.5369rem] h-[0.9281rem]"
          />
        </button>
        <h1 className="text-[1.25rem] font-bold">친구 추가</h1>
      </div>

      {/* 메인 내용 */}
      <div className="flex-1 overflow-y-auto w-full max-w-[500px] mx-auto pb-[6rem]">
        {/* 프로필 */}
        <div className="mt-[2.5rem] flex flex-col items-center">
          <div className="w-[6rem] h-[6rem] rounded-full bg-[#E5E7EB] overflow-hidden">
            <img
              src={profileImage}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-[1rem] text-[1.1rem] font-semibold text-[#111827]">
            {nickname}
          </p>
        </div>

        {/* 메시지 입력 박스 */}
        <div className="mt-[2.5rem] px-[1.5rem]">
          <div className="border border-[#D1D5DB] rounded-[1.25rem] px-[1rem] py-[0.75rem] min-h-[7rem]">
            <textarea
              className="w-full h-full resize-none outline-none border-none text-[0.95rem] text-[#111827] placeholder:text-[#D1D5DB]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
            />
          </div>

          <p className="mt-[0.75rem] text-[0.75rem] text-[#6B7280] leading-[1.4rem]">
            친구 요청에 보낼 메세지를 작성해보세요.
            <br />
            상대방이 친구 신청을 수락하면 친구가 질문을 등록할 때 알림을 받을 수
            있어요.
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-[1.5rem] pb-[2.25rem]">
        <button
          disabled={disabled}
          onClick={handleSend}
          className={`w-full h-[3rem] rounded-[999px] text-[1rem] font-semibold ${
            disabled ? "bg-[#D1D5DB] text-white" : "bg-[#FA502E] text-white"
          }`}
        >
          친구 신청 보내기
        </button>
      </div>

      {/* “친구 신청을 보냈어요!” 팝업 */}
      {showDoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={handleCloseDoneModal}
          />
          <div className="relative bg-white rounded-[1.5rem] w-[18rem] max-w-[80%] text-center shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <p className="px-6 pt-6 pb-4 text-[0.95rem] text-[#111827]">
              친구 신청을 보냈어요!
            </p>
            <div className="h-[1px] bg-[#E5E7EB]" />
            <button
              className="w-full py-3 text-[#FA502E] text-[1rem] font-semibold"
              onClick={handleCloseDoneModal}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
