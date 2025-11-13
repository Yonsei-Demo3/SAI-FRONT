import React, { useMemo, useState } from "react";
import { Plus, Users, HelpCircle, Hash, Info, Minus, X } from "../components/question/QuestionPostScreenIcon.jsx";
import QuestionTopBar from "../components/question/QuestionTopBar.jsx";
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
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[0.8rem] text-gray-700">
      {'#'}{label}
      {onRemove && (  
        <button
          type="button"
          aria-label={`${label} 태그 삭제`}
          onClick={onRemove}
          className="inline-flex w-[0.5rem] h-[0.5rem] items-center justify-center rounded-full bg-white border border-[#CCD2D8]"
        >
          <X className="w-[0.1rem] h-[0.1rem]" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

function FieldLabel({ icon, children, optional = false }) {
  return (
    <h3 className="text-base font-semibold pl-[1.5rem]">
      {children}
      {optional && (
        <span className="ml-[0.25em] align-baseline text-sm text-[#CCD2D8]">
          (선택)
        </span>
      )}
      {!optional &&(
        <span className="text-[#FA502E]"> *</span>
      )}

    </h3>
  );
}


export default function QuestionFormScreen() {

  const [contentFiles, setContentFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [desc, setDesc] = useState("");
  const [participants, setParticipants] = useState(2);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const remaining = MAX_QUESTION_LEN - question.length;
  const canSubmit = question.trim().length > 0;

  function handleDrop(ev) {
    ev.preventDefault();
    const files = Array.from(ev.dataTransfer.files || []);
    if (files.length) setContentFiles((prev) => [...prev, ...files]);
  }

  function onTagKeyDown(e) {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const raw = tagInput.trim().replace(/^#/g, "");
      if (!raw) return;
      if (tags.includes(raw)) return;
      if (tags.length >= MAX_TAGS) return;
      setTags((t) => [...t, raw]);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((t) => t.slice(0, -1));
    }
  }

  function removeTag(idx) {
    setTags((t) => t.filter((_, i) => i !== idx));
  }

  function onSubmit(e) {
    e.preventDefault();
    console.log({ contentFiles, question, desc, participants, tags });
    alert("질문이 등록되었습니다!");
  }

  const contentHint = useMemo(
    () =>
      contentFiles.length
        ? `${contentFiles.length}개 첨부됨`
        : "콘텐츠를 추가하여 그 안에서 떠오른 질문을 기록해보세요.",
    [contentFiles]
  );

  return (
    <div className="flex min-h-[0rem] mx-auto flex-col flex overflow-y-auto">

      <QuestionTopBar/>      

      <div className="w-full flex items-center justify-center pt-[2rem]">
        <div className="w-[20.4375rem] h-[12.375rem] bg-[#F2F4F8] rounded-[0.5rem] flex-col flex justify-center items-start mx-auto gap-[0.2rem]">
            <p className="text-center mx-auto text-[0.875rem] text-[#3B3D40]">
              콘텐츠를 추가하여<br/> 그 안에서 떠오른 질문을 기록해보세요.
            </p>
            <div className="w-[4.75rem] h-[4.75rem] bg-[#FFFFFF] rounded-[0.5rem] mx-auto flex justify-center items-center"> 
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                  <path d="M17.5 8.16667H10.5V1.16667C10.5 0.857247 10.3771 0.560501 10.1583 0.341709C9.9395 0.122917 9.64275 0 9.33333 0C9.02391 0 8.72717 0.122917 8.50838 0.341709C8.28958 0.560501 8.16667 0.857247 8.16667 1.16667V8.16667H1.16667C0.857247 8.16667 0.560501 8.28958 0.341709 8.50838C0.122917 8.72717 0 9.02391 0 9.33333C0 9.64275 0.122917 9.9395 0.341709 10.1583C0.560501 10.3771 0.857247 10.5 1.16667 10.5H8.16667V17.5C8.16667 17.8094 8.28958 18.1062 8.50838 18.325C8.72717 18.5438 9.02391 18.6667 9.33333 18.6667C9.64275 18.6667 9.9395 18.5438 10.1583 18.325C10.3771 18.1062 10.5 17.8094 10.5 17.5V10.5H17.5C17.8094 10.5 18.1062 10.3771 18.325 10.1583C18.5438 9.9395 18.6667 9.64275 18.6667 9.33333C18.6667 9.02391 18.5438 8.72717 18.325 8.50838C18.1062 8.28958 17.8094 8.16667 17.5 8.16667Z" fill="#B5BBC1"/>
                  <path d="M17.5 8.16667H10.5V1.16667C10.5 0.857247 10.3771 0.560501 10.1583 0.341709C9.9395 0.122917 9.64275 0 9.33333 0C9.02391 0 8.72717 0.122917 8.50838 0.341709C8.28958 0.560501 8.16667 0.857247 8.16667 1.16667V8.16667H1.16667C0.857247 8.16667 0.560501 8.28958 0.341709 8.50838C0.122917 8.72717 0 9.02391 0 9.33333C0 9.64275 0.122917 9.9395 0.341709 10.1583C0.560501 10.3771 0.857247 10.5 1.16667 10.5H8.16667V17.5C8.16667 17.8094 8.28958 18.1062 8.50838 18.325C8.72717 18.5438 9.02391 18.6667 9.33333 18.6667C9.64275 18.6667 9.9395 18.5438 10.1583 18.325C10.3771 18.1062 10.5 17.8094 10.5 17.5V10.5H17.5C17.8094 10.5 18.1062 10.3771 18.325 10.1583C18.5438 9.9395 18.6667 9.64275 18.6667 9.33333C18.6667 9.02391 18.5438 8.72717 18.325 8.50838C18.1062 8.28958 17.8094 8.16667 17.5 8.16667Z" fill="black" fill-opacity="0.2"/>
                </svg>
              </div>
            </div>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <FieldLabel>질문 작성하기</FieldLabel>
        <div className="flex flex-col items-center justify-center pl-[1.5rem] pr-[1.5rem]">
          <textarea
            style={{ resize: "none" }}
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, MAX_QUESTION_LEN))}
            placeholder={"지금 당신의 생각이 머무는 사이에는 어떤 질문이 있나요?"}
            className="w-full h-[8rem] bg-[#FFFFFF] border-[0.1rem] border-[#CCD2D8] rounded-[0.5rem] box-border p-[1rem] placeholder:text-[#CCD2D8] outline-none text-[1rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.8rem]"
          >
          </textarea>
          <div className="self-start  p-[0.5rem]">
            <span className="text-[#CCD2D8] text-[0.8rem]">욕설, 비속어 사용 시 서비스 이용이 제한될 수 있습니다.</span>
            <span className="text-[#CCD2D8] text-[0.8rem]">  {question.length}/{MAX_QUESTION_LEN}</span>
          </div>
        </div>
      </div>

      
      <div className="flex flex-col justify-center">
        <FieldLabel optional>설명 입력하기</FieldLabel>
        <div className="flex flex-col items-center justify-center pl-[1.5rem] pr-[1.5rem]">
          <textarea
            style={{ resize: "none" }}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={"질문에 관해 자유롭게 설명을 덧붙여보세요."}
            className="w-full h-[8rem] bg-[#FFFFFF] border-[0.1rem] border-[#CCD2D8] rounded-[0.5rem] box-border p-[1rem] placeholder:text-[#CCD2D8] outline-none text-[1rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.8rem]"
          >
          </textarea>
        </div>
      </div>


      <div className="flex flex-col justify-center">
        <FieldLabel optional>
          태그 추가하기
        </FieldLabel>
        <div className="flex flex-col items-center justify-center pl-[1.5rem] pr-[1.5rem]">
          <input
            type="text"
            placeholder="예: #사랑 #기억 #관계"
            className="w-full h-[2rem] bg-[#FFFFFF] border-[0.1rem] border-[#CCD2D8] rounded-[0.5rem] box-border p-[1rem] placeholder:text-[#CCD2D8] outline-none text-[0.8rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.8rem]"
          />
          <div className="p-[0.5rem]">
            <span className="text-[#CCD2D8] text-[0.8rem]">최대 {MAX_TAGS}개까지 선택할 수 있어요.</span>
          </div>
        </div>
      </div>

        
        <div>
          <FieldLabel>참여 인원 설정</FieldLabel>

          <div className="flex items-center  pl-[1.5rem]">
            <button
              type="button"
              onClick={() => setParticipants((n) => Math.max(1, n - 1))}
              className="rounded-full w-[2rem] h-[2rem] border-0 flex items-center justify-center" 
              aria-label="인원 감소"
            >
              <Minus className="h-5 w-5 mx-auto" />
            </button>

            <div className="min-w-[3rem] text-center text-lg font-semibold">
              {participants}명
            </div>
            
            <button
              type="button"
              onClick={() => setParticipants((n) => n + 1)}
              className="rounded-full w-[2rem] h-[2rem] border-0 flex items-center justify-center" 
              aria-label="인원 증가"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>



      <div onSubmit={onSubmit} className="flex flex-col gap-6">
        
      </div>
    </div>
  );
}
