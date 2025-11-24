import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentTopBar from "../../components/contents/contentTopBar";


// 빈 응답일 때 보여줄 기본 데이터
const SAMPLE = {
  id: 1,
  title: "이",
  category: "대분류 / 소분류",
  imageUrl:
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop",
};


const API_RESULTS = Array.from({ length: 4 }, (_, i) => ({
  ...SAMPLE,
  id: i + 1,
  title: `${SAMPLE.title} ${i + 1}`,
}));



export default function ContentSearchPage({
  results: initialResults,
  onRegister,
  onSelectItem,
}) {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(initialResults ?? API_RESULTS);
  const [searchDelete, setSearchDelete] = useState(false);
  const navigate = useNavigate();

  const handleDeleteItem = (id) => {
    setResults((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSearch = () => {

     const trimmed = query.trim();
     if (!trimmed) return;

     navigate("/content/search/result", { state: { query: trimmed } });
  };

  
  const handleClickItem = (item) => {
    const keyword = (item.title || "").trim();
    if (!keyword) return;

    navigate("/content/search/result", {
      state: { query: keyword },
    });
  };

  return (

    <div className="h-screen overflow-y-auto">

      <div className="sticky top-0 z-20 bg-white">
        <ContentTopBar title="콘텐츠 검색"/>
      </div>

      {/* 검색창 */}
      <div className="flex flex-col items-center justify-center pt-[1rem] pb-[1.5rem] pl-[1.5rem] pr-[1.5rem]">
        <form 
          className = "relative w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
            fill="none"
            className="w-[1rem] h-[1rem] pointer-events-none absolute left-[1rem] top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <path d="M6.5 13C4.68333 13 3.146 12.3707 1.888 11.112C0.63 9.85333 0.000667196 8.316 5.29101e-07 6.5C-0.000666138 4.684 0.628667 3.14667 1.888 1.888C3.14733 0.629333 4.68467 0 6.5 0C8.31533 0 9.853 0.629333 11.113 1.888C12.373 3.14667 13.002 4.684 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L17.3 15.9C17.4833 16.0833 17.575 16.3167 17.575 16.6C17.575 16.8833 17.4833 17.1167 17.3 17.3C17.1167 17.4833 16.8833 17.575 16.6 17.575C16.3167 17.575 16.0833 17.4833 15.9 17.3L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5633 8.81333 11.0007 7.75067 11 6.5C10.9993 5.24933 10.562 4.187 9.688 3.313C8.814 2.439 7.75133 2.00133 6.5 2C5.24867 1.99867 4.18633 2.43633 3.313 3.313C2.43967 4.18967 2.002 5.252 2 6.5C1.998 7.748 2.43567 8.81067 3.313 9.688C4.19033 10.5653 5.25267 11.0027 6.5 11Z" fill="#B5BBC1"/>
            <path d="M6.5 13C4.68333 13 3.146 12.3707 1.888 11.112C0.63 9.85333 0.000667196 8.316 5.29101e-07 6.5C-0.000666138 4.684 0.628667 3.14667 1.888 1.888C3.14733 0.629333 4.68467 0 6.5 0C8.31533 0 9.853 0.629333 11.113 1.888C12.373 3.14667 13.002 4.684 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L17.3 15.9C17.4833 16.0833 17.575 16.3167 17.575 16.6C17.575 16.8833 17.4833 17.1167 17.3 17.3C17.1167 17.4833 16.8833 17.575 16.6 17.575C16.3167 17.575 16.0833 17.4833 15.9 17.3L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5633 8.81333 11.0007 7.75067 11 6.5C10.9993 5.24933 10.562 4.187 9.688 3.313C8.814 2.439 7.75133 2.00133 6.5 2C5.24867 1.99867 4.18633 2.43633 3.313 3.313C2.43967 4.18967 2.002 5.252 2 6.5C1.998 7.748 2.43567 8.81067 3.313 9.688C4.19033 10.5653 5.25267 11.0027 6.5 11Z" fill="black" fillOpacity="0.2"/>
          </svg>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="책, 영화, 영상 등 콘텐츠 제목을 입력하세요"
            className="w-full h-[2rem] bg-[#F2F4F8] border-0 rounded-[0.5rem] box-border pl-[2.5rem] placeholder:text-[#CCD2D8] outline-none text-[0.8rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875rem]"
          />
        </form>
      </div>

      {/* 검색 결과 */}
      <div className="flex w-full items-center justify-between pb-[1rem] pr-[1.5rem]">

        <span className="pl-[1.5rem] text-[1rem] font-bold justify-left flex">
          내가 최근에 질문한 콘텐츠
        </span>

        <div className="relative inline-block text-left">
          {/* 정렬 버튼  */}
          <button
            className="bg-white border-none justify-end"
            type="button"
            onClick={() => setSearchDelete((v) => !v)}
          >
            <span className="text-[0.75rem] text-[#B5BBC1]">기록 삭제</span>
          </button>
        </div>
      </div>

      {/* 검색 결과 */}
      <div>
        <ul className="w-full bg-white">
            {results.map((item) => (
              <li key={item.id} className="flex justify-center items-center pt-[1em] pb-[1rem] pl-[1.5rem] pr-[1.5rem]">
                <div
                  onClick={() => handleClickItem(item)}
                  className="w-full border-[0rem] flex items-center p-[0rem] bg-[#FFFFFF]"
                >
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-[3.75rem] h-[5rem] rounded-[0.5rem] object-cover border-[0rem]"
                  />
                  <div className="pl-[0.75rem] flex flex-col justify-center">
                    <p className="text-[0.625rem] text-left leading-none mb-[0.25rem]">
                      {item.category}
                    </p>
                    <p className="text-[0.875rem] text-left leading-none mt-[0.25rem]">
                      {item.title}
                    </p>
                  </div>
                </div>

                {searchDelete && (
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)} 
                    className="ml-2"
                  >  
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.30441 17.7168C6.1253 17.5352 6.0247 17.2891 6.0247 17.0324C6.0247 16.7758 6.1253 16.5297 6.30441 16.3481L10.7295 11.8675L6.30441 7.38694C6.21044 7.29828 6.13507 7.19137 6.0828 7.07257C6.03052 6.95378 6.00241 6.82554 6.00015 6.69551C5.99788 6.56548 6.02151 6.43632 6.06961 6.31574C6.11771 6.19515 6.18931 6.08561 6.28013 5.99365C6.37095 5.90169 6.47914 5.8292 6.59823 5.78049C6.71732 5.73178 6.84488 5.70786 6.9733 5.71016C7.10172 5.71245 7.22837 5.74091 7.34569 5.79384C7.46301 5.84677 7.56861 5.92309 7.65617 6.01823L12.0813 10.4988L16.5063 6.01823C16.5939 5.92309 16.6995 5.84677 16.8168 5.79384C16.9341 5.74091 17.0608 5.71245 17.1892 5.71016C17.3176 5.70786 17.4452 5.73178 17.5643 5.78049C17.6834 5.82919 17.7915 5.90169 17.8824 5.99365C17.9732 6.08561 18.0448 6.19515 18.0929 6.31574C18.141 6.43632 18.1646 6.56548 18.1624 6.69551C18.1601 6.82554 18.132 6.95378 18.0797 7.07257C18.0274 7.19136 17.9521 7.29828 17.8581 7.38694L13.433 11.8675L17.8581 16.3481C18.027 16.5317 18.119 16.7745 18.1146 17.0254C18.1103 17.2762 18.0099 17.5156 17.8347 17.6931C17.6594 17.8705 17.423 17.9721 17.1752 17.9765C16.9274 17.981 16.6876 17.8878 16.5063 17.7168L12.0813 13.2362L7.65617 17.7168C7.47684 17.8981 7.23374 18 6.98029 18C6.72683 18 6.48374 17.8981 6.30441 17.7168Z" fill="#B5BBC1"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.30441 17.7168C6.1253 17.5352 6.0247 17.2891 6.0247 17.0324C6.0247 16.7758 6.1253 16.5297 6.30441 16.3481L10.7295 11.8675L6.30441 7.38694C6.21044 7.29828 6.13507 7.19137 6.0828 7.07257C6.03052 6.95378 6.00241 6.82554 6.00015 6.69551C5.99788 6.56548 6.02151 6.43632 6.06961 6.31574C6.11771 6.19515 6.18931 6.08561 6.28013 5.99365C6.37095 5.90169 6.47914 5.8292 6.59823 5.78049C6.71732 5.73178 6.84488 5.70786 6.9733 5.71016C7.10172 5.71245 7.22837 5.74091 7.34569 5.79384C7.46301 5.84677 7.56861 5.92309 7.65617 6.01823L12.0813 10.4988L16.5063 6.01823C16.5939 5.92309 16.6995 5.84677 16.8168 5.79384C16.9341 5.74091 17.0608 5.71245 17.1892 5.71016C17.3176 5.70786 17.4452 5.73178 17.5643 5.78049C17.6834 5.82919 17.7915 5.90169 17.8824 5.99365C17.9732 6.08561 18.0448 6.19515 18.0929 6.31574C18.141 6.43632 18.1646 6.56548 18.1624 6.69551C18.1601 6.82554 18.132 6.95378 18.0797 7.07257C18.0274 7.19136 17.9521 7.29828 17.8581 7.38694L13.433 11.8675L17.8581 16.3481C18.027 16.5317 18.119 16.7745 18.1146 17.0254C18.1103 17.2762 18.0099 17.5156 17.8347 17.6931C17.6594 17.8705 17.423 17.9721 17.1752 17.9765C16.9274 17.981 16.6876 17.8878 16.5063 17.7168L12.0813 13.2362L7.65617 17.7168C7.47684 17.8981 7.23374 18 6.98029 18C6.72683 18 6.48374 17.8981 6.30441 17.7168Z" fill="black" fill-opacity="0.2"/>
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
      </div>

      <div className="pr-[1.5rem] pl-[1.5rem] pb-[3rem] pt-[1rem]">
         <button
              onClick={()=>navigate("/content/register")}
              className="w-full h-[2.5rem] rounded-[0.5rem] border border-[#B5BBC1] bg-[#FFFFFF] flex items-center justify-center text-[0.875rem]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" fill="#B5BBC1"/>
                <path d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z" fill="black" fill-opacity="0.2"/>
              </svg>
              <span className="text-[#B5BBC1] text-[0.875rem]">
                직접 등록하기
              </span>
          </button>
      </div>
    </div>
  );
}