// src/screens/etc/CommunityRulesScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/main/BottomNav";

export default function CommunityRulesScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white font-[Pretendard]">
      {/* 상단바 */}
      <div className="flex items-center px-[1.5rem] pt-[1.25rem] pb-[0.75rem]">
        <button className="mr-[0.5rem]" onClick={() => navigate(-1)}>
          <img
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            className="w-[0.5369rem] h-[0.9281rem]"
          />
        </button>
        <h1 className="text-[1.25rem] font-bold text-[#000000]">
          커뮤니티 이용 규칙
        </h1>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-[1.5rem] pt-[1.5rem] pb-[6rem] text-[#3B3D40]">
        {/* 인트로 문단 */}
        <p className="text-[0.9rem] leading-[1.7rem] mb-[2rem]">
          질문 하나에 집중하는 깊이 있는 대화를 위해, SAI는 다음 원칙을
          기반으로 운영됩니다.
        </p>

        {/* 1 */}
        <section className="mb-[1.75rem]">
          <h2 className="text-[0.95rem] font-bold mb-[0.5rem]">
            1. 한 질문, 한 대화
          </h2>
          <p className="text-[0.9rem] leading-[1.7rem]">
            SAI의 모든 대화방은 하나의 질문만을 중심으로 진행됩니다.
            <br />
            다른 주제로 흐트러지는 대화를 지양하고, 질문의 흐름을 함께
            따라가 주세요.
          </p>
        </section>

        {/* 2 */}
        <section className="mb-[1.75rem]">
          <h2 className="text-[0.95rem] font-bold mb-[0.5rem]">
            2. 익명 기반의 안전한 커뮤니티
          </h2>
          <p className="text-[0.9rem] leading-[1.7rem]">
            사용자는 랜덤 닉네임으로 대화방에 참여하며, 개인 신상 정보나
            타인의 사적 정보를 묻거나 공유하는 행위는 금지됩니다.
            <br />
            서로의 익명성을 존중해 주세요.
          </p>
        </section>

        {/* 3 */}
        <section className="mb-[1.75rem]">
          <h2 className="text-[0.95rem] font-bold mb-[0.5rem]">
            3. 상대방을 존중하는 태도
          </h2>
          <p className="text-[0.9rem] leading-[1.7rem]">
            비하·조롱·인신공격·차별적 발언 등 타인을 상처 줄 수 있는 표현은
            허용되지 않습니다.
            <br />
            다양한 관점이 공존할 수 있도록, 의견 충돌 시에도 정중한 태도를
            유지해 주세요.
          </p>
        </section>

        {/* 4 */}
        <section className="mb-[1.75rem]">
          <h2 className="text-[0.95rem] font-bold mb-[0.5rem]">
            4. 대화 중도 이탈 관련 안내
          </h2>
          <p className="text-[0.9rem] leading-[1.7rem]">
            대화방에서 나가면 다시 입장할 수 없습니다.
            <br />
            42분 동안 함께하는 대화의 집중력을 유지하기 위한 조치입니다.
            <br />
            참여하기 전, 충분히 시간을 확보하고 대화에 집중할 준비를 해 주세요.
          </p>
        </section>

        {/* 5 */}
        <section className="mb-[1.75rem]">
          <h2 className="text-[0.95rem] font-bold mb-[0.5rem]">
            5. 안전한 콘텐츠 환경 조성
          </h2>
          <p className="text-[0.9rem] leading-[1.7rem]">
            폭력적, 노골적, 불법적, 위험 행동을 조장하거나 불쾌감을 야기하는
            콘텐츠는 허용되지 않습니다.
            <br />
            문제를 발견하면 즉시 신고해 주세요.
          </p>
        </section>

        {/* 6 */}
        <section className="mb-[1.75rem]">
          <h2 className="text-[0.95rem] font-bold mb-[0.5rem]">
            6. 플랫폼 운영 목적에 맞는 참여
          </h2>
          <p className="text-[0.9rem] leading-[1.7rem]">
            SAI는 ‘질문 기반의 깊이 있는 대화’를 지향합니다.
            <br />
            의미 없는 참여, 단순 잡담 유도, 분란 조성은 운영 정책에 따라
            제재될 수 있습니다.
          </p>
        </section>
      </div>

      {/* 하단 네비 */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}
