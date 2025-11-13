import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupScreen() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    user_id: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white mx-auto relative font-[Pretendard]">
      {/* 상단 헤더 */}
      <div className="flex items-center w-full mt-[4.19rem] mb-[2.5rem]">
        <img
          src="/icons/back.png"
          alt="Back"
          className="w-[0.875rem] h-[1.75rem] ml-[1.5rem] mr-[0.75rem] cursor-pointer"
          onClick={() => navigate("/login")}
        />
        <span className="text-[1.25rem] font-semibold">회원가입</span>
      </div>

      {/* 입력 폼 */}
      <div className="w-[20.4rem] flex flex-col gap-[1rem]">

        {/* 이메일 */}
        <div className="relative">
          <div className="flex flex-col justify-center border border-[#D0D6DD] rounded-[0.5rem] h-[3.75rem] px-[1rem]">
            <label className="text-[0.625rem] text-[#9EA4AA] font-medium mb-[0.2rem]">
              이메일 <span className="text-[#FA502E]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="text-[1rem] text-[#000] placeholder-[#C2C6CA] focus:outline-none border-none"
            />
          </div>
        </div>

        {/* 아이디 */}
        <div className="relative">
          <div className="flex flex-col justify-center border border-[#D0D6DD] rounded-[0.5rem] h-[3.75rem] px-[1rem]">
            <label className="text-[0.625rem] text-[#9EA4AA] font-medium mb-[0.2rem]">
              아이디 <span className="text-[#FA502E]">*</span>
            </label>
            <input
              type="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="아이디 입력"
              className="text-[1rem] text-[#000] placeholder-[#C2C6CA] focus:outline-none border-none"
            />
          </div>
          <p className="text-[0.75rem] text-[#9EA4AA] mt-[0.37rem] ml-[0.3rem]">
            영문, 숫자, 특수문자 사용 가능 8~16자
          </p>
        </div>

        {/* 비밀번호 */}
        <div className="relative">
          <div className="flex flex-col justify-center border border-[#D0D6DD] rounded-[0.5rem] h-[3.75rem] px-[1rem] mt-[-0.5rem]">
            <label className="text-[0.625rem] text-[#9EA4AA] font-medium mb-[0.2rem]">
              비밀번호 <span className="text-[#FA502E]">*</span>
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
          <p className="text-[0.75rem] text-[#9EA4AA] mt-[0.37rem] ml-[0.3rem]">
            영문, 숫자 포함 8~32자
          </p>
        </div>

        {/* 가입하기 버튼 */}
        <button
          className="h-[3.25rem] bg-[#FA502E] text-[#FFFFFF] text-[1rem] rounded-[0.5rem] px-[1rem] py-[0.5rem] mt-[0.5rem] hover:opacity-90 focus:outline-none border-none"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
