// src/screens/main/DetailScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getQuestionDetail,
  participateQuestion,
  cancelParticipateQuestion,
} from "../../lib/questionService";

// (필요하면 상태 라벨로 써먹을 수 있는 함수 - 지금은 버튼 분기에만 status 직접 씀)
const getStatusLabel = (status, current, max) => {
  if (!status) return null;

  switch (status) {
    case "RECRUITING":
      if (max && current >= max) return "진행중";
      return "참여 가능";
    case "PROGRESS":
    case "IN_PROGRESS":
      return "진행중";
    case "COMPLETED":
    case "DONE":
    case "FINISHED":
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

  // 참여/취소 팝업 상태 ("participate" | "cancel" | "error" | null)
  const [popup, setPopup] = useState(null);

//   useEffect(() => {
//   if (!questionId) return;

//   const fetchDetail = async () => {
//     try {
//       setLoading(true);
//       const detailRes = await getQuestionDetail(questionId);
//       setData(detailRes);
//       console.log("질문 상세 정보:", detailRes);
//     } catch (e) {
//       console.error(e);
//       setError("질문 정보를 불러오지 못했어요.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchDetail();
// }, [questionId]);


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

  const item = data;

  // 시작 모드
  const isWithReady = item.startMode === "WITH_READY";
  const isAllReady = item.startMode === "ALL_READY";

  // 백엔드에서 내려주는 내 참여 상태 (없으면 NONE)
  const myStatus = item.myParticipationStatus || "NONE";

  const statusLabel = getStatusLabel(
    item.questionStatus,
    item.currentParticipants,
    item.maxParticipants
  );
  const isJoinable = statusLabel === "참여 가능";

  // 대화 내역 보기 버튼
  const handleWatchChatClick = () => {
    navigate("/chat", {
      state: {
        questionId: item.questionId,
        roomId: item.roomId || item.questionId,
        questionTitle: item.questionTitle,
        status: item.questionStatus,
      },
    });
  };

  // 참여하기 / 참여 취소 버튼
  const handleToggleParticipate = async () => {
    try {
      if (myStatus === "NONE") {
        // 참여 신청
        await participateQuestion(questionId);
        setData((prev) =>
          prev ? { ...prev, myParticipationStatus: "WAITING" } : prev
        );
        setPopup("participate");
      } else if (myStatus === "WAITING") {
        // 대기 중 취소
        await cancelParticipateQuestion(questionId);
        setData((prev) =>
          prev ? { ...prev, myParticipationStatus: "NONE" } : prev
        );
        setPopup("cancel");
      } else {
        // JOINED 등은 여기서 처리 안 함 (아래에서 대화보기 버튼으로만 이동)
        return;
      }
    } catch (e) {
      console.error("참여 API 실패", e);
      setPopup("error");
    } finally {
      setTimeout(() => setPopup(null), 2000);
    }
  };

  // 하단 버튼에서 쓸 라벨/스타일 결정
  let bottomLabel = "";
  let bottomClass = "";

  if (item.questionStatus === "FINISHED" || myStatus === "JOINED") {
    // 끝났거나, 내가 이미 참여해서 방이 있는 경우 → 대화 내역 보기
    bottomLabel = "대화 내역 보기";
    bottomClass = "bg-[#191D1F] text-white";
  } else if (isJoinable) {
    // 참여 가능 상태일 때만 참여/취소 버튼
    if (myStatus === "WAITING") {
      bottomLabel = "참여 취소";
      bottomClass = "bg-[#B5BBC1] text-white";
    } else {
      bottomLabel = "참여하기";
      bottomClass = "bg-[#FA502E] text-white";
    }
  } else {
    // 진행중인데 나는 참여자가 아님 → 안내 문구만
    bottomLabel = "";
    bottomClass = "";
  }

  const handleBottomButtonClick = () => {
    if (!bottomLabel) return;

    // 대화 내역 보기
    if (bottomLabel === "대화 내역 보기") {
      handleWatchChatClick();
    } else {
      // 참여하기 / 참여 취소
      handleToggleParticipate();
    }
  };

  // 💡 createdAt: "2025-11-27 13:00:10"  (UTC라고 가정)
  const formatKoreanTime = (raw) => {
    if (!raw) return "";

    let s = String(raw).trim();

    // "2025-11-27 13:00:10" 형태면 → "2025-11-27T13:00:10Z" 로 바꿔서
    // **UTC 기준** 으로 해석하게 만들기
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
      s = s.replace(" ", "T") + "Z";
    }

    const date = new Date(s); // 이제 이 date는 2025-11-27T13:00:10.000Z (UTC)

    const formatter = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value || "";

    const year = get("year");
    const month = get("month");
    const day = get("day");
    const hour = get("hour");
    const minute = get("minute");

    return `${year}.${month}.${day} ${hour}:${minute}`;
  };


  


  return (
    <div className="flex flex-col min-h-screen bg-white font-[Pretendard]">
      {/* 참여/취소 팝업 */}
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
                    : popup === "cancel"
                    ? "참여가 취소되었어요"
                    : "참여 처리 중 오류가 발생했어요"}
                </p>

                {popup === "participate" && (
                  <p className="text-[0.75rem] text-[#3B3D40] leading-[1.3rem] mt-[0.25rem] whitespace-pre-line">
                    {"대화 인원이 모두 모이면 알려드릴게요.\n알림을 받으면 30초 안에 ‘준비 완료’를 눌러 참여할 수 있습니다."}
                  </p>
                )}

                {popup === "cancel" && (
                  <p className="text-[0.75rem] text-[#3B3D40] leading-[1.3rem] mt-[0.25rem] whitespace-pre-line">
                    {"다시 참여하려면 ‘참여하기’를 눌러주세요."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상단바 */}
      <div className="w-full flex items-center justify-between pl-[1.5rem] pr-[1.5rem] pt-[1.25rem] pb-[1.25rem] box-border shadow-[0_4px_5px_rgba(0,0,0,0.04)]">
        <button type="button" className="bg-[#FFFFFF] border-0" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.341565 8.2495L6.9414 14.8493L8.59106 13.1997L2.81606 7.42467L8.59106 1.64967L6.9414 0L0.341565 6.59983C0.122849 6.81862 -1.90735e-05 7.11531 -1.90735e-05 7.42467C-1.90735e-05 7.73402 0.122849 8.03072 0.341565 8.2495Z" fill="#191D1F"/>
          </svg>
        </button>
      </div>

      {/* 질문 */}
      <div className="px-6 mt-[1.5rem]">
        <img src="/icons/quote.svg" className="w-5 opacity-70" />
        <p className="mt-3 text-[1.15rem] font-semibold leading-[1.8rem]">
          {item.questionTitle}
        </p>

        {/* 작성자 */}
        <div className="flex items-center gap-2 mt-4">
          <img
            src="/icons/profile-gray.svg"
            className="w-[1.75rem] h-[1.75rem]"
          />
          <div className="flex flex-col">
            <span className="text-[#3B3D40] text-[0.75rem]">
              {item.hostNickname}
            </span>
            <span className="text-[#3B3D40] text-[0.625rem]">
              {formatKoreanTime(item.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* 책 백그라운드 + 책 이미지 */}
      <div className="relative w-full px-[1.5rem] mt-6">
        <div className="relative w-full h-[22rem] rounded-2xl overflow-hidden">
          <img
            src={item.imageUrl ?? "icons/image1.png"}
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex justify-center items-center">
            <img
              src={item.imageUrl ?? "icons/image1.png"}
              className="w-[10rem] h-[13rem] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] object-cover"
            />
          </div>
        </div>
      </div>

      {/* 책 제목 */}
      <div className="px-6 mt-5">
        <p className="text-[1.25rem] font-bold leading-[1.6rem]">
          {item.contentName}
        </p>
        <p className="text-[0.75rem] text-[#9CA3AF] mt-[0.5rem]">
          {item.mainCategory} &gt; {item.subCategory}
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
              {item.currentParticipants ?? 0}/{item.maxParticipants ?? 0}
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
        <p>{item.description}</p>
      </div>

      {/* 태그 */}
      <div className="px-6 mt-6 mb-[1.5rem] flex flex-wrap gap-2">
        {item.tags?.map((t, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-md bg-[#FFF2EE] text-[#FA502E] text-sm"
          >
            {t}
          </span>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-[0_-2px_10px_rgba(0,0,0,0.07)]">
        {bottomLabel ? (
          <button
            onClick={handleBottomButtonClick}
            className={`w-full h-[3.2rem] text-[1rem] rounded-xl font-semibold ${bottomClass}`}
          >
            {bottomLabel}
          </button>
        ) : (
          <div className="w-full flex items-center justify-center">
            <span className="text-[0.875rem] text-[#3B3D40] text-center">
              이 질문에 대한 대화가 진행중이에요. <br />
              대화 내역은 질문이 종료된 후에 열람이 가능합니다.
            </span>
          </div>
        )}
      </div>

      <div className="pb-[6rem]"></div>
    </div>
  );
}
