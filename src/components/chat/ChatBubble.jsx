import React from "react";
import BookmarkIcon from "./BookmarkIcon";

function Avatar({ initials = "" }) {
  return (
    <div
      className="flex h-[2.5rem] w-[2.5rem] items-center justify-center
                 rounded-full bg-[#DEE2E6]"
    >
      {initials}
    </div>
  );
}


export default function ChatBubble({ msg, onToggleBookmark, onImageClick, onFileClick }) {
 
  
  const messageId = msg.messageId;
  const content = msg.content;
  const senderNickname = msg.senderNickname;
  const isMine = msg.isMine;
  const type = msg.type || "TEXT";
  const time = msg.time || "오후 4:20";
  const imageUrl = msg.imageUrl || null;
  const images = msg.images || [];
  const files = msg.files || [];
  const bookmarked = msg.bookmarked || false;
  const imageColor = msg.imageColor || "bg-orange-400";

  return (
    
    <div className={`w-full flex pl-[0.625rem] pr-[0.625rem] pt-[0.5rem] pb-[0.5rem] ${!isMine ? "justify-start" : "justify-end"}`}>


      {!isMine && (
        <div className="flex flex-col items-center">
          <Avatar initials={senderNickname?.slice(0, 1)} bg={imageColor} />
        </div>
      )}

      {/* 상대 대화 북마크 */}
      {isMine && type === "TEXT" && (
        <div className="self-end mb-[1rem]">
          <button
            onClick={() => onToggleBookmark?.(messageId)}
            className={`border-none bg-[#FFFFFF] ${
              bookmarked ? "text-[#FA502E]" : "text-[#DEE2E6]"
            }`}
            aria-label="bookmark"
            title="북마크"
            aria-pressed={!!bookmarked}
          >
            <BookmarkIcon filled={bookmarked} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-[0.5rem]">
        
        {/* nickname */}
        <div className="items-start pl-[0.5rem]">
          {!isMine && (
            <div className="border-none">
              <span className="text-[0.875rem] text-[#191D1F]">
                {senderNickname}
              </span>
            </div>
          )}
        </div>
        
        <div className="w-full flex items-end">
          {/* message bubble */}
          <div className={`${isMine ? "pl-[0.5rem]" : "pr-[0.5rem]"}`}>


              {/* 텍스트 메시지 */}
              {type === "TEXT" && (
                <div
                  className={`relative max-w-[15rem] rounded-[1rem] pl-[1.25rem] pr-[1.25rem] pt-[0.875rem] pb-[0.875rem] 
                              ${!isMine ? "border border-[#DEE2E6] bg-[#FFFFFF]" : "bg-[#FA502E]"}`}
                >
                <span
                  className={`text-[0.875rem] ${
                    !isMine ? "text-[#191D1F]" : "text-[#FFFFFF]"
                  }`}
                >
                  {content}
                </span>
              </div>
              )}
              

              {/* 이미지 메시지 */}
              {type === "IMAGE" && images && (
                <div
                  className={`relative max-w-[15rem] rounded-[1rem] pl-[1.25rem] pr-[1.25rem] pt-[0.875rem] pb-[0.875rem]`}
                >
                  <div
                    className={`grid ${
                      images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    } gap-[0.5rem]`}
                  >
                    {images.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`uploaded-${idx}`}
                        className="w-full max-w-[10rem] rounded-[0.5rem] border border-[#DEE2E6]"
                        onClick={() => onImageClick?.(src)} 
                      />
                    ))}          
                </div>
              </div>
              )}

              {type === "FILE" && files && (
                  <div
                    className="relative max-w-[15rem] rounded-[1rem] pl-[1.25rem] pr-[1.25rem] pt-[0.875rem] pb-[0.875rem]"
                  >
                    <div className="flex flex-col gap-[0.5rem]">
                      {files.map((file, idx) => {
                        const sizeKB =
                          typeof file?.size === "number"
                            ? `${(file.size / 1024).toFixed(1)} KB`
                            : null;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onFileClick?.(file)}   // 🔹 클릭 시 다운로드
                            className="flex text-left items-center gap-[0.5rem] bg-[#F2F4F8] rounded-[0.5rem] px-[0.75rem] py-[0.5rem]"
                          >
                            {/* 파일 아이콘 */}
                            <div className="flex justify-center items-center w-[2rem] h-[2rem] rounded-[0.5rem] bg-white border border-[#DEE2E6]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="27" viewBox="0 0 22 27" fill="none">
                                <path d="M10.6667 0V8.66667C10.6667 9.16384 10.8519 9.64319 11.1862 10.0112C11.5204 10.3793 11.9798 10.6096 12.4747 10.6573L12.6667 10.6667H21.3333V24C21.3335 24.6728 21.0795 25.3208 20.622 25.8141C20.1645 26.3074 19.5375 26.6095 18.8667 26.66L18.6667 26.6667H2.66667C1.9939 26.6669 1.34591 26.4128 0.852603 25.9553C0.359294 25.4979 0.0571246 24.8709 0.00666695 24.2L1.33691e-07 24V2.66667C-0.000212772 1.9939 0.253875 1.34591 0.711329 0.852603C1.16878 0.359294 1.79579 0.0571244 2.46667 0.00666682L2.66667 0H10.6667ZM13.3333 0.0573333C13.7645 0.148866 14.1663 0.345852 14.5027 0.630667L14.6667 0.781333L20.552 6.66667C20.8644 6.97882 21.0944 7.36367 21.2213 7.78667L21.2747 8H13.3333V0.0573333Z" fill="#FF7053"/>
                              </svg>
                            </div>

                            {/* 파일 정보 */}
                            <div className="flex flex-col min-w-0">
                              <span className="text-[0.8125rem] text-[#191D1F] truncate max-w-[10rem]">
                                {file?.name || `파일 ${idx + 1}`}
                              </span>
                              {sizeKB && (
                                <span className="text-[0.6875rem] text-[#6C757D]">
                                  {sizeKB}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
          </div>
        </div>

        {!isMine && (
          <div className="pl-[0.5rem] text-[0.625rem] text-[#B5BBC1]">
            {time}
          </div>
        )}
        {isMine && (
          <div className="flex justify-end pr-[0.5rem] text-[0.625rem] text-[#B5BBC1]">
            {time}
          </div>
        )}
      </div>

      {/*상대 대화 북마크 */}
      {!isMine && type === "TEXT" && (
        <div className="self-end mb-[1rem] ml-[0.1rem]">
          <button
            onClick={() => onToggleBookmark?.(messageId)}
            className={`border-none bg-[#FFFFFF] ${
              bookmarked ? "text-[#FA502E]" : "text-[#DEE2E6]"
            }`}
            aria-label="bookmark"
            title="북마크"
            aria-pressed={!!bookmarked}
          >
            <BookmarkIcon filled={bookmarked} />
          </button>
        </div>
      )}
    </div>
  );
}
