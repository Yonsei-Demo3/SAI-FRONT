import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentTopBar from "../../components/contents/contentTopBar";
import Dropdown from "../../components/contents/dropDown";
import { createContent } from "../../lib/contentService";

const MAJOR = ["책", "영화/TV", "기타 콘텐츠"];
const MINOR_BY_MAJOR = {
  "책": ["소설", "인문/사회/역사", "경영/경제", "자기계발", "에세이/시", "여행", "종교/철학", "외국어", "과학", "진로/교육/교재", "컴퓨터/IT", "건강/다이어트", "가정/생활", "어린이/청소년", "잡지"],
  "영화/TV": ["한국 예능", "한국", "외국", "아시아", "액션", "코미디", "드라마", "스포츠", "키즈/가족", "로맨스", "드라마 장르", "호러", "스릴러", "SF", "판타지", "애니메이션", "다큐멘터리", "뮤지컬"],
  "기타 콘텐츠": ["웹툰", "웹소설", "만화", "유튜브 영상", "기타"],
};

function ReturnLabel({ text, optional = false }) {
  return (
    <p className={`text-[0.75rem]`} aria-required={!optional}>
      {text}
      {!optional && (
        <span className="text-[#FA502E]" aria-hidden="true"> *</span>
      )}
    </p>
  );
}

