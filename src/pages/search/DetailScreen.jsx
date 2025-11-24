import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";
import { getQuestionDetail } from "../../lib/questionService";

export default function DetailScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const questionId = state?.questionId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!questionId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getQuestionDetail(questionId);
        setData(res);
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

  return (
    <div className="flex flex-col min-h-screen bg-white font-[Pretendard]">
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
              {item.createdAt ?? "방금"}
            </span>
          </div>
        </div>
      </div>

      {/* 책 백그라운드 + 책 이미지 */}
      <div className="relative w-full px-[1.5rem] mt-6">
        <div className="relative w-full h-[22rem] rounded-2xl overflow-hidden">
          <img
            src={item.imageUrl}
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          />
          {/* 반투명 레이어 */}
          <div className="absolute inset-0 bg-black/20"></div>
          {/* 가운데 원본 이미지 */}
          <div className="absolute inset-0 flex justify-center items-center">
            <img
              src={item.imageUrl}
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
        {/* <p className="text-sm text-[#6B7280] mt-1">{item.mainCategory} &gt; {item.subCategory}</p> */}
        <div className="w-full h-[0.05rem] bg-[#E5E5E5] my-4"></div>
      </div>

      {/* 참여 인원 - 상세 응답에 없으면 일단 0으로 */}
      <div className="px-6">
        <p className="text-[1rem] font-semibold">현재 참여한 인원</p>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center bg-[#F2F4F8] px-2 py-1 rounded-md">
            <img src="/icons/people.svg" className="w-5 h-5 mr-1" />
            <span className="text-sm">{item.currentParticipants ?? 0}/{item.maxParticipants ?? 0}</span>
          </div>

          <button className="px-3 py-1 bg-[#64a201] text-white rounded-md text-sm">
            준비된 인원끼리 바로 시작
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

      {/* 참여하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-[0_-2px_10px_rgba(0,0,0,0.07)]">
        <button className="w-full h-[3.2rem] bg-[#FA502E] text-white text-[1rem] rounded-xl font-semibold">
          참여하기
        </button>
      </div>

      <div className="pb-[6rem]"></div>
    </div>
  );
}
