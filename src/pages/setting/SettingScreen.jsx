import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";
import { getMyInfo } from "../../lib/memberService";
import { logout } from "../../lib/loginService";

export default function SettingScreen() {
  const navigate = useNavigate();

  // 내 정보 상태
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // 처음 마운트될 때 내 정보 가져오기
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMyInfo();
        setNickname(me.nickname || "");
        setEmail(me.email || "");
      } catch (e) {
        console.error("내 정보 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = async () => {
    const ok = window.confirm("로그아웃 하시겠어요?");
    if (!ok) return;

    try {
      await logout();
    } catch (e) {
      console.error("로그아웃 API 실패:", e);
    } finally {
      // 로컬 토큰 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken"); // 쓰고 있으면

      // 로그인 화면(또는 홈)으로 이동
      navigate("/login", { replace: true });
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
        <h1 className="text-[1.25rem] font-bold">설정</h1>
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 overflow-y-auto w-full max-w-[500px] mx-auto pb-[6rem]">
        {/* 프로필 영역 */}
        <div className="mt-[2rem] px-[1.5rem] flex items-center">
          <div className="w-[2.5rem] h-[2.5rem] flex items-center justify-center overflow-hidden">
            <img
              src="/icons/profile-avatar.svg"
              alt="프로필"
              className="w-[3rem] h-[3rem]"
            />
          </div>
          <p className="ml-[0.75rem] text-[1.1rem] font-semibold text-[#111827]">
            {loading ? "…" : nickname || "닉네임"}
          </p>
        </div>

        {/* SAI 계정 / 친구 섹션 */}
        <div className="mt-[2rem] border-t border-b border-[#E5E7EB]">
          {/* SAI 계정 + 이메일 */}
          <div className="w-full px-[1.5rem] py-[1rem]">
            <p className="text-[1rem] font-medium">SAI 계정</p>
            <p className="text-[0.875rem] text-[#6B7280] mt-[0.25rem]">
              {loading ? "" : email}
            </p>
          </div>

          {/* 비밀번호 변경 */}
          <button
            className="w-full px-[1.5rem] py-[1rem] flex items-center justify-between border-t border-[#E5E7EB]"
          >
            <span className="text-[1rem]">비밀번호 변경</span>
            <img
              src="/icons/chevron-right.svg"
              alt=""
              className="w-[0.4rem] h-[0.7rem]"
            />
          </button>

          {/* 이메일 변경 */}
          <button
            className="w-full px-[1.5rem] py-[1rem] flex items-center justify-between border-t border-[#E5E7EB]"
          >
            <span className="text-[1rem]">이메일 변경</span>
            <img
              src="/icons/chevron-right.svg"
              alt=""
              className="w-[0.4rem] h-[0.7rem]"
            />
          </button>

          {/* 친구 (친구 화면으로 이동) */}
          <button
            className="w-full px-[1.5rem] py-[1rem] flex items-center justify-between border-t border-[#E5E7EB]"
            onClick={() => navigate("/settings/friends")}
          >
            <span className="text-[1rem]">친구</span>
            <img
              src="/icons/chevron-right.svg"
              alt=""
              className="w-[0.4rem] h-[0.7rem]"
            />
          </button>
        </div>

        {/* 기타 설정 섹션 */}
        <div className="mt-[1.5rem] border-t border-b border-[#E5E7EB]">
          <div className="w-full px-[1.5rem] py-[1rem] flex items-center justify-between">
            <span className="text-[1rem]">앱 버전</span>
            <span className="text-[0.875rem] text-[#6B7280]">
              1.0.0
            </span>
          </div>

          {/* 문의하기 */}
          <button
            className="w-full px-[1.5rem] py-[1rem] flex items-center justify-between border-t border-[#E5E7EB]"
          >
            <span className="text-[1rem]">문의하기</span>
            <img
              src="/icons/chevron-right.svg"
              alt=""
              className="w-[0.4rem] h-[0.7rem]"
            />
          </button>

          {/* 이용 제한 내역 */}
          <button
            className="w-full px-[1.5rem] py-[1rem] flex items-center justify-between border-t border-[#E5E7EB]"
          >
            <span className="text-[1rem]">이용 제한 내역</span>
            <img
              src="/icons/chevron-right.svg"
              alt=""
              className="w-[0.4rem] h-[0.7rem]"
            />
          </button>

          {/* 커뮤니티 이용 규칙 */}
          <button
            className="w-full px-[1.5rem] py-[1rem] flex items-center justify-between border-t border-[#E5E7EB]"
          >
            <span className="text-[1rem]">커뮤니티 이용 규칙</span>
            <img
              src="/icons/chevron-right.svg"
              alt=""
              className="w-[0.4rem] h-[0.7rem]"
            />
          </button>
        </div>

        {/* 로그아웃 */}
        <div className="mt-[2rem] border-t border-[#E5E7EB]">
          <button
            className="w-full px-[1.5rem] py-[1rem] text-left text-[#EF4444] text-[1rem] font-medium"
            onClick={handleLogout}
          >
            로그아웃
          </button>
      </div>
    </div>

      <BottomNav />
    </div>
  );
}
