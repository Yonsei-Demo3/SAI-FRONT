import React, { useState } from "react";

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white mx-auto relative font-[Pretendard]">

      {/* 로고 */}
      <img
        src="/icons/logo.svg"
        alt="Logo"
        className="w-[2.5rem] h-[4.5rem] mb-[1.5rem] mt-[7rem]"
      />

      <div className="w-[20.4rem] flex flex-col gap-[1rem]">
        {/* 입력 폼 */}
        <div className="relative">
          <div className="flex flex-col justify-center border border-[#D0D6DD] rounded-[0.5rem] h-[3.75rem] px-[1rem]">
            <label className="text-[0.625rem] text-[#9EA4AA] font-medium mb-[0.2rem]">
              아이디 
            </label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="아이디 입력"
              className="text-[1rem] text-[#000] placeholder-[#C2C6CA] focus:outline-none border-none"
            />
          </div>
        </div>

        <div className="relative">
          <div className="flex flex-col justify-center border border-[#D0D6DD] rounded-[0.5rem] h-[3.75rem] px-[1rem]">
            <label className="text-[0.625rem] text-[#9EA4AA] font-medium mb-[0.2rem]">
              비밀번호 
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              className="text-[1rem] text-[#000] placeholder-[#C2C6CA] focus:outline-none border-none"
            />
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          className="h-[3.25rem] bg-[#FA502E] text-[#FFFFFF] text-[1rem] leading-[2.25rem] rounded-[0.5rem] px-[1rem] py-[0.5rem] mt-[0.5rem] hover:opacity-90 focus:outline-none focus:ring-none border-none"
        >
          로그인
        </button>
      </div>

      {/* 하단 링크 */}
      <div className="flex items-center justify-end gap-[0.375rem] mt-[0.5rem] text-[0.875rem] text-gray-500 w-full pr-[2.5rem]">
        <a
          href="/signup"
          className="hover:text-[#FA502E] no-underline"
          style={{ color: "#B5BBC1" }}
        >
          회원가입
        </a>
        <span className="text-[#B5BBC1]">|</span>
        <a
          href="/find-id-pw"
          className="hover:text-[#FA502E] no-underline"
          style={{ color: "#B5BBC1" }}
        >
          ID/PW 찾기
        </a>
      </div>

      {/* SNS 로그인 구분선 및 버튼 */}
      <div className="flex flex-col items-center w-full">
        <div className="w-full flex itmes-center justify-center mt-[1.25rem]">
          <img
            src="/icons/line.png"
            alt="line"
            className="w-[6.25rem] h-[0.0625rem]"
          />
          <div className="text-[0.75rem] text-[#B5BBC1] ml-[1.31rem] mb-[1rem] mt-[-0.5rem]">
          SNS 간편 로그인
          </div>
          <img
            src="/icons/line.png"
            alt="line"
            className="w-[6.25rem] h-[0.0625rem] ml-[1.31rem]"
          />
        </div>


        <div className="flex gap-[1.5rem]">
          <img
            src="/icons/kakao.svg"
            alt="Kakao Login"
            className="w-[2.5rem] h-[2.5rem]"
          />
          <img
            src="/icons/Naver.svg"
            alt="Naver Login"
            className="w-[2.5rem] h-[2.5rem]"
          />
        </div>
      </div>
    </div>
  );
}