export default function ContentRegisterPage({}) {
  
  // 선택 상태
  const navigate = useNavigate();
  const [major, setMajor] = useState("");
  const [minor, setMinor] = useState("");
  const [contentsName, setContentsName] = useState("");
  const [creator, setCreator] = useState("");
  const [contentDesc, setContentDesc] = useState("");
  const [contentURL, setContentURL] = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  // 대분류 바뀌면 소분류 리셋
  useEffect(() => {
    setMinor("");
  }, [major]);

  const canSubmit =
    contentsName.trim().length > 0 && major.trim().length > 0 && minor.trim().length > 0;

  const handleImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f)); 
  };

  const handleRegister = async () => {
    
    let imagePreview = preview;

    if (preview === null) {
      imagePreview = "https://placehold.co/300x400?font=roboto&text=SAI";
    }

    const payload = {
      contentsName,
      creator,
      contentDesc,
      imagePreview,
      contentURL,
      major,
      minor
    };

    try {
      const response = await createContent(payload);
      console.log("콘텐츠 등록 성공:", response.data);
      navigate(-1);
    } catch (e) {
      console.error("콘텐츠 등록 실패:", e.response?.data || e.message);
    }
  };

  return (
    <div className="h-screen overflow-y-auto">

      <ContentTopBar title="직접 등록하기" isbutton={false} />

      {/* 이미지 등록 DIV */}
      <div className="flex justify-center pt-[2rem] pb-[0.75rem]">
        <div className="relative inline-block">
          <div className="w-[10rem] h-[13.3125rem] rounded-[0.5rem] bg-[#F2F4F8] relative">
              {/* 미리보기 */}
        {preview && (
                <img
                  src={preview}
                  alt="미리보기"
                  className="absolute w-full h-full rounded-[0.5rem] object-cover"
                />
              )}
              </div>

              {/* 업로드 트리거 버튼 */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute right-[0.75rem] bottom-[0.75rem] w-[1.375rem] h-[1.375rem] border-[0rem] rounded-full bg-[#3B3D40] opacity-50 flex items-center justify-center"
                aria-label="이미지 업로드"
              >
                {/* camera icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 4.5C5.187 4.5 4.5 5.187 4.5 6C4.5 6.813 5.187 7.5 6 7.5C6.813 7.5 7.5 6.813 7.5 6C7.5 5.187 6.813 4.5 6 4.5Z" fill="white"/>
                  <path d="M10 2.5H8.707L7.3535 1.1465C7.25975 1.05273 7.1326 1.00003 7 1H5C4.8674 1.00003 4.74025 1.05273 4.6465 1.1465L3.293 2.5H2C1.4485 2.5 1 2.9485 1 3.5V9C1 9.5515 1.4485 10 2 10H10C10.5515 10 11 9.5515 11 9V3.5C11 2.9485 10.5515 2.5 10 2.5ZM6 8.5C4.645 8.5 3.5 7.355 3.5 6C3.5 4.645 4.645 3.5 6 3.5C7.355 3.5 8.5 4.645 8.5 6C8.5 7.355 7.355 8.5 6 8.5Z" fill="white"/>
                </svg>
              </button>

              {/* 실제 파일 인풋 */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center pb-[1.5rem] pl-[1.5rem] pr-[1.5rem]">
          <div className = "relative w-full">
            <ReturnLabel text="콘텐츠명" optional={false} />
            <input
              type="text"
              value={contentsName}
              onChange={(e) => setContentsName(e.target.value)}
              placeholder="콘텐츠 제목을 입력하세요"
              className="w-full h-[2rem] bg-[#FFFFFF] border-0 border-b border-[#CCD2D8] box-border placeholder:text-[#CCD2D8] outline-none text-[0.8rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875rem]"
            />
          </div>
        </div>

    <div className="flex flex-col items-center justify-center pb-[1.5rem] pl-[1.5rem] pr-[1.5rem]">
      <div className = "relative w-full border-none border-[#CCD2D8]">
        <ReturnLabel text="콘텐츠 유형" optional={false} /> 
              <div className="flex flex-row mt-[0.5rem]">
                <Dropdown
                  itemClassName=""
                  placeholder="대분류"
                  options={MAJOR}
                  value={major}
                  onChange={setMajor}
                />
              <div className="w-[0.5rem]">
              </div>
                <Dropdown
                  placeholder="소분류"
                  options={major ? (MINOR_BY_MAJOR[major] || []) : []}
                  value={minor}
                  onChange={setMinor}
                  disabled={!major}
                />
              </div>
      </div>
    </div>

    <div className="flex flex-col items-center justify-center pb-[1.5rem] pl-[1.5rem] pr-[1.5rem]">
        <div className = "relative w-full">
          <ReturnLabel text="창작자" optional={true} />
          <input
            type="text"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="창작자 이름을 입력하세요"
            className="w-full h-[2rem] bg-[#FFFFFF] border-0 border-b border-[#CCD2D8] box-border placeholder:text-[#CCD2D8] outline-none text-[0.8rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875rem]"
          />
        </div>
      </div>

 <div className="flex flex-col items-center justify-center pb-[1.5rem] pl-[1.5rem] pr-[1.5rem]">
        <div className = "relative w-full">
          <ReturnLabel text="내용" optional={true} />
          <input
            type="text"
            value={contentDesc}
            onChange={(e) => setContentDesc(e.target.value)}
            placeholder="어떤 내용인지 간단히 적어주세요"
            className="w-full h-[2rem] bg-[#FFFFFF] border-0 border-b border-[#CCD2D8] box-border placeholder:text-[#CCD2D8] outline-none text-[0.8rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875rem]"
          />
        </div>
      </div>

 <div className="flex flex-col items-center justify-center pb-[1.5rem] pl-[1.5rem] pr-[1.5rem]">
        <div className = "relative w-full">
          <ReturnLabel text="링크" optional={true} />
          <input
            type="text"
            value={contentURL}
            onChange={(e) => setContentURL(e.target.value)}
            placeholder="관련 URL을 입력하세요"
            className="w-full h-[2rem] bg-[#FFFFFF] border-0 border-b border-[#CCD2D8] box-border placeholder:text-[#CCD2D8] outline-none text-[0.8rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875rem]"
          />
        </div>
      </div> 

      {/* 하단 버튼 */}

      <div className="shrink-0 pl-[1.5rem] pr-[1.5rem] pb-[1rem] pt-[0rem] bg-white">
        <button
          type="button"
          onClick={handleRegister}              
          disabled={!canSubmit}           
          className={`w-full h-[2.5rem] rounded-[0.5rem] text-center transition-colors
            ${canSubmit
              ? "bg-[#FA502E] cursor-pointer"
              : "bg-[#CCD2D8] cursor-not-allowed"
            }`}
        >
          <span className="text-[1rem] text-white font-bold">
            콘텐츠 등록하기
          </span>
        </button>
      </div>
    </div>
  );
}
