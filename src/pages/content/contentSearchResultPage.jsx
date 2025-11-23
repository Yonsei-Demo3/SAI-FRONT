import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContentTopBar from "../../components/contents/contentTopBar";


// 빈 응답일 때 보여줄 기본 데이터
const SAMPLE = {
  id: 1,
  title: "서사의 위기",
  category: "대분류 / 소분류",
  thumb:
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop",
};


const API_RESULTS = Array.from({ length: 10 }, (_, i) => ({
  ...SAMPLE,
  id: i + 1,
  title: `${SAMPLE.title} ${i + 1}`,
}));

const SORT_OPTIONS = [
  { value: "popular", label: "인기순" },
  { value: "latest", label: "최신순" },
  { value: "title", label: "가나다순" },
];


export default function ContentSearchPage({
  results: initialResults,
  onRegister,
  onSelectItem,
}) {

  const [query, setQuery] = useState("");
  const results = initialResults ?? API_RESULTS;
  const navigate = useNavigate();

  // 간단한 클라이언트 필터 (원하면 제거)
  const filtered = results.filter(
    (r) =>
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.category.toLowerCase().includes(query.toLowerCase())
  );

  // 정렬 드롭다운 상태
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  // 정렬 적용 -> 추후 백엔드에서 주는 순서로 받아서 사용해야함
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === "latest") return arr.reverse();
    if (sortBy === "title") return arr.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    return arr;
  }, [filtered, sortBy]);

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ?? "정렬";


  return (

    <div className="h-screen overflow-y-auto">

     <div className="sticky top-0 z-20 bg-white">
        <ContentTopBar title="콘텐츠 검색"/>
      </div>

      {/* 검색창 */}
      <div className="flex flex-col items-center justify-center pt-[1rem] pb-[1.5rem] pl-[1.5rem] pr-[1.5rem]">
        <div className = "relative w-full">
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
            placeholder="책, 영화, 영상 등 콘텐츠 제목을 입력하세요"
            className="w-full h-[2rem] bg-[#F2F4F8] border-0 rounded-[0.5rem] box-border pl-[2.5rem] placeholder:text-[#CCD2D8] outline-none text-[0.8rem] font-pre placeholder:[font-family:inherit] placeholder:text-[0.875rem]"
          />
        </div>
      </div>


      {/* 검색 결과 헤더 */}
      <div className="flex w-full items-center justify-between pb-[1rem] pr-[1.5rem]">
        <span className="pl-[1.5rem] text-[1rem] font-bold justify-left flex">
          검색결과 {filtered.length}
        </span>

        <div className="relative inline-block text-left">
          {/* 현재 선택된 정렬 + 토글 버튼 */}
          <button
            type="button"
            className="flex items-center bg-white border-none "
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
            onClick={() => setSortOpen((v) => !v)}
          >
            <span className="text-[#B5BBC1] text-[0.75rem]">{currentSortLabel}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="6"
              viewBox="0 0 12 6"
              fill="none"
              className="ml-[0.25rem]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.35557 5.0785L9.18407 2.25L8.47707 1.543L6.00207 4.018L3.52707 1.543L2.82007 2.25L5.64857 5.0785C5.74233 5.17223 5.86949 5.22489 6.00207 5.22489C6.13465 5.22489 6.2618 5.17223 6.35557 5.0785Z"
                fill="#B5BBC1"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.35557 5.0785L9.18407 2.25L8.47707 1.543L6.00207 4.018L3.52707 1.543L2.82007 2.25L5.64857 5.0785C5.74233 5.17223 5.86949 5.22489 6.00207 5.22489C6.13465 5.22489 6.2618 5.17223 6.35557 5.0785Z"
                fill="black"
                fillOpacity="0.2"
              />
            </svg>
          </button>

          {/* 드롭다운 목록 */}
          {sortOpen && (
            <ul
              role="listbox"
              className="
                list-none
                absolute right-0 top-[-0.5rem] 
                min-w-[5rem]
                bg-white rounded-[0.5rem]
                shadow-lg
                py-[0.75rem]
                px-[0.75rem]
                z-20
              "
            >
              {SORT_OPTIONS.map((opt) => {
                const isActive = sortBy === opt.value;
                return (
                  <li key={opt.value} className="mb-[0.25rem]:last:mb-0">
                    <button
                      type="button"
                      aria-selected={isActive}
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortOpen(false);
                      }}
                      className="
                        w-full text-right
                        bg-white
                        py-[0.25rem]
                      "
                    >
                      <span
                        className={`
                          text-[0.75rem]
                          ${isActive ? "text-black" : "text-[#B5BBC1]"}
                        `}
                      >
                        {opt.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

            
      {/* 검색 결과 */}
      <div>
        <ul className="list-none w-full bg-white p-[0rem] m-[0rem]">
            {sorted.map((item) => (
              <li key={item.id} className="pt-[0.5rem] pb-[0.5rem] pl-[1.5rem] pr-[1.5rem]">
                <button
                  onClick={() => onSelectItem?.(item)}
                  className="w-full border-[0rem] flex items-center p-[0rem] bg-[#FFFFFF]"
                >
                  <img
                    src={item.thumb}
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
                </button>
              </li>
            ))}
          </ul>
      </div>

      <div className="w-full pb-[0.25rem] pt-[1rem] pl-[1.5rem] pr-[1.5rem] flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 9.75C6.68416 9.75 6.83865 9.6876 6.96345 9.5628C7.08825 9.438 7.15043 9.28373 7.15 9.1V6.5C7.15 6.31583 7.0876 6.16156 6.9628 6.0372C6.838 5.91283 6.68373 5.85043 6.5 5.85C6.31626 5.84956 6.162 5.91196 6.0372 6.0372C5.9124 6.16243 5.85 6.3167 5.85 6.5V9.1C5.85 9.28416 5.9124 9.43865 6.0372 9.56345C6.162 9.68825 6.31626 9.75043 6.5 9.75ZM6.5 4.55C6.68416 4.55 6.83865 4.4876 6.96345 4.3628C7.08825 4.238 7.15043 4.08373 7.15 3.9C7.14956 3.71627 7.08716 3.562 6.9628 3.4372C6.83843 3.3124 6.68416 3.25 6.5 3.25C6.31583 3.25 6.16156 3.3124 6.0372 3.4372C5.91283 3.562 5.85043 3.71627 5.85 3.9C5.84956 4.08373 5.91196 4.23822 6.0372 4.36345C6.16243 4.48868 6.3167 4.55087 6.5 4.55ZM6.5 13C5.60083 13 4.75583 12.8293 3.965 12.4878C3.17417 12.1463 2.48625 11.6833 1.90125 11.0987C1.31625 10.5142 0.853234 9.82626 0.512201 9.035C0.171167 8.24373 0.000434156 7.39873 8.22784e-07 6.5C-0.00043251 5.60126 0.170301 4.75627 0.512201 3.965C0.8541 3.17373 1.31712 2.48582 1.90125 1.90125C2.48538 1.31668 3.1733 0.853666 3.965 0.5122C4.7567 0.170733 5.6017 0 6.5 0C7.3983 0 8.24329 0.170733 9.03499 0.5122C9.82669 0.853666 10.5146 1.31668 11.0987 1.90125C11.6829 2.48582 12.1461 3.17373 12.4884 3.965C12.8308 4.75627 13.0013 5.60126 13 6.5C12.9987 7.39873 12.828 8.24373 12.4878 9.035C12.1476 9.82626 11.6846 10.5142 11.0987 11.0987C10.5129 11.6833 9.82496 12.1465 9.03499 12.4884C8.24503 12.8303 7.40003 13.0009 6.5 13Z" fill="#B5BBC1"/>
          <path d="M6.5 9.75C6.68416 9.75 6.83865 9.6876 6.96345 9.5628C7.08825 9.438 7.15043 9.28373 7.15 9.1V6.5C7.15 6.31583 7.0876 6.16156 6.9628 6.0372C6.838 5.91283 6.68373 5.85043 6.5 5.85C6.31626 5.84956 6.162 5.91196 6.0372 6.0372C5.9124 6.16243 5.85 6.3167 5.85 6.5V9.1C5.85 9.28416 5.9124 9.43865 6.0372 9.56345C6.162 9.68825 6.31626 9.75043 6.5 9.75ZM6.5 4.55C6.68416 4.55 6.83865 4.4876 6.96345 4.3628C7.08825 4.238 7.15043 4.08373 7.15 3.9C7.14956 3.71627 7.08716 3.562 6.9628 3.4372C6.83843 3.3124 6.68416 3.25 6.5 3.25C6.31583 3.25 6.16156 3.3124 6.0372 3.4372C5.91283 3.562 5.85043 3.71627 5.85 3.9C5.84956 4.08373 5.91196 4.23822 6.0372 4.36345C6.16243 4.48868 6.3167 4.55087 6.5 4.55ZM6.5 13C5.60083 13 4.75583 12.8293 3.965 12.4878C3.17417 12.1463 2.48625 11.6833 1.90125 11.0987C1.31625 10.5142 0.853234 9.82626 0.512201 9.035C0.171167 8.24373 0.000434156 7.39873 8.22784e-07 6.5C-0.00043251 5.60126 0.170301 4.75627 0.512201 3.965C0.8541 3.17373 1.31712 2.48582 1.90125 1.90125C2.48538 1.31668 3.1733 0.853666 3.965 0.5122C4.7567 0.170733 5.6017 0 6.5 0C7.3983 0 8.24329 0.170733 9.03499 0.5122C9.82669 0.853666 10.5146 1.31668 11.0987 1.90125C11.6829 2.48582 12.1461 3.17373 12.4884 3.965C12.8308 4.75627 13.0013 5.60126 13 6.5C12.9987 7.39873 12.828 8.24373 12.4878 9.035C12.1476 9.82626 11.6846 10.5142 11.0987 11.0987C10.5129 11.6833 9.82496 12.1465 9.03499 12.4884C8.24503 12.8303 7.40003 13.0009 6.5 13Z" fill="black" fill-opacity="0.2"/>
        </svg>

        <p className="text-[#B5BBC1] text-[0.75rem] pl-[0.35rem]">
          찾는 콘텐츠가 없나요? 직접 콘텐츠를 추가할 수 있어요.
        </p>
      </div>

      <div className="pt-[0.5rem] pr-[1.5rem] pl-[1.5rem] pb-[2rem]">
         <button
              onClick={()=>navigate("/content/register")}
              className="w-full h-[2.5rem] rounded-[0.5rem] border border-[#B5BBC1] bg-[#FFFFFF] flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.8335 9.16665H10.8335V4.16665C10.8335 3.94563 10.7457 3.73367 10.5894 3.57739C10.4331 3.42111 10.2212 3.33331 10.0002 3.33331C9.77915 3.33331 9.56719 3.42111 9.41091 3.57739C9.25463 3.73367 9.16683 3.94563 9.16683 4.16665V9.16665H4.16683C3.94582 9.16665 3.73385 9.25444 3.57757 9.41072C3.42129 9.567 3.3335 9.77897 3.3335 9.99998C3.3335 10.221 3.42129 10.433 3.57757 10.5892C3.73385 10.7455 3.94582 10.8333 4.16683 10.8333H9.16683V15.8333C9.16683 16.0543 9.25463 16.2663 9.41091 16.4226C9.56719 16.5788 9.77915 16.6666 10.0002 16.6666C10.2212 16.6666 10.4331 16.5788 10.5894 16.4226C10.7457 16.2663 10.8335 16.0543 10.8335 15.8333V10.8333H15.8335C16.0545 10.8333 16.2665 10.7455 16.4228 10.5892C16.579 10.433 16.6668 10.221 16.6668 9.99998C16.6668 9.77897 16.579 9.567 16.4228 9.41072C16.2665 9.25444 16.0545 9.16665 15.8335 9.16665Z" fill="#3B3D40"/>
              </svg>
              <span className="text-[0.875rem]">
                직접 등록하기
              </span>
            </button>
      </div>
    </div>
  );
}