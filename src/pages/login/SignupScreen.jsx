import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // axios import 추가
import { signup } from "../../lib/signupService";

export default function SignupScreen() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    user_id: "",
    password: "",
    nickname: "",  // nickname 추가
    phone: ""      // phone 추가
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const payload = {
      email: formData.email,
      user_id: formData.user_id,
      password: formData.password,
      nickname: formData.nickname,
      phone: formData.phone,
    };

    try {
      // 회원가입 API 호출
      const response = await signup(payload);
      console.log("회원가입 성공:", response);
      navigate("/login");  // 회원가입 성공 후 로그인 화면으로 이동
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
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
      <form className="w-full px-[1.5rem] flex flex-col gap-[1rem]" onSubmit={handleSubmit}>
        {/* 닉네임 */}
        <div className="relative">
          <div className="flex flex-col justify-center border border-[#D0D6DD] rounded-[0.5rem] h-[3.75rem] px-[1rem] mt-[-0.5rem]">
            <label className="text-[0.625rem] text-[#9EA4AA] font-medium mb-[0.2rem]">
              닉네임 <span className="text-[#FA502E]">*</span>
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임 입력"
              className="text-[1rem] text-[#000] placeholder-[#C2C6CA] focus:outline-none border-none"
              required
            />
          </div>
        </div>

        {/* 전화번호 */}
        <div className="relative">
          <div className="flex flex-col justify-center border border-[#D0D6DD] rounded-[0.5rem] h-[3.75rem] px-[1rem] mt-[-0.5rem]">
            <label className="text-[0.625rem] text-[#9EA4AA] font-medium mb-[0.2rem]">
              전화번호 <span className="text-[#FA502E]">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="전화번호 입력"
              className="text-[1rem] text-[#000] placeholder-[#C2C6CA] focus:outline-none border-none"
              required
            />
          </div>
        </div>
        
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
              required
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
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="아이디 입력"
              className="text-[1rem] text-[#000] placeholder-[#C2C6CA] focus:outline-none border-none"
              required
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
              required
            />
          </div>
          <p className="text-[0.75rem] text-[#9EA4AA] mt-[0.37rem] ml-[0.3rem]">
            영문, 숫자 포함 8~32자
          </p>
        </div>


        {/* 가입하기 버튼 */}
        <button
          type="submit"  // 버튼을 폼 제출로 설정
          className="h-[3.25rem] bg-[#FA502E] text-[#FFFFFF] text-[1rem] rounded-[0.5rem] px-[1rem] py-[0.5rem] mt-[0.5rem] hover:opacity-90 focus:outline-none border-none"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
