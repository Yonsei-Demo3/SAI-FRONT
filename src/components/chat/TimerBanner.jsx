import React from "react";


export default function TimerBanner({ startAt, endAt, onExpire }) {
  const [now, setNow] = React.useState(() => Date.now());

  const startMs = React.useMemo(() => new Date(startAt).getTime(), [startAt]);
  const endMs   = React.useMemo(() => new Date(endAt).getTime(), [endAt]);

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const notStarted = now < startMs;
  const finished   = now >= endMs;

  const remainingMs = notStarted ? Math.max(startMs - now, 0) : Math.max(endMs - now, 0);

  const firedRef = React.useRef(false);
  React.useEffect(() => {
    if (!firedRef.current && !notStarted && finished) {
      firedRef.current = true;
      onExpire?.();
    }
  }, [notStarted, finished, onExpire]);

  const fmt = formatDuration(remainingMs);

  const label = notStarted
    ? `질문 시작까지 ${fmt}`
    : finished
    ? `종료된 대화입니다`
    : `질문 종료까지 ${fmt}`;

  return (
    <div
      className={`w-full h-[1.5rem] ${finished ? "bg-[#B5BBC1]" : "bg-[#A4C14D]"} text-[#FFFFFF] text-[0.875rem] flex items-center justify-center`}
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

  if (h > 0) return `${h}:${pad2(m)}:${pad2(s)}`;
  return `${pad2(m)}:${pad2(s)}`;
}
const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
