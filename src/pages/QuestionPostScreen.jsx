import React, { useMemo, useState } from "react";
import QuestionTopBar from "../components/question/QuestionTopBar.jsx";
const MAX_QUESTION_LEN = 100;
const MAX_TAGS = 5;


function FieldLabel({ icon, children, optional = false }) {
  return (
    <h3 className="text-base font-semibold pl-[1.5rem] pb-[0.75rem]">
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
  const canSubmit =
    question.trim().length > 0 &&
    participants > 1;


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
    <div className="flex h-screen w-full flex-col bg-white">

      <QuestionTopBar onSubmit={onSubmit} canSubmit={canSubmit}/>      

      <div className="flex-1 min-h-0 overflow-y-auto">

        <div className="w-full flex items-center justify-center pt-[2rem] pl-[1.5rem] pr-[1.5rem] pb-[1.5rem]">
          <div className="w-full bg-[#F2F4F8] rounded-[0.5rem] flex-col flex justify-center items-start mx-auto gap-[1rem] pb-[2rem] pt-[2rem] pr-[3.5625rem] pl-[3.5625rem]">
            <p className="text-center mx-auto text-[0.875rem] text-[#3B3D40]">
              콘텐츠를 추가하여<br/> 그 안에서 떠오른 질문을 기록해보세요.
            </p>
            <div 
              className="flex w-[4.75rem] h-[4.75rem] rounded-[0.5rem] items-center justify-center rounded-2xl bg-white shadow mx-auto"
            >
              <button onClick={() => window.location.href = "/content/search"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                  <path d="M17.5 8.16667H10.5V1.16667C10.5 0.857247 10.3771 0.560501 10.1583 0.341709C9.9395 0.122917 9.64275 0 9.33333 0C9.02391 0 8.72717 0.122917 8.50838 0.341709C8.28958 0.560501 8.16667 0.857247 8.16667 1.16667V8.16667H1.16667C0.857247 8.16667 0.560501 8.28958 0.341709 8.50838C0.122917 8.72717 0 9.02391 0 9.33333C0 9.64275 0.122917 9.9395 0.341709 10.1583C0.560501 10.3771 0.857247 10.5 1.16667 10.5H8.16667V17.5C8.16667 17.8094 8.28958 18.1062 8.50838 18.325C8.72717 18.5438 9.02391 18.6667 9.33333 18.6667C9.64275 18.6667 9.9395 18.5438 10.1583 18.325C10.3771 18.1062 10.5 17.8094 10.5 17.5V10.5H17.5C17.8094 10.5 18.1062 10.3771 18.325 10.1583C18.5438 9.9395 18.6667 9.64275 18.6667 9.33333C18.6667 9.02391 18.5438 8.72717 18.325 8.50838C18.1062 8.28958 17.8094 8.16667 17.5 8.16667Z" fill="#B5BBC1"/>
                  <path d="M17.5 8.16667H10.5V1.16667C10.5 0.857247 10.3771 0.560501 10.1583 0.341709C9.9395 0.122917 9.64275 0 9.33333 0C9.02391 0 8.72717 0.122917 8.50838 0.341709C8.28958 0.560501 8.16667 0.857247 8.16667 1.16667V8.16667H1.16667C0.857247 8.16667 0.560501 8.28958 0.341709 8.50838C0.122917 8.72717 0 9.02391 0 9.33333C0 9.64275 0.122917 9.9395 0.341709 10.1583C0.560501 10.3771 0.857247 10.5 1.16667 10.5H8.16667V17.5C8.16667 17.8094 8.28958 18.1062 8.50838 18.325C8.72717 18.5438 9.02391 18.6667 9.33333 18.6667C9.64275 18.6667 9.9395 18.5438 10.1583 18.325C10.3771 18.1062 10.5 17.8094 10.5 17.5V10.5H17.5C17.8094 10.5 18.1062 10.3771 18.325 10.1583C18.5438 9.9395 18.6667 9.64275 18.6667 9.33333C18.6667 9.02391 18.5438 8.72717 18.325 8.50838C18.1062 8.28958 17.8094 8.16667 17.5 8.16667Z" fill="black" fill-opacity="0.2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center pb-[1.5rem]">
          <FieldLabel>질문 작성하기</FieldLabel>
          <div className="flex flex-col items-center justify-center pl-[1.5rem] pr-[1.5rem]">
            <textarea
              style={{ resize: "none" }}
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, MAX_QUESTION_LEN))}
              placeholder={"지금 당신의 생각이 머무는 사이에는 어떤 질문이 있나요?"}
              className="w-full h-[8rem] bg-[#FFFFFF] border-[0.1rem] border-[#CCD2D8] rounded-[0.5rem] box-border p-[1rem] placeholder:text-[#CCD2D8] outline-none text-[1rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875rem]"
            >
            </textarea>
            <div className="self-start pt-[0.5rem]">
              <span className="text-[#CCD2D8] text-[0.75rem]">욕설, 비속어 사용 시 서비스 이용이 제한될 수 있습니다.</span>
              <span className="text-[#CCD2D8] text-[0.75rem]">  {question.length}/{MAX_QUESTION_LEN}</span>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col justify-center pb-[1.5rem]">
          <FieldLabel optional>설명 입력하기</FieldLabel>
          <div className="flex flex-col items-center justify-center pl-[1.5rem] pr-[1.5rem]">
            <textarea
              style={{ resize: "none" }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={"질문에 관해 자유롭게 설명을 덧붙여보세요."}
              className="w-full h-[8rem] bg-[#FFFFFF] border-[0.1rem] border-[#CCD2D8] rounded-[0.5rem] box-border p-[1rem] placeholder:text-[#CCD2D8] outline-none text-[1rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875em]"
            >
            </textarea>
          </div>
        </div>


        <div className="flex flex-col justify-center pb-[1.5rem]">
          <FieldLabel optional>
            태그 추가하기
          </FieldLabel>
          <div className="flex flex-col items-center justify-center pl-[1.5rem] pr-[1.5rem]">
            <input
              type="text"
              placeholder="예: #사랑 #기억 #관계"
              className="w-full h-[2rem] bg-[#FFFFFF] border-[0.1rem] border-[#CCD2D8] rounded-[0.5rem] box-border p-[1rem] placeholder:text-[#CCD2D8] outline-none text-[0.8rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.8rem]"
            />
            <div className="self-start pt-[0.5rem]">
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
                className="rounded-full w-[1.5rem] h-[1.5rem] border-none flex items-center justify-center bg-[#E7EBEF]" 
                aria-label="인원 감소"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="2" viewBox="0 0 16 2" fill="none">
                  <path d="M1 1H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <div className="min-w-[3rem] text-[1rem] text-center">
                {participants}명
              </div>
              
              <button
                type="button"
                onClick={() => setParticipants((n) => n + 1)}
                className="rounded-full w-[1.5rem] h-[1.5rem] border-none flex items-center justify-center bg-[#E7EBEF]" 
                aria-label="인원 증가"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M12.5 5.83333H7.5V0.833333C7.5 0.61232 7.4122 0.400358 7.25592 0.244078C7.09964 0.0877975 6.88768 0 6.66667 0C6.44565 0 6.23369 0.0877975 6.07741 0.244078C5.92113 0.400358 5.83333 0.61232 5.83333 0.833333V5.83333H0.833333C0.61232 5.83333 0.400358 5.92113 0.244078 6.07741C0.0877975 6.23369 0 6.44565 0 6.66667C0 6.88768 0.0877975 7.09964 0.244078 7.25592C0.400358 7.4122 0.61232 7.5 0.833333 7.5H5.83333V12.5C5.83333 12.721 5.92113 12.933 6.07741 13.0893C6.23369 13.2455 6.44565 13.3333 6.66667 13.3333C6.88768 13.3333 7.09964 13.2455 7.25592 13.0893C7.4122 12.933 7.5 12.721 7.5 12.5V7.5H12.5C12.721 7.5 12.933 7.4122 13.0893 7.25592C13.2455 7.09964 13.3333 6.88768 13.3333 6.66667C13.3333 6.44565 13.2455 6.23369 13.0893 6.07741C12.933 5.92113 12.721 5.83333 12.5 5.83333Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
      </div>


      <div className="shrink-0 pl-[1.5rem] pr-[1.5rem] pb-[1rem] pt-[1rem] bg-white">
        <button
          type="button"
          onClick={onSubmit}              
          disabled={!canSubmit}           
          className={`w-full h-[2.5rem] rounded-[0.5rem] text-center transition-colors
            ${canSubmit
              ? "bg-[#FA502E] cursor-pointer"
              : "bg-[#CCD2D8] cursor-not-allowed"
            }`}
        >
          <span className="text-[1rem] text-white font-bold">
            질문 등록하기
          </span>
        </button>
      </div>
    </div>
  );
}
