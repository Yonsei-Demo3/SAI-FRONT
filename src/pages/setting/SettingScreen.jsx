import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";

export default function SettingScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      {/* 상단바 */}
      <div className="px-[1.5rem] mt-[1.25rem] flex items-center">
        <button
          className="mr-[0.5rem]"
          onClick={() => navigate(-1)}
        >
          <img
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            className="w-[0.5369rem] h-[0.9281rem]"
          />
        </button>
        <h1 className="text-[1.25rem] font-bold">설정</h1>
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 overflow-y-auto w-full max-w-[500px] mx-auto pb-[6rem]">
        {/* SAI 계정 / 친구 섹션 */}
        <div className="mt-[2rem] border-t border-b border-[#E5E7EB]">
          {/* SAI 계정 */}
          <div className="w-full px-[1.5rem] py-[1rem]">
            <p className="text-[1rem] font-medium">SAI 계정</p>
            <p className="text-[0.875rem] text-[#6B7280] mt-[0.25rem]">
              ilovesai@naver.com
            </p>
          </div>

          {/* 친구 */}
          <button
            className="w-full px-[1.5rem] py-[1rem] text-left border-t border-[#E5E7EB]"
            onClick={() => navigate("/settings/friends")}
          >
            <p className="text-[1rem]">친구</p>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
