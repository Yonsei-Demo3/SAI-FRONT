// src/screens/mypage/ProfileEditScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";
import { getMyInfo, updateMyNickname } from "../../lib/memberService";

export default function ProfileEditScreen() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // 처음 들어올 때 내 정보 불러오기
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMyInfo();
        setNickname(me.nickname || "");
        // 프로필 이미지 URL 있으면 여기서 setProfileImage(me.profileImageUrl);
      } catch (e) {
        console.error("내 정보 조회 실패:", e);
        alert("내 정보를 불러오지 못했어요. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // 저장 버튼 클릭
  const handleSave = async () => {
    const trimmed = nickname.trim();

    if (!trimmed) {
      alert("닉네임을 입력해 주세요.");
      return;
    }

    try {
      setSaving(true);
      await updateMyNickname(trimmed);
      alert("닉네임이 변경되었어요.");
      navigate(-1); // 이전 화면으로
    } catch (e) {
      console.error("닉네임 변경 실패:", e);
      alert("닉네임 변경에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handleClearNickname = () => {
    setNickname("");
  };

  // 프로필 사진 수정 버튼 → 파일 인풋 클릭
  const handleClickProfileImageButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 시 미리보기
  const handleChangeProfileImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    // 나중에 업로드 API 생기면 file을 따로 state에 저장해서 서버로 보내면 됨
  };

  const isSaveDisabled = loading || saving || !nickname.trim();

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-[1.5rem] pt-[1.25rem] pb-[0.75rem]">
        <div className="flex items-center gap-[0.75rem]">
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent border-none outline-none"
          >
            <img
              src="/icons/arrow-left.svg"
              alt="뒤로가기"
              className="w-[0.5369rem] h-[0.9281rem]"
            />
          </button>

          <p className="text-[1.25rem] font-bold">프로필 편집</p>
        </div>

        {/* 오른쪽은 디자인 맞추려고 빈 공간만 둠 */}
        <div className="w-[2rem]" />
      </div>

      {/* 내용 영역 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] pb-[1.5rem]">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center mt-[2.5rem]">
          <div className="relative w-[6.5rem] h-[6.5rem] rounded-full overflow-hidden bg-[#E5E7EB] flex items-center justify-center">
            <img
              src={profileImage || "/icons/profile-avatar.svg"}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChangeProfileImage}
          />

          <button
            type="button"
            className="mt-[1rem] px-[1rem] py-[0.38rem] rounded-full border border-[#D1D5DB] text-[0.75rem] text-[#91969a] bg-white"
            onClick={handleClickProfileImageButton}
          >
            프로필 사진 수정
          </button>
        </div>

        {/* 닉네임 입력 */}
        <div className="mt-[1.25rem]">
          <p className="text-[0.95rem] px-[0.5rem] font-semibold mb-[0.75rem]">
            닉네임
          </p>

          <div className="flex items-center w-full border border-[#E5E7EB] rounded-[0.5rem] px-[1rem] py-[0.62rem] bg-[#F9FAFB]">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              disabled={loading || saving}
              className="flex-1 bg-transparent outline-none border-none text-[1rem] text-[#111827]"
              placeholder="닉네임을 입력하세요"
            />

            {nickname && (
              <button
                type="button"
                onClick={handleClearNickname}
                className="ml-2 bg-transparent border-none outline-none"
              >
                <img
                  src="/icons/close-circle.svg"
                  alt="지우기"
                  className="w-[1.2rem] h-[1.2rem] opacity-60"
                />
              </button>
            )}
          </div>

          <p className="mt-[0.5rem] px-[0.75rem] text-[0.625rem] leading-[1.3rem] text-[#6B7280]">
            설정한 닉네임은 친구로 등록된 사용자와 피드에서만 표시됩니다.
            <br />
            대화방에서는 설정한 닉네임 대신 무작위로 생성된 닉네임이 표시됩니다.
          </p>
        </div>
      </div>

      {/* 하단 저장 버튼 영역 */}
      <div
        className="fixed left-0 right-0 bottom-[5.5rem]
                  px-[1.5rem] pt-[0.5rem]
                  bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.03)]
                  z-40"
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaveDisabled}
          className={`w-full h-[3rem] rounded-[0.75rem] text-[1rem] font-semibold
            ${
              isSaveDisabled
                ? "bg-[#F3F4F6] text-[#9CA3AF]"
                : "bg-[#FA502E] text-white"
            }`}
        >
          저장
        </button>
      </div>

      {/* 하단 탭 */}
      <BottomNav />
    </div>
  );
}
