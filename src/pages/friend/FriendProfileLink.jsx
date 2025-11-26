import React from "react";
import { useNavigate } from "react-router-dom";

export default function FriendProfileLink({
  friendId,
  nickname,
  imageUrl,
  size = 40, // 프로필 동그라미 크기
  className = "",
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!friendId) return;
    navigate(`/friends/${friendId}`, {
      state: { friendId }, // 필요하면 state로도 같이 넘김
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={nickname || "프로필"}
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      )}
      {nickname && (
        <span className="text-sm font-medium text-[#191D1F]">
          {nickname}
        </span>
      )}
    </button>
  );
}
