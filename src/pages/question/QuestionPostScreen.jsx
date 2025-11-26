import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createQuestion } from "../../lib/questionService";
import QuestionTopBar from "../../components/question/QuestionTopBar";

const MAX_QUESTION_LEN = 100;
const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 8;
const MAX_TAGS = 5;

function FieldLabel({ icon, children, optional = false, top}) {
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

  const location = useLocation();
  const navigate = useNavigate();

  const { content, contentId, imageUrl } = location.state || {};

  const [question, setQuestion] = useState("");
  const [desc, setDesc] = useState("");
  const [participants, setParticipants] = useState(2);
  const [startMode, setStartOption] = useState("ALL_READY"); 
  const [tagInput, setTagInput] = useState("");
  const canDecrement = participants > MIN_PARTICIPANTS;
  const canIncrement = participants < MAX_PARTICIPANTS;  
  const canSubmit =
    question.trim().length > 0 &&
    startMode !== "" &&
    !!contentId;

  const parseTags = (input) =>
    input
      .split("#")           
      .map((t) => t.trim()) 
      .filter(Boolean)     
      .map((t) => t.split(/\s+/)[0]); 


  const handleTagChange = (e) => {
    let value = e.target.value;

    if (value.length === 1 && value !== "#" && !value.startsWith("#")) {
      value = "#" + value;
    }

    setTagInput(value);
  };


  const handleTagKeyDown = (e) => {
    if (e.key === " ") {

      const currentTags = parseTags(tagInput);

      if (currentTags.length >= MAX_TAGS) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      let next = tagInput.replace(/\s+$/g, ""); 

      if (!next) {
        setTagInput("#");
        return;
      }

      setTagInput(next + " #");
    }
  };


  async function onSubmit(e) {
    e.preventDefault();

    const tags = parseTags(tagInput);

    const payload = {
      question: question.trim(),
      description: desc.trim(),
      participants: participants,
      contentId: contentId,
      tags: tags, 
      startMode,
    };

    try {
      const response = await createQuestion(payload);
    } catch (error) {
      console.error("등록 실패:", error);
    }

    navigate("/main");
  }


  return (
    <div className="flex h-screen w-full flex-col bg-white">

      <QuestionTopBar onSubmit={onSubmit} canSubmit={canSubmit}/>      

      <div className="flex-1 min-h-0 overflow-y-auto">
            
            {content ? (
              <>
              <div className="text-base font-semibold pl-[1.5rem] pb-[0rem] pt-[1.5rem]">
                선택한 콘텐츠
                <span className="text-[#FA502E]"> *</span>
              </div>
              <div className="flex pr-[1.5rem] pl-[1.5rem] mb-[1.5rem] justify-between items-center">
                <div className="flex items-start justify-center">
                  <div
                    key={contentId}
                    className="pt-[1rem] pb-[1rem] bg-[#FFFFFF] items-start"
                  >
                    <div className="w-full border-[0rem] flex items-center p-[0rem] bg-[#FFFFFF]">
                      <img
                        src={content.imageUrl || imageUrl || ""}
                        alt=""
                        className="w-[3.75rem] h-[5rem] rounded-[0.5rem] object-cover border-[0rem]"
                      />
                      <div className="pl-[0.75rem] flex flex-col justify-center">
                        <p className="text-[0.625rem] text-[#B5BBC1] text-left leading-none mb-[0.25rem]">
                          {content.category !== null
                            ? content.category
                            : content.mainCategory + " / " + content.subCategory}
                        </p>
                        <p className="text-[0.875rem] text-left leading-none mt-[0.25rem]">
                          {content.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/content/search/result")}
                  className="bg-[#FFFFFF] w-[3rem] h-[3rem] rounded-[0.5rem] border-none flex items-center justify-center"
                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.30441 17.7168C6.1253 17.5352 6.0247 17.2891 6.0247 17.0324C6.0247 16.7758 6.1253 16.5297 6.30441 16.3481L10.7295 11.8675L6.30441 7.38694C6.21044 7.29828 6.13507 7.19137 6.0828 7.07257C6.03052 6.95378 6.00241 6.82554 6.00015 6.69551C5.99788 6.56548 6.02151 6.43632 6.06961 6.31574C6.11771 6.19515 6.18931 6.08561 6.28013 5.99365C6.37095 5.90169 6.47914 5.8292 6.59823 5.78049C6.71732 5.73178 6.84488 5.70786 6.9733 5.71016C7.10172 5.71245 7.22837 5.74091 7.34569 5.79384C7.46301 5.84677 7.56861 5.92309 7.65617 6.01823L12.0813 10.4988L16.5063 6.01823C16.5939 5.92309 16.6995 5.84677 16.8168 5.79384C16.9341 5.74091 17.0608 5.71245 17.1892 5.71016C17.3176 5.70786 17.4452 5.73178 17.5643 5.78049C17.6834 5.82919 17.7915 5.90169 17.8824 5.99365C17.9732 6.08561 18.0448 6.19515 18.0929 6.31574C18.141 6.43632 18.1646 6.56548 18.1624 6.69551C18.1601 6.82554 18.132 6.95378 18.0797 7.07257C18.0274 7.19136 17.9521 7.29828 17.8581 7.38694L13.433 11.8675L17.8581 16.3481C18.027 16.5317 18.119 16.7745 18.1146 17.0254C18.1103 17.2762 18.0099 17.5156 17.8347 17.6931C17.6594 17.8705 17.423 17.9721 17.1752 17.9765C16.9274 17.981 16.6876 17.8878 16.5063 17.7168L12.0813 13.2362L7.65617 17.7168C7.47684 17.8981 7.23374 18 6.98029 18C6.72683 18 6.48374 17.8981 6.30441 17.7168Z" fill="#B5BBC1"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.30441 17.7168C6.1253 17.5352 6.0247 17.2891 6.0247 17.0324C6.0247 16.7758 6.1253 16.5297 6.30441 16.3481L10.7295 11.8675L6.30441 7.38694C6.21044 7.29828 6.13507 7.19137 6.0828 7.07257C6.03052 6.95378 6.00241 6.82554 6.00015 6.69551C5.99788 6.56548 6.02151 6.43632 6.06961 6.31574C6.11771 6.19515 6.18931 6.08561 6.28013 5.99365C6.37095 5.90169 6.47914 5.8292 6.59823 5.78049C6.71732 5.73178 6.84488 5.70786 6.9733 5.71016C7.10172 5.71245 7.22837 5.74091 7.34569 5.79384C7.46301 5.84677 7.56861 5.92309 7.65617 6.01823L12.0813 10.4988L16.5063 6.01823C16.5939 5.92309 16.6995 5.84677 16.8168 5.79384C16.9341 5.74091 17.0608 5.71245 17.1892 5.71016C17.3176 5.70786 17.4452 5.73178 17.5643 5.78049C17.6834 5.82919 17.7915 5.90169 17.8824 5.99365C17.9732 6.08561 18.0448 6.19515 18.0929 6.31574C18.141 6.43632 18.1646 6.56548 18.1624 6.69551C18.1601 6.82554 18.132 6.95378 18.0797 7.07257C18.0274 7.19136 17.9521 7.29828 17.8581 7.38694L13.433 11.8675L17.8581 16.3481C18.027 16.5317 18.119 16.7745 18.1146 17.0254C18.1103 17.2762 18.0099 17.5156 17.8347 17.6931C17.6594 17.8705 17.423 17.9721 17.1752 17.9765C16.9274 17.981 16.6876 17.8878 16.5063 17.7168L12.0813 13.2362L7.65617 17.7168C7.47684 17.8981 7.23374 18 6.98029 18C6.72683 18 6.48374 17.8981 6.30441 17.7168Z" fill="black" fill-opacity="0.2"/>
                </svg>
                </button>
              </div>
              </>

              ) : (
                <>
                  <div className="w-full flex items-center justify-center pt-[2rem] pl-[1.5rem] pr-[1.5rem] pb-[1.5rem]">
                    <div className="relative w-full bg-[#F2F4F8] rounded-[0.5rem] flex-col flex justify-center items-start mx-auto gap-[1rem] pb-[2rem] pt-[2rem] pr-[3.5625rem] pl-[3.5625rem]">
                      <p className="text-center mx-auto text-[0.875rem] text-[#3B3D40]">
                        콘텐츠를 추가하여<br/> 그 안에서 떠오른 질문을 기록해보세요.
                      </p>
                      <div 
                        className="flex w-[4.75rem] h-[4.75rem] rounded-[0.5rem] items-center justify-center rounded-2xl bg-white shadow mx-auto"
                      >
                        <button onClick={() => navigate("/content/search/result")}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                            <path d="M17.5 8.16667H10.5V1.16667C10.5 0.857247 10.3771 0.560501 10.1583 0.341709C9.9395 0.122917 9.64275 0 9.33333 0C9.02391 0 8.72717 0.122917 8.50838 0.341709C8.28958 0.560501 8.16667 0.857247 8.16667 1.16667V8.16667H1.16667C0.857247 8.16667 0.560501 8.28958 0.341709 8.50838C0.122917 8.72717 0 9.02391 0 9.33333C0 9.64275 0.122917 9.9395 0.341709 10.1583C0.560501 10.3771 0.857247 10.5 1.16667 10.5H8.16667V17.5C8.16667 17.8094 8.28958 18.1062 8.50838 18.325C8.72717 18.5438 9.02391 18.6667 9.33333 18.6667C9.64275 18.6667 9.9395 18.5438 10.1583 18.325C10.3771 18.1062 10.5 17.8094 10.5 17.5V10.5H17.5C17.8094 10.5 18.1062 10.3771 18.325 10.1583C18.5438 9.9395 18.6667 9.64275 18.6667 9.33333C18.6667 9.02391 18.5438 8.72717 18.325 8.50838C18.1062 8.28958 17.8094 8.16667 17.5 8.16667Z" fill="#B5BBC1"/>
                            <path d="M17.5 8.16667H10.5V1.16667C10.5 0.857247 10.3771 0.560501 10.1583 0.341709C9.9395 0.122917 9.64275 0 9.33333 0C9.02391 0 8.72717 0.122917 8.50838 0.341709C8.28958 0.560501 8.16667 0.857247 8.16667 1.16667V8.16667H1.16667C0.857247 8.16667 0.560501 8.28958 0.341709 8.50838C0.122917 8.72717 0 9.02391 0 9.33333C0 9.64275 0.122917 9.9395 0.341709 10.1583C0.560501 10.3771 0.857247 10.5 1.16667 10.5H8.16667V17.5C8.16667 17.8094 8.28958 18.1062 8.50838 18.325C8.72717 18.5438 9.02391 18.6667 9.33333 18.6667C9.64275 18.6667 9.9395 18.5438 10.1583 18.325C10.3771 18.1062 10.5 17.8094 10.5 17.5V10.5H17.5C17.8094 10.5 18.1062 10.3771 18.325 10.1583C18.5438 9.9395 18.6667 9.64275 18.6667 9.33333C18.6667 9.02391 18.5438 8.72717 18.325 8.50838C18.1062 8.28958 17.8094 8.16667 17.5 8.16667Z" fill="black" fill-opacity="0.2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
                )
            }
            

        <div className="flex flex-col justify-center pb-[1.5rem]">
        
          <FieldLabel>질문 작성하기</FieldLabel>
          <div className="flex flex-col items-center justify-center pl-[1.5rem] pr-[1.5rem]">
            <textarea
              style={{ resize: "none" }}
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, MAX_QUESTION_LEN))}
              placeholder={"지금 당신의 생각이 머무는 사이에는 어떤 질문이 있나요?"}
              className="w-full h-[8rem] bg-[#FFFFFF] border-[0.1rem] border-[#CCD2D8] rounded-[0.5rem] box-border p-[1rem] placeholder:text-[#CCD2D8] outline-none text-[0.875rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875rem]"
            >
            </textarea>
            <div className="flex items-center justify-between pt-[0.5rem] w-full">
              <span className="text-[#CCD2D8] text-[0.75rem]">욕설, 비속어 사용 시 서비스 이용이 제한될 수 있습니다.</span>
              <span className="text-[#CCD2D8] text-[0.75rem]"> {question.length} / {MAX_QUESTION_LEN}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center pb-[1.5rem] pt-[0.5rem]">
          <FieldLabel>참여 인원 설정</FieldLabel>

          <div className="flex items-center  pl-[1.5rem]">
            <button
              type="button"
              onClick={() => {
                if (!canDecrement) return;
                setParticipants((n) => Math.max(MIN_PARTICIPANTS, n - 1));
              }}
              className={`rounded-full w-[1.5rem] h-[1.5rem] border-none flex items-center justify-center
                      ${
                        canDecrement
                          ? "bg-[#3B3D40] cursor-pointer"   
                          : "bg-[#E7EBEF] cursor-not-allowed" 
                      }
                    `}              
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
              onClick={ () => {
                if (!canIncrement) return;
                setParticipants((n) => n + 1)}
              }
                            className={`rounded-full w-[1.5rem] h-[1.5rem] border-none flex items-center justify-center
                      ${
                        canIncrement
                          ? "bg-[#3B3D40] cursor-pointer"   
                          : "bg-[#E7EBEF] cursor-not-allowed" 
                      }
                    `}   
              aria-label="인원 증가"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12.5 5.83333H7.5V0.833333C7.5 0.61232 7.4122 0.400358 7.25592 0.244078C7.09964 0.0877975 6.88768 0 6.66667 0C6.44565 0 6.23369 0.0877975 6.07741 0.244078C5.92113 0.400358 5.83333 0.61232 5.83333 0.833333V5.83333H0.833333C0.61232 5.83333 0.400358 5.92113 0.244078 6.07741C0.0877975 6.23369 0 6.44565 0 6.66667C0 6.88768 0.0877975 7.09964 0.244078 7.25592C0.400358 7.4122 0.61232 7.5 0.833333 7.5H5.83333V12.5C5.83333 12.721 5.92113 12.933 6.07741 13.0893C6.23369 13.2455 6.44565 13.3333 6.66667 13.3333C6.88768 13.3333 7.09964 13.2455 7.25592 13.0893C7.4122 12.933 7.5 12.721 7.5 12.5V7.5H12.5C12.721 7.5 12.933 7.4122 13.0893 7.25592C13.2455 7.09964 13.3333 6.88768 13.3333 6.66667C13.3333 6.44565 13.2455 6.23369 13.0893 6.07741C12.933 5.92113 12.721 5.83333 12.5 5.83333Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center pb-[1.5rem] pt-[1rem]">
          <FieldLabel>대화 시작 시점</FieldLabel>

          <div className="flex flex-col items-start justify-center pl-[1.5rem] pr-[1.5rem] gap-[0.75rem]">
              {/* <button
                type="button"
                onClick={() => setStartOption("WITH_READY")}
                className={`
                  border-none rounded-[0.25rem] box-border
                  pl-[0.625rem] pr-[0.625rem] pt-[0.25rem] pb-[0.25rem]
                  flex items-center justify-center
                  ${
                    startMode === "WITH_READY"   
                      ? "bg-[#82A633]"
                      : "bg-[#F2F4F8]"
                  }`}
              >
                <span className={`text-[0.875rem] ${startMode === "WITH_READY" ? "text-white" : ""}`}>
                  준비된 인원끼리 바로 시작
                </span>
              </button> */}
              <button
                type="button"
                onClick={() => setStartOption("ALL_READY")}
                className={`
                  border-none rounded-[0.25rem] box-border
                  pl-[0.625rem] pr-[0.625rem] pt-[0.25rem] pb-[0.25rem]
                  flex items-center justify-center 
                  ${
                    startMode === "ALL_READY"
                      ? "bg-[#FA502E]"
                      : "bg-[#F2F4F8]"
                  }
                `}
              >
                <span className={`text-[0.875rem] text-center justify-center ${startMode === "ALL_READY" ? "text-white" : ""}`}>
                  모든 인원이 준비되면 시작
                </span>
              </button>
              <span className="text-[#CCD2D8] text-[0.75rem]">베타 버전에서는 설정된 인원 수가 모여야 대화가 시작돼요</span>


          </div>
        </div>

        
        <div className="flex flex-col justify-center pb-[1.5rem] pt-[0.5rem]">
          <FieldLabel optional>설명 입력하기</FieldLabel>
          <div className="flex flex-col items-center justify-center pl-[1.5rem] pr-[1.5rem]">
            <textarea
              style={{ resize: "none" }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={"질문에 관해 자유롭게 설명을 덧붙여보세요."}
              className="w-full h-[8rem] bg-[#FFFFFF] border-[0.1rem] border-[#CCD2D8] rounded-[0.5rem] box-border p-[1rem] placeholder:text-[#CCD2D8] outline-none text-[0.875rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875em]"
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
              value={tagInput}
              onChange={handleTagChange}
              onKeyDown={handleTagKeyDown}
              placeholder="예: #사랑 #기억 #관계"
              className="w-full h-[2rem] bg-[#FFFFFF] border-[0.1rem] border-[#CCD2D8] rounded-[0.5rem] box-border p-[1rem] placeholder:text-[#CCD2D8] outline-none text-[0.8rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.8rem]"
            />
            <div className="self-start pt-[0.5rem]">
              <span className="text-[#CCD2D8] text-[0.8rem]">최대 {MAX_TAGS}개까지 선택할 수 있어요.</span>
            </div>
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
