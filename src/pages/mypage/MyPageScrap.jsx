import React from "react";
import BottomNav from "../../components/main/BottomNav";
import { useNavigate } from "react-router-dom";

export default function MyPageScrap() {
  const navigate = useNavigate();

  const scrapped = [
    {
      id: 1,
      title: "인간이 믿음을 갖는 이유는 무엇인가?",
      category: "대분류 / 소분류",
      date: "2025.10.10",
      thumbnail: "/sample4.jpg",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      {/* 상단 */}
      <div className="px-[1.5rem] mt-[1.5rem] flex items-center">
        <button
          className="mr-2"
          onClick={() => navigate("/mypage")}
        >
          <img src="/icons/arrow-left.svg" className="w-[0.5369rem] h-[0.9281rem]" alt="뒤로" />
        </button>
        <p className="text-[1.2rem] font-bold">아카이브</p>
      </div>

      {/* 탭 */}
      <div className="flex justify-start ml-[1.5rem] gap-[2.25rem] mt-[1.5rem] text-[1.125rem] font-semibold">
        <button onClick={() => navigate("/mypage/chats")}>대화</button>
        <button className="text-[#FA502E] border-b-2 border-[#FA502E] pb-1">
          스크랩
        </button>
      </div>

      <div className="px-[1.5rem] mt-[1.5rem]">
        <span className="text-[1rem] font-semibold">전체 {scrapped.length}</span>
      </div>

      <div className="px-[1.5rem] mt-[1.25rem] overflow-y-auto pb-[8rem]">
        {scrapped.map((item) => (
          <div key={item.id} className="flex gap-[1rem] mb-[2rem]">
            <img
              src={item.thumbnail}
              className="w-[4rem] h-[4rem] rounded-md object-cover"
            />
            <div>
              <p className="text-[#91969A] text-[0.875rem]">{item.category}</p>
              <p className="text-[1.1rem] font-semibold">{item.title}</p>
              <p className="text-[0.9rem] text-[#6B7280]">{item.date}</p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
