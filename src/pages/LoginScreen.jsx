import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login, kakaoLogin } from "../lib/loginService";

export default function LoginScreen() {
  
  const navigate = useNavigate(); 
  const [error, setError] = useState(""); 
  const [searchParams] = useSearchParams(); // query parameters
  const kakaoCode = searchParams.get("code"); // kakao 인가코드
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  // 카카오 로그인 리다이렉트
  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${KAKAO_REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
      `&response_type=code`;

    window.location.href = KAKAO_AUTH_URL; // 카카오 로그인 화면으로 이동
  };

  useEffect(() => {

    if (!kakaoCode) return;

    const fetchKakaoLogin = async () => {
      try {

        const response = await kakaoLogin(kakaoCode, KAKAO_REDIRECT_URI);

        const authHeader =
          response.headers["authorization"] ||
          response.headers["Authorization"] ||
          response.headers["access-token"];

        if(authHeader) {
          localStorage.setItem("accessToken", authHeader);
        }

        navigate("/main", { replace: true });

    } catch (err) {

      console.error("카카오 로그인 실패:", err);
      setError("다시 시도해 주세요.");
    
    }
    };

    fetchKakaoLogin();

  }, [kakaoCode]);

  // 일반 로그인
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: formData.user_id,
      password: formData.password,
    };

    try {

      const response = await login(payload);

      const authHeader =
        response.headers["authorization"] ||
        response.headers["Authorization"] ||
        response.headers["access-token"];

      if(authHeader) {
        localStorage.setItem("accessToken", authHeader);
      }

      navigate("/main", { replace: true });
      
    } catch (err) {

      console.error("일반 로그인 실패:", err);
      setError("아이디 또는 비밀번호가 잘못되었습니다.");
    
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
          <span className="font-bold">
            로그인
          </span>
        </button>

        {/* 오류 메시지 */}
        {error && <p className="text-[0.875rem] text-red-500 mt-2">{error}</p>}
      </div>

      {/* 하단 링크 */}
      <div className="flex items-center justify-end gap-[0.375rem] mt-[0.5rem] text-[0.875rem] text-[#B5BBC1] w-full pr-[2.5rem]">
        <a href="/signup" className="hover:text-[#FA502E] no-underline">
          회원가입
        </a>
        <span className="text-[#B5BBC1]">|</span>
        <a href="/find-id-pw" className=" text-[#B5BBC1] hover:text-[#FA502E] no-underline">
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

        <div className="flex w-full justify-center">
          <button 
            className="rounded-[0.5rem] bg-[#FEE500] w-full h-[3.25rem] flex justify-center items-center gap-[0.5rem]"
            onClick={handleKakaoLogin}
          >
            
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="21" viewBox="0 0 23 21" fill="none">
              <path d="M11.2405 0C5.01808 0 0 4.01442 0 8.88798C0 12.0514 2.08752 14.8213 5.2188 16.403L4.15898 20.3613C4.139 20.4207 4.13593 20.4843 4.15011 20.5453C4.16429 20.6063 4.19516 20.6621 4.23927 20.7065C4.30359 20.7633 4.38635 20.7946 4.47211 20.7948C4.54322 20.7891 4.61068 20.761 4.6648 20.7146L9.22524 17.6395C9.89841 17.7324 10.577 17.7807 11.2566 17.784C17.4709 17.784 22.4971 13.7696 22.4971 8.88798C22.4971 4.00639 17.4549 0 11.2405 0Z" fill="#392020"/>
            </svg>
            
            <span className="font-bold">
              카카오 로그인
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
