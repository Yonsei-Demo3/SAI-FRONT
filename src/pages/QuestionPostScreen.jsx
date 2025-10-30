import React, { useMemo, useState } from "react";
import { Plus, Users, HelpCircle, Hash, Info, Minus, X } from "../components/QuestionPostScreenIcon.jsx";
import QuestionTopBar from "../components/QuestionTopBar.jsx";
const MAX_QUESTION_LEN = 100;
const MAX_TAGS = 5;

function RegisterButton() {
  return (
    <div className={"rounded-md px-4 py-3 text-[16px] bg-[#FA502E] text-[#FFFFFF]"}>
      등록
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
      {'#'}{label}
      {onRemove && (  
        <button
          type="button"
          aria-label={`${label} 태그 삭제`}
          onClick={onRemove}
          className="rounded-full p-0.5 hover:bg-gray-200"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}

function FieldLabel({ icon, children, optional = false }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      {icon}
      <h3 className="text-base font-semibold text-gray-800">
        {children}
        {optional && (
          <span className="ml-[0.25em] align-baseline text-sm text-[#CCD2D8]">
            (선택)
          </span>
        )}
      </h3>
    </div>
  );
}


export default function QuestionFormScreen() {

  return (
    <div className="m-6 rounded-2xl bg-red-500 p-8 text-white">
      Tailwind OK?
    </div>
  );

    // const [contentFiles, setContentFiles] = useState([]);
  // const [question, setQuestion] = useState("");
  // const [desc, setDesc] = useState("");
  // const [participants, setParticipants] = useState(2);
  // const [tags, setTags] = useState([]);
  // const [tagInput, setTagInput] = useState("");

  // const remaining = MAX_QUESTION_LEN - question.length;
  // const canSubmit = question.trim().length > 0;

  // function handleDrop(ev) {
  //   ev.preventDefault();
  //   const files = Array.from(ev.dataTransfer.files || []);
  //   if (files.length) setContentFiles((prev) => [...prev, ...files]);
  // }

  // function onTagKeyDown(e) {
  //   if (e.key === "Enter" || e.key === "," || e.key === " ") {
  //     e.preventDefault();
  //     const raw = tagInput.trim().replace(/^#/g, "");
  //     if (!raw) return;
  //     if (tags.includes(raw)) return;
  //     if (tags.length >= MAX_TAGS) return;
  //     setTags((t) => [...t, raw]);
  //     setTagInput("");
  //   }
  //   if (e.key === "Backspace" && !tagInput && tags.length) {
  //     setTags((t) => t.slice(0, -1));
  //   }
  // }

  // function removeTag(idx) {
  //   setTags((t) => t.filter((_, i) => i !== idx));
  // }

  // function onSubmit(e) {
  //   e.preventDefault();
  //   // 데모: 실제 제출 대신 콘솔 출력
  //   console.log({ contentFiles, question, desc, participants, tags });
  //   alert("질문이 등록되었습니다! (데모)");
  // }

  // const contentHint = useMemo(
  //   () =>
  //     contentFiles.length
  //       ? `${contentFiles.length}개 첨부됨`
  //       : "콘텐츠를 추가하여 그 안에서 떠오른 질문을 기록해보세요.",
  //   [contentFiles]
  // );

    // <div className="mx-auto max-w-sm bg-white p-4">

    //   <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none">
    //     <path fillRule="evenodd" clipRule="evenodd" d="M1.15017 8.8295L7.75 15.4293L9.39967 13.7797L3.62467 8.00467L9.39967 2.22967L7.75 0.58L1.15017 7.17983C0.931451 7.39862 0.808583 7.69531 0.808583 8.00467C0.808583 8.31402 0.931451 8.61072 1.15017 8.8295Z" fill="#191D1F"/>
    //   </svg>

    //   <span className="inline-flex items-center rounded-bg bg-[#FA502E] text-white text-xs px-2 py-1">질문</span>

    //   <div onSubmit={onSubmit} className="flex flex-col gap-6">
    //     {/* 콘텐츠 업로드 카드 */}
    //     <div>
    //       <label
    //         onDragOver={(e) => e.preventDefault()}
    //         onDrop={handleDrop}
    //         className="flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center transition hover:bg-gray-100"
    //       >
    //         <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow">
    //           <Plus className="h-8 w-8" />
    //         </div>
    //         <p className="whitespace-pre-line text-sm text-gray-600">{contentHint}</p>
    //         <input
    //           type="file"
    //           className="hidden"
    //           multiple
    //           onChange={(e) => setContentFiles([...(e.target.files ? Array.from(e.target.files) : [])])}
    //         />
    //       </label>
    //     </div>

    //     {/* 질문 작성하기 */}
    //     <div>
    //       <FieldLabel>질문 작성하기 <span className="text-[#FA502E]">*</span></FieldLabel>
    //       <div className="rounded-2xl border border-gray-200 p-3 shadow-sm">
    //         <textarea
    //           value={question}
    //           onChange={(e) => setQuestion(e.target.value.slice(0, MAX_QUESTION_LEN))}
    //           placeholder={"지금 당신의 생각이 머무는 사이에는 어떤 질문이 있나요? 내용은 100자까지 입력할 수 있어요."}
    //           className="h-28 w-full resize-none rounded-xl bg-transparent p-2 text-[15px] outline-none placeholder:text-gray-400"
    //         />
    //         <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
    //           <span>욕설, 비속어 사용 시 서비스 이용이 제한될 수 있습니다.</span>
    //           <span>{question.length}/{MAX_QUESTION_LEN}</span>
    //         </div>
    //       </div>
    //     </div>

    //     {/* 설명 입력하기 (선택) */}
    //     <div>
    //       <FieldLabel optional>
    //         설명 입력하기
    //       </FieldLabel>
    //       <textarea
    //         value={desc}
    //         onChange={(e) => setDesc(e.target.value)}
    //         placeholder="질문에 관해 자유롭게 설명을 덧붙여보세요."
    //         className="h-28 w-full rounded-2xl border border-gray-200 bg-white p-3 text-[15px] outline-none placeholder:text-gray-400 shadow-sm"
    //       />
    //       <button
    //         type="submit"
    //         className="mt-3 w-full rounded-2xl bg-gray-900 py-3 text-center text-[15px] font-semibold text-white disabled:bg-gray-300"
    //         disabled={!canSubmit}
    //       >
    //         질문 등록하기
    //       </button>
    //     </div>

    //     {/* 태그 추가하기 */}
    //     <div>
    //       <FieldLabel optional>
    //         태그 추가하기
    //       </FieldLabel>
    //       <div className="rounded-2xl border border-gray-200 p-3 shadow-sm">
    //         <div className="mb-2 flex flex-wrap gap-2">
    //           {tags.map((t, i) => (
    //             <Chip key={t} label={t} onRemove={() => removeTag(i)} />
    //           ))}
    //         </div>
    //         <input
    //           type="text"
    //           value={tagInput}
    //           onChange={(e) => setTagInput(e.target.value)}
    //           onKeyDown={onTagKeyDown}
    //           placeholder="예: #사랑 #기억 #관계"
    //           className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none placeholder:text-gray-400"
    //         />
    //         <p className="mt-2 text-xs text-gray-400">최대 {MAX_TAGS}개까지 선택할 수 있어요.</p>
    //       </div>
    //     </div>

    //     {/* 참여 인원 설정 */}
    //     <div>
    //       <FieldLabel>참여 인원 설정 <span className="text-[#FA502E]">*</span></FieldLabel>
    //       <div className="flex items-center gap-3">
    //         <button
    //           type="button"
    //           onClick={() => setParticipants((n) => Math.max(1, n - 1))}
    //           className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white shadow-sm active:scale-95"
    //           aria-label="인원 감소"
    //         >
    //           <Minus className="h-5 w-5" />
    //         </button>
    //         <div className="min-w-[3rem] text-center text-lg font-semibold">{participants}명</div>
    //         <button
    //           type="button"
    //           onClick={() => setParticipants((n) => n + 1)}
    //           className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white shadow-sm active:scale-95"
    //           aria-label="인원 증가"
    //         >
    //           <Plus className="h-5 w-5" />
    //         </button>
    //       </div>
    //     </div>

    //     <div className="h-8" />
    //   </div>
    // </div>
  // );
}
