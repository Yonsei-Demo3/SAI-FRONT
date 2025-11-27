// src/components/chat/ChatGuideDrawer.jsx
import React, {useEffect, useState } from "react";
import { getChatMembers } from "../../lib/chatService";

export default function ChatDrawer({ open, onClose, title, roomId, questionId }) {
    
    const [participants, setParticipants] = useState({
        totalMembers: 0,
        members: [],
    });    
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        
        if (!open || !roomId) return;
        let cancelled = false;
        
        async function fetchChatMembers() {
            try {
                setLoading(true);
                const response = await getChatMembers(questionId);
                if (cancelled) return;
                setParticipants(response.data || { totalMembers: 0, members: [] });
      } catch (err) {
          console.error("참여자 목록 가져오기 실패:", err);
        } finally {
            if (!cancelled) setLoading(false);
        }
    }
    
    fetchChatMembers();
    
    return () => {
        cancelled = true;
    };

    }, [open, roomId]);

    if (!open) return null;

return (
    <div 
        className="fixed inset-0 z-[600] flex justify-center"
        onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        />

      <div className="relative w-full max-w-[500px] h-full flex justify-end">
        <div
          className="
            mt-6 mb-6 w-[75%]
            bg-white rounded-l-2xl
            shadow-[0_4px_20px_rgba(0,0,0,0.12)]
            flex flex-col
            px-[1.5rem] pt-[1.25rem] pb-[1.5rem]
            transform translate-x-0
            transition-transform duration-300 ease-out
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 탭 / 제목 */}
          <div className="flex items-center justify-start mb-[1.5rem]">
            <button className="flex items-center justify-start rounded-[0.375rem] h-[2.0625rem] w-[5.4375rem] bg-[#F1F8FF] pl-[1rem] pr-[1rem] pt-[0.625rem] pb-[0.625rem]">
              <span className="font-semibold text-[0.75rem] text-[#007AFF]">
                이용 가이드
              </span>
            </button>
          </div>

          {/* 질문 제목 */}
          <p className="text-[0.875rem] font-semibold text-[#191D1F] leading-[1.4rem] mb-[0.75rem] line-clamp-1">
            {title}
          </p>

          {/* 안내 문구 */}
          <div className="mb-[1rem]">
            <p className="text-[0.75rem] text-[#3B3D40] leading-[1.2rem]">
              • SAI는 하나의 질문에만 집중하는 공간입니다.<br />
              • 서로를 존중하며 예의 있게 대화해주세요.<br />
              • 개인정보 공유, 비하·공격적 발언은 금지됩니다.<br />
              • 대화방을 나가면 다시 입장할 수 없습니다.<br />
              • 신고 접수 시 운영정책에 따라 조치됩니다.
            </p>
          </div>

          <hr className="border-[#E7EBEF] my-[0.75rem]" />

          {/* 대화 상대 영역 */}
          <div className="flex flex-col gap-[0.75rem]">
            <p className="text-[0.75rem] text-[#3B3D40]">
              대화상대 ({participants.totalMembers ?? participants.members.length}명)
            </p>

            {!loading && (participants.members || []).map((member) => (
              <div key={member.memberId} className="flex flex-l items-center gap-2">
                
                <div className="w-8 h-8 rounded-full bg-[#E5E8EB] overflow-hidden">
                    {!!member.imageUrl && (
                        <img
                        src={member.imageUrl}
                        alt="프로필 이미지"
                        className="w-8 h-8 rounded-full object-cover"
                        />
                    )}
                </div>
                
                {member.isMe && (
                    <div className="w-4 h-4 flex items-center justify-center rounded-full bg-[#3B3D40]">                   
                        <span className="text-white text-[0.5rem] flex justify-center items-center">
                            나
                        </span>
                    </div>
                )}

                <span className="text-[0.75rem] text-[#3B3D40]">
                    {member.nickname}
                </span>
                </div>
            ))}

            </div>
            {/* 하단 나가기 버튼 */}
            <div className="mt-auto pt-[1.25rem] flex justify-start">
                <button
                type="button"
                className="flex items-center justify-center rounded-[0.75rem]"
                onClick={onClose}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21" fill="none">
                    <path d="M3.5625 0C2.61767 0 1.71153 0.375334 1.04343 1.04343C0.375334 1.71153 0 2.61767 0 3.5625V16.6875C0 17.6323 0.375334 18.5385 1.04343 19.2066C1.71153 19.8747 2.61767 20.25 3.5625 20.25H12.1875C12.4361 20.25 12.6746 20.1512 12.8504 19.9754C13.0262 19.7996 13.125 19.5611 13.125 19.3125C13.125 19.0639 13.0262 18.8254 12.8504 18.6496C12.6746 18.4738 12.4361 18.375 12.1875 18.375H3.5625C3.11495 18.375 2.68573 18.1972 2.36926 17.8807C2.05279 17.5643 1.875 17.1351 1.875 16.6875V3.5625C1.875 3.11495 2.05279 2.68572 2.36926 2.36926C2.68573 2.05279 3.11495 1.875 3.5625 1.875H12.1875C12.4361 1.875 12.6746 1.77623 12.8504 1.60041C13.0262 1.4246 13.125 1.18614 13.125 0.9375C13.125 0.68886 13.0262 0.450403 12.8504 0.274587C12.6746 0.098772 12.4361 0 12.1875 0H3.5625ZM15.4755 4.587C15.2997 4.41116 15.0612 4.31238 14.8125 4.31238C14.5638 4.31238 14.3253 4.41116 14.1495 4.587C13.9737 4.76284 13.8749 5.00133 13.8749 5.25C13.8749 5.49867 13.9737 5.73716 14.1495 5.913L17.424 9.1875H6.5625C6.31386 9.1875 6.0754 9.28627 5.89959 9.46209C5.72377 9.6379 5.625 9.87636 5.625 10.125C5.625 10.3736 5.72377 10.6121 5.89959 10.7879C6.0754 10.9637 6.31386 11.0625 6.5625 11.0625H17.424L14.1495 14.337C13.9737 14.5128 13.8749 14.7513 13.8749 15C13.8749 15.2487 13.9737 15.4872 14.1495 15.663C14.3253 15.8388 14.5638 15.9376 14.8125 15.9376C15.0612 15.9376 15.2997 15.8388 15.4755 15.663L20.3505 10.788C20.4376 10.7009 20.5067 10.5976 20.5538 10.4838C20.6009 10.3701 20.6252 10.2481 20.6252 10.125C20.6252 10.0019 20.6009 9.87994 20.5538 9.76618C20.5067 9.65242 20.4376 9.54906 20.3505 9.462L15.4755 4.587Z" fill="#3B3D40"/>
                </svg>
                </button>
              </div>
          </div>
        </div>
    </div>
  );
}
