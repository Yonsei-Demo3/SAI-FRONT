import kakaoLoginImg from '../../assets/kakao_login_large_wide.png';

export default function KakaoLoginButton({ onClick }) {
  return (
    <button
      type="button"
      aria-label="카카오로 로그인"
      onClick={onClick}
      className="block border-none bg-transparent p-0 focus:outline-none"
    >
      <img
        src={kakaoLoginImg}
        alt="카카오로 계속하기"
        className="block"
      />
    </button>

  );
}
