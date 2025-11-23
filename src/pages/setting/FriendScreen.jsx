import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";

// ✅ 방금 만든 서비스 import
import {
  getIncomingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../lib/friendService";

export default function FriendsScreen() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("friends");
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [unblockPopupOpen, setUnblockPopupOpen] = useState(false);

  // 친구 목록 (여기는 아직 더미)
  const [friends, setFriends] = useState([
    { id: 1, name: "멋쟁이 호랭이" },
    { id: 2, name: "멋쟁이 감귤" },
    { id: 3, name: "멋쟁이 감귤" },
  ]);

  // ✅ 친구 신청 목록: 처음엔 빈 배열, API로 채움
  const [requests, setRequests] = useState([]);

  // 차단 목록 (예시)
  const [blocked, setBlocked] = useState([{ id: 201, name: "짜증나는 악어" }]);

  // ✅ 마운트 시 받은 친구 요청 목록 불러오기
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const list = await getIncomingFriendRequests();
        // 스웨거 예시 기준: requestId, requesterNickname, message 사용
        const mapped = list.map((item) => ({
          id: item.requestId,
          name: item.requesterNickname,
          message: item.message,
        }));
        setRequests(mapped);
      } catch (error) {
        console.error("친구 요청 목록 불러오기 실패:", error);
      }
    };

    fetchRequests();
  }, []);

  // ✅ 수락
  const handleAccept = async (id) => {
    try {
      // 1) 서버에 수락 요청
      await acceptFriendRequest(id);

      // 2) UI 업데이트 (기존 로직 유지)
      const req = requests.find((r) => r.id === id);
      if (!req) return;

      setFriends((prev) => [...prev, { id: req.id, name: req.name }]);
      setRequests((prev) => prev.filter((r) => r.id !== id));

      // 3) 팝업 열기
      setShowAcceptModal(true);
    } catch (error) {
      console.error("친구 수락 실패:", error);
    }
  };

  // ✅ 거절
  const handleReject = async (id) => {
    try {
      await rejectFriendRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("친구 거절 실패:", error);
    }
  };

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
        <h1 className="text-[1.25rem] font-bold">친구</h1>
      </div>

      {/* 탭 영역 */}
      <div className="mt-[1.5rem] px-[1.5rem] flex items-center gap-[1.5rem] border-b border-[#E5E7EB]">
        {/* 친구 사이 */}
        <button
          className={`pb-[0.75rem] text-[1rem] ${
            activeTab === "friends"
              ? "font-semibold text-[#111827] border-b-2 border-[#FA502E]"
              : "text-[#6B7280]"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          친구 사이
        </button>

        {/* 신청 */}
        <button
          className={`relative pb-[0.75rem] flex items-center gap-[0.4rem] text-[1rem] ${
            activeTab === "requests"
              ? "font-semibold text-[#111827] border-b-2 border-[#FA502E]"
              : "text-[#6B7280]"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          <span>신청</span>
          {requests.length > 0 && (
            <span className="min-w-[1.25rem] h-[1.25rem] rounded-full bg-[#FA502E] text-white text-[0.75rem] flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>

        {/* 차단 목록 */}
        <button
          className={`pb-[0.75rem] text-[1rem] ${
            activeTab === "blocked"
              ? "font-semibold text-[#111827] border-b-2 border-[#FA502E]"
              : "text-[#6B7280]"
          }`}
          onClick={() => setActiveTab("blocked")}
        >
          차단 목록
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto w-full max-w-[500px] mx-auto pb-[6rem]">
        {/* 친구 사이 탭 */}
        {activeTab === "friends" && (
          <>
            <div className="px-[1.5rem] mt-[1.25rem] mb-[0.75rem]">
              <p className="text-[0.875rem] text-[#4B5563]">
                전체 {friends.length}
              </p>
            </div>
            <div className="flex flex-col">
              {friends.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center px-[1.5rem] py-[0.75rem]"
                >
                  <div className="w-[2.75rem] h-[2.75rem] rounded-full bg-[#E5E7EB] flex items-center justify-center overflow-hidden">
                    <img
                      src="/icons/profile-avatar.svg"
                      alt="프로필"
                      className="w-[2.5rem] h-[2.5rem]"
                    />
                  </div>
                  <p className="ml-[0.75rem] text-[1rem] text-[#111827]">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 신청 탭 */}
        {activeTab === "requests" && (
          <div className="px-[1.5rem] mt-[1.5rem]">
            <p className="text-[1rem] font-semibold mb-[0.25rem]">
              친구 신청을 받았어요
            </p>
            <p className="text-[0.75rem] text-[#3B3D40] mb-[1.25rem] leading-[1.4rem]">
              친구가 되면 친구목록에 서로가 추가되고, 친구가 질문을 등록할 경우
              알림을 받을 수 있어요.
            </p>

            {requests.map((req) => (
              <div key={req.id} className="mb-[1.25rem]">
                {/* 카드(프로필 + 메시지) 영역 */}
                <div className="bg-white border border-[#E5E7EB] rounded-[1.25rem] rounded-tl-none px-[1.25rem] pt-[0.75rem] pb-[1rem]">
                  {/* 이름 + 프로필 */}
                  <div className="flex items-center">
                    <div className="w-[2.5rem] h-[2.5rem] flex items-center justify-center overflow-hidden">
                      <img
                        src="/icons/profile-avatar.svg"
                        alt="프로필"
                        className="w-[2.5rem] h-[2.5rem]"
                      />
                    </div>
                    <p className="ml-[0.75rem] text-[0.875rem] font-medium text-[#111827]">
                      {req.name}
                    </p>
                  </div>

                  {/* 메시지 */}
                  <p className="mt-[0.25rem] ml-[3.25rem] text-[0.875rem] text-[#191D1F] leading-[1.6rem]">
                    “{req.message}”
                  </p>
                </div>

                {/* 버튼 영역 – 카드 밖, 아래쪽에 따로 */}
                <div className="flex gap-[0.56rem] mt-[0.75rem]">
                  <button
                    className="flex-1 h-[1.8125rem] rounded-[1.25rem] bg-[#F2F4F8] text-[#3B3D40] text-[0.87rem] font-medium"
                    onClick={() => handleReject(req.id)}
                  >
                    거절
                  </button>
                  <button
                    className="flex-1 h-[1.8125rem] rounded-[1.25rem] bg-[#FA502E] text-white text-[0.87rem] font-medium"
                    onClick={() => handleAccept(req.id)}
                  >
                    수락
                  </button>
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <p className="mt-[2rem] text-[0.9rem] text-[#9CA3AF]">
                받은 친구 신청이 없어요.
              </p>
            )}
          </div>
        )}

        {/* 차단 목록 탭 */}
        {activeTab === "blocked" && (
          <>
            {/* 전체 개수 */}
            <div className="px-[1.5rem] mt-[1.25rem] mb-[0.75rem]">
              <p className="text-[0.875rem] text-[#4B5563]">
                전체 {blocked.length}
              </p>
            </div>

            {/* 차단 리스트 */}
            <div className="flex flex-col">
              {blocked.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-[1.5rem] py-[0.75rem]"
                >
                  {/* 왼쪽 : 프로필 + 이름 */}
                  <div className="flex items-center">
                    <div className="w-[2.75rem] h-[2.75rem] rounded-full bg-[#E5E7EB] flex items-center justify-center overflow-hidden">
                      <img
                        src="/icons/profile-avatar.svg"
                        alt="프로필"
                        className="w-[2.5rem] h-[2.5rem]"
                      />
                    </div>
                    <p className="ml-[0.75rem] text-[1rem] text-[#111827]">
                      {item.name}
                    </p>
                  </div>

                  {/* 오른쪽 : 차단 해제 버튼 */}
                  <button
                    className="px-[0.9rem] h-[1.75rem] rounded-full bg-[#F3F4F6] text-[0.75rem] text-[#4B5563] font-medium"
                    onClick={() => {
                      setBlocked((prev) =>
                        prev.filter((b) => b.id !== item.id)
                      );
                      setUnblockPopupOpen(true);
                    }}
                  >
                    차단 해제
                  </button>
                </div>
              ))}

              {blocked.length === 0 && (
                <p className="mt-[2rem] text-[0.9rem] text-[#9CA3AF] px-[1.5rem]">
                  차단한 친구가 없어요.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* 수락 팝업 */}
      {showAcceptModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.08)" }}
        >
          <div className="bg-white rounded-[0.5rem] w-[17.5rem] max-w-[80%] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
            <div className="px-6 py-5 text-center">
              <p className="text-[0.875rem] text-[#111827]">
                친구가 되었어요.
              </p>
            </div>
            <div className="h-[1px] bg-[#E5E7EB]" />
            <button
              className="w-full py-[0.9rem] text-[1rem] font-bold text-[#FA502E]"
              onClick={() => setShowAcceptModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 차단 해제 팝업 */}
      {unblockPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setUnblockPopupOpen(false)}
          />
          <div className="relative bg-white rounded-[1.5rem] w-[18rem] max-w-[80%] shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <p className="px-6 pt-6 pb-4 text-center text-[0.95rem] text-[#111827]">
              차단 해제되었습니다.
            </p>
            <div className="h-[1px] bg-[#E5E7EB]" />
            <button
              className="w-full py-3 text-[#FA502E] text-[1rem] font-semibold"
              onClick={() => setUnblockPopupOpen(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
