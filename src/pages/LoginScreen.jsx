import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import { login } from "../lib/loginService";

export default function LoginScreen() {
  const navigate = useNavigate(); // navigate 훅 사용

  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
  });

  const [error, setError] = useState(""); // 오류 메시지를 저장할 상태

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: formData.user_id,
      password: formData.password,
    };

    try {
      // 로그인 API 요청
      const response = await login(payload);

      const authHeader =
        response.headers["authorization"] ||
        response.headers["Authorization"] ||
        response.headers["access-token"];

      if(authHeader) {
        localStorage.setItem("accessToken", authHeader);
      }

      navigate("/main");
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message + "로그인 실패")
      } else {
        console.log("서버와의 연결에 문제가 발생했습니다.")
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white mx-auto relative font-[Pretendard]">
      <img
        src="/icons/logo.svg"
        alt="Logo"
        className="w-[2.5rem] h-[4.5rem] mb-[1.5rem] mt-[7rem]"
      />

      <div className="w-full flex flex-col gap-[1rem] px-[1.5rem]">
        {/* 아이디 입력 폼 */}
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

        {/* 비밀번호 입력 폼 */}
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
          onClick={handleSubmit} // 로그인 버튼 클릭 시 handleSubmit 호출
          className="h-[3.25rem] bg-[#FA502E] text-[#FFFFFF] text-[1rem] leading-[2.25rem] rounded-[0.5rem] px-[1rem] py-[0.5rem] mt-[0.5rem] hover:opacity-90 focus:outline-none focus:ring-none border-none"
        >
          로그인
        </button>

        {/* 오류 메시지 */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* 하단 링크 */}
      <div className="flex items-center justify-end gap-[0.375rem] mt-[0.5rem] text-[0.875rem] text-gray-500 w-full pr-[2.5rem]">
        <a href="/signup" className="hover:text-[#FA502E] no-underline">
          회원가입
        </a>
        <span className="text-[#B5BBC1]">|</span>
        <a href="/find-id-pw" className="hover:text-[#FA502E] no-underline">
          ID/PW 찾기
        </a>
      </div>

      {/* SNS 로그인 구분선 및 버튼 */}
      <div className="flex flex-col items-center w-full px-[1.5rem]">
        <div className="w-full flex itmes-center justify-center mt-[1.25rem]">
          <img
            src="/icons/line.png"
            alt="line"
            className="w-[6.25rem] h-[0.0625rem]"
          />
          <div className="text-[0.75rem] text-[#B5BBC1] px-[1.31rem] mb-[1rem] mt-[-0.5rem]">
            SNS 간편 로그인
          </div>
          <img
            src="/icons/line.png"
            alt="line"
            className="w-[6.25rem] h-[0.0625rem]"
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
