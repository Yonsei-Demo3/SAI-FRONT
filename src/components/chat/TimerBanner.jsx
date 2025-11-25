import React from "react";

/**
 * 초록 배너 카운트다운
 * props:
 *  - startAt: Date | string | number   (예: "2025-10-21T12:00:00Z" 또는 Date.now()+...)
 *  - endAt:   Date | string | number
 *  - onExpire?: () => void  (선택: 0이 되면 한 번 호출)
 */
export default function TimerBanner({ startAt, endAt, onExpire }) {
  const [now, setNow] = React.useState(() => Date.now());

  // 문자열/숫자/Date 어떤 형태든 ms로 통일
  const startMs = React.useMemo(() => new Date(startAt).getTime(), [startAt]);
  const endMs   = React.useMemo(() => new Date(endAt).getTime(), [endAt]);

  // 1초마다 현재 시각 갱신 (드리프트 방지: 실제 시계를 기준으로)
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // 상태 판별
  const notStarted = now < startMs;
  const finished   = now >= endMs;

  // 남은 시간(ms): 아직 시작 전이면 “시작까지”, 시작했으면 “종료까지”
  const remainingMs = notStarted ? Math.max(startMs - now, 0) : Math.max(endMs - now, 0);

  // 만료 콜백 (한 번만)
  const firedRef = React.useRef(false);
  React.useEffect(() => {
    if (!firedRef.current && !notStarted && finished) {
      firedRef.current = true;
      onExpire?.();
    }
  }, [notStarted, finished, onExpire]);

  // 포맷터: 1시간 이상이면 H:MM:SS, 아니면 MM:SS
  const fmt = formatDuration(remainingMs);

  const label = notStarted
    ? `질문 시작까지 ${fmt}`
    : finished
    ? `대화 시간이 종료되었습니다`
    : `질문 종료까지 ${fmt}`;

  return (
    <div
      className="w-full h-[1.5rem] bg-[#A4C14D] text-[#FFFFFF] text-[0.875rem] flex items-center justify-center"
      aria-live="polite"
    >
      {label}
    </div>
  );
}

function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  // 1시간 이상: H:MM:SS  / 미만: MM:SS
  if (h > 0) return `${h}:${pad2(m)}:${pad2(s)}`;
  return `${pad2(m)}:${pad2(s)}`;
}
const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
