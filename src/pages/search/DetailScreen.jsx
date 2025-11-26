// src/screens/main/DetailScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getQuestionDetail, participateQuestion } from "../../lib/questionService";
import { getChatList } from "../../lib/chatService";

// 상태값 → 라벨 변환 (참여 가능 / 진행중 / 종료)
const getStatusLabel = (status, current, max) => {
  if (!status) return null;

  switch (status) {
    case "RECRUITING":
      // 자리가 다 찼으면 진행중으로 본다
      if (max && current >= max) return "진행중";
      return "참여 가능";
    case "PROGRESS":
    case "IN_PROGRESS":
      return "진행중";
    case "COMPLETED":
    case "DONE":
      return "종료";
    default:
      return null;
  }
};

export default function DetailScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const questionId = state?.questionId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // 참여 팝업 상태
  const [popup, setPopup] = useState(null);

  useEffect(() => {
  if (!questionId) return;

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const detailRes = await getQuestionDetail(questionId);
      setData(detailRes);
      console.log("질문 상세 정보:", detailRes);

    } catch (e) {
      console.error(e);
      setError("질문 정보를 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  fetchDetail();
}, [questionId]);

  if (!questionId) {
    return <div>잘못된 접근입니다.</div>;
  }

  if (loading) {
    return <div className="p-6">불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-6">{error}</div>;
  }

  // 상세 정보 기준으로 상태 라벨 계산
  const statusLabel = getStatusLabel(
    data.questionStatus,
    data.currentParticipants,
    data.maxParticipants
  );
  const isJoinable = statusLabel === "참여 가능";
  const isWithReady = data.startMode === "WITH_READY";
  const isAllReady = data.startMode === "ALL_READY";

  // 하단 버튼 클릭 처리

  const handleWatchChatClick = async () => {
    navigate("/chat", {
        state: {
          questionId: data.questionId,
          roomId: data.roomId,
          questionTitle: data.questionTitle,
          status: data.questionStatus,
        }
      });
  }

  const handleBottomButtonClick = async () => {

    // 참여 가능한 상태가 아니면 → 대화 내역 보기
    if (!data.questionStatus === "FINISHED") {
      navigate("/chat", {
        state: {
          questionId: data.questionId,
          roomId: data.roomId,
          questionTitle: data.questionTitle,
          status: data.questionStatus,
        },
      });
      return;
    }

    // 참여 가능한 상태일 때 → 참여 API 호출 + 팝업
    try {
      await participateQuestion(questionId);
      setPopup("participate");
    } catch (e) {
      console.error("참여 API 실패", e);
      setPopup("error");
    } finally {
      setTimeout(() => setPopup(null), 2000);
    }
  };

  const handleParticipateClick = async () => {
        try {
      await participateQuestion(questionId);
      setPopup("participate");
    } catch (e) {
      console.error("참여 API 실패", e);
      setPopup("error");
    } finally {
      setTimeout(() => setPopup(null), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-[Pretendard]">
      {/* 참여 팝업 */}
      {popup && (
        <div className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 w-[100%] max-w-[500px] p-4 z-[200] animate-slide-down">
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#F2F2F2]">
            <div className="flex items-start gap-3">
              <img
                src="/icons/popup-check.svg"
                className="w-[1.2rem] h-[1.2rem] mt-[0.2rem]"
                alt=""
              />
              <div className="flex flex-col">
                <p className="text-[0.875rem] font-bold text-[#3B3D40] leading-[1.4rem]">
                  {popup === "participate"
                    ? "질문 참여가 등록되었습니다"
                    : "이미 참여한 질문이에요"}
                </p>
                {popup === "participate" && (
                  <p className="text-[0.75rem] text-[#3B3D40] leading-[1.3rem] mt-[0.25rem] whitespace-pre-line">
                    {"대화 인원이 모두 모이면 알려드릴게요.\n알림을 받으면 30초 안에 ‘준비 완료’를 눌러 참여할 수 있습니다."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상단바 */}
      <div className="flex items-center justify-between px-6 pt-10 pb-4">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" className="w-5 h-5" />
        </button>
      </div>

      {/* 질문 */}
      <div className="px-6 mt-[1.5rem]">
        <img src="/icons/quote.svg" className="w-5 opacity-70" />
        <p className="mt-3 text-[1.15rem] font-semibold leading-[1.8rem]">
          {data.questionTitle}
        </p>

        {/* 작성자 */}
        <div className="flex items-center gap-2 mt-4">
          <img
            src="/icons/profile-gray.svg"
            className="w-[1.75rem] h-[1.75rem]"
          />
          <div className="flex flex-col">
            <span className="text-[#3B3D40] text-[0.75rem]">
              {data.hostNickname}
            </span>
            <span className="text-[#3B3D40] text-[0.625rem]">
              {data.createdAt ?? "방금"}
            </span>
          </div>
        </div>
      </div>

      {/* 책 백그라운드 + 책 이미지 */}
      <div className="relative w-full px-[1.5rem] mt-6">
        <div className="relative w-full h-[22rem] rounded-2xl overflow-hidden">
          <img
            src={data.imageUrl}
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          />
          {/* 반투명 레이어 */}
          <div className="absolute inset-0 bg-black/20"></div>
          {/* 가운데 원본 이미지 */}
          <div className="absolute inset-0 flex justify-center items-center">
            <img
              src={data.imageUrl}
              className="w-[10rem] h-[13rem] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] object-cover"
            />
          </div>
        </div>
      </div>

      {/* 책 제목 */}
      <div className="px-6 mt-5">
        <p className="text-[1.25rem] font-bold leading-[1.6rem]">
          {data.contentName}
        </p>
        <p className="text-[0.75rem] text-[#9CA3AF] mt-[0.5rem]">
            {data.mainCategory} &gt; {data.subCategory}
        </p>
        <div className="w-full h-[0.05rem] bg-[#E5E5E5] my-4"></div>
      </div>

      {/* 참여 인원 */}
      <div className="px-6">
        <p className="text-[1rem] font-bold">현재 참여한 인원</p>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center bg-[#F2F4F8] px-2 py-1 rounded-md">
            <img src="/icons/people.svg" className="w-5 h-5 mr-1" />
            <span className="text-sm">
              {data.currentParticipants ?? 0}/{data.maxParticipants ?? 0}
            </span>
          </div>

          <button
            className={`px-3 py-1 rounded-md text-sm text-white
              ${isWithReady ? "bg-[#64a201]" : ""}
              ${isAllReady ? "bg-[#FA502E]" : ""}
            `}
          >
            {isWithReady && "준비된 인원끼리 바로 시작"}
            {isAllReady && "모든 인원이 준비되면 시작"}
            {!isWithReady && !isAllReady && "준비된 인원끼리 시작"}
          </button>
        </div>
      </div>

      {/* 본문 텍스트 */}
      <div className="px-6 mt-6 text-[0.95rem] leading-[1.65rem] text-[#444]">
        <p>{data.description}</p>
      </div>

      {/* 태그 */}
      <div className="px-6 mt-6 mb-[1.5rem] flex flex-wrap gap-2">
        {data.tags?.map((t, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-md bg-[#FFF2EE] text-[#FA502E] text-sm"
          >
            {t}
          </span>
        ))}
      </div>

      {/* 하단 버튼 : 참여하기 / 대화 내역 보기 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-[0_-2px_10px_rgba(0,0,0,0.07)]">
        
        {data.questionStatus === "RECRUITING" && (
           <button
            onClick={handleParticipateClick}
            className="w-full h-[3.2rem] text-[1rem] rounded-xl bg-[#FA502E]"
          >
            <span className="font-semibold text-[1rem] text-white">
              참여하기
            </span>
          </button>
        )}

        {data.questionStatus === "FINISHED" && (
          <button
            onClick={handleWatchChatClick}
            className="w-full h-[3.2rem] text-[1rem] rounded-xl font-semibold bg-[#191D1F]"
          >
            <span className="font-semibold text-[1rem] text-white">
              대화 내역 보기
            </span>
          </button>
        )}
        
        {data.questionStatus !== "FINISHED" && data.questionStatus !=="RECRUITING" && (
          <div className="w-full flex items-center justify-center">
            <span className="text-[0.875rem] text-[#3B3D40] text-center">
              이 질문에 대한 대화가 진행중이에요. <br/>대화 내역은 질문이 종료된 후에 열람이 가능합니다.
            </span>

          </div>
        )}

      </div>

      <div className="pb-[6rem]"></div>
    </div>
  );
}
