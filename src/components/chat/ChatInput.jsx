import React, { useState } from "react";

export default function ChatInput({ onSend, side = "right" }) {
  const [text, setText] = useState("");
  const[open, setOpen] = useState(false);

  const [previewImages, setPreviewImages] = useState([]); // 미리보기 이미지 list
  const [showPreview, setShowPreview] = useState(false);
  
  const cameraInputRef = React.useRef(null);
  const albumInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);  

  const sendText = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t, side, "text");
    setText("");
  };

  
  // 카메라 촬영 
  const handleCamera = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImages([url]);
    setShowPreview(true);
  };

  // 앨범 다중 선택 처리
  const handleAlbum = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewImages(urls);
    setShowPreview(true);
  };

  // 파일 선택 처리
  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // 부모에 File[] 전달
    onSend(files, side, "file");

    // 같은 파일 다시 선택 가능하도록 초기화
    e.target.value = "";

    // 시트 닫기
    setOpen(false);
  };

  // 미리보기 → 전송
  const sendImages = () => {
    onSend(previewImages, side, "image");
    setPreviewImages([]);
    setShowPreview(false);
    setOpen(false);
  };

  // 미리보기 → 취소
  const cancelPreview = () => {
    setPreviewImages([]);
    setShowPreview(false);
  };

  return (
    <>
      <input
         type="file"
         accept="image/*"
         capture="environment"
         ref={cameraInputRef}
         style={{ display: "none" }}
         onChange={handleCamera}
       />
  
       <input
         type="file"
         accept="image/*"
         multiple
         ref={albumInputRef}
         style={{ display: "none" }}
         onChange={handleAlbum}
       />

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFile}
          multiple // 여러 파일 전송을 허용
        />

    <div className="flex items-center border-none border-none pt-[1rem] pl-[1.5rem] pr-[1.5rem] pb-[1rem] shadow-[0_-3px_4px_rgba(0,0,0,0.08)]">
      

      <button
        type="button"
        aria-label="추가"
        onClick={() => setOpen(true)}
        className="w-[1rem] h-[1rem] bg-[#FFFFFF] border-none outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M15 7H9V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0C7.73478 0 7.48043 0.105357 7.29289 0.292893C7.10536 0.48043 7 0.734784 7 1V7H1C0.734784 7 0.48043 7.10536 0.292893 7.29289C0.105357 7.48043 0 7.73478 0 8C0 8.26522 0.105357 8.51957 0.292893 8.70711C0.48043 8.89464 0.734784 9 1 9H7V15C7 15.2652 7.10536 15.5196 7.29289 15.7071C7.48043 15.8946 7.73478 16 8 16C8.26522 16 8.51957 15.8946 8.70711 15.7071C8.89464 15.5196 9 15.2652 9 15V9H15C15.2652 9 15.5196 8.89464 15.7071 8.70711C15.8946 8.51957 16 8.26522 16 8C16 7.73478 15.8946 7.48043 15.7071 7.29289C15.5196 7.10536 15.2652 7 15 7Z" fill="#B5BBC1"/>
          <path d="M15 7H9V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0C7.73478 0 7.48043 0.105357 7.29289 0.292893C7.10536 0.48043 7 0.734784 7 1V7H1C0.734784 7 0.48043 7.10536 0.292893 7.29289C0.105357 7.48043 0 7.73478 0 8C0 8.26522 0.105357 8.51957 0.292893 8.70711C0.48043 8.89464 0.734784 9 1 9H7V15C7 15.2652 7.10536 15.5196 7.29289 15.7071C7.48043 15.8946 7.73478 16 8 16C8.26522 16 8.51957 15.8946 8.70711 15.7071C8.89464 15.5196 9 15.2652 9 15V9H15C15.2652 9 15.5196 8.89464 15.7071 8.70711C15.8946 8.51957 16 8.26522 16 8C16 7.73478 15.8946 7.48043 15.7071 7.29289C15.5196 7.10536 15.2652 7 15 7Z" fill="black" fill-opacity="0.2"/>
        </svg>
      </button>

       {open && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40"
          aria-modal="true"
          role="dialog"
          onClick={() => setOpen(false)} // 바깥 영역 클릭 시 닫힘
        >
          {/* 아래에서 올라오는 시트 */}
          <div
            className="w-full rounded-t-2xl bg-white p-4 max-h-[80vh] shadow-lg
                       transform translate-y-0 transition-transform duration-300 p-[1.5rem]"
            onClick={(e) => e.stopPropagation()} // 시트 안 클릭은 버블링 막기
          >
            <div className="flex pb-[1rem]">
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.304411 12.0068C0.125303 11.8252 0.0246992 11.5791 0.0246992 11.3225C0.0246992 11.0658 0.125302 10.8197 0.304411 10.6381L4.7295 6.15755L0.30441 1.67698C0.210442 1.58832 0.135072 1.4814 0.0827977 1.36261C0.0305231 1.24382 0.00241419 1.11558 0.000148353 0.985552C-0.00211748 0.855521 0.0215059 0.72636 0.0696093 0.605775C0.117713 0.485189 0.189311 0.37565 0.280132 0.28369C0.370953 0.19173 0.479136 0.119234 0.598229 0.070528C0.717321 0.0218219 0.844882 -0.00209907 0.973303 0.000195461C1.10172 0.00249 1.22837 0.0309514 1.34569 0.0838813C1.46301 0.136811 1.56861 0.213127 1.65617 0.308273L6.08125 4.78884L10.5063 0.308273C10.5939 0.213127 10.6995 0.136811 10.8168 0.0838809C10.9341 0.030951 11.0608 0.00248956 11.1892 0.000195014C11.3176 -0.00209953 11.4452 0.0218215 11.5643 0.0705275C11.6834 0.119234 11.7915 0.19173 11.8824 0.28369C11.9732 0.37565 12.0448 0.485189 12.0929 0.605774C12.141 0.72636 12.1646 0.855521 12.1624 0.985551C12.1601 1.11558 12.132 1.24382 12.0797 1.36261C12.0274 1.4814 11.9521 1.58832 11.8581 1.67698L7.43301 6.15755L11.8581 10.6381C12.027 10.8217 12.119 11.0645 12.1146 11.3154C12.1103 11.5663 12.0099 11.8057 11.8347 11.9831C11.6594 12.1605 11.423 12.2622 11.1752 12.2666C10.9274 12.271 10.6876 12.1779 10.5063 12.0068L6.08125 7.52625L1.65617 12.0068C1.47684 12.1882 1.23374 12.29 0.980288 12.29C0.726833 12.29 0.483742 12.1882 0.304411 12.0068Z" fill="#B5BBC1"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.304411 12.0068C0.125303 11.8252 0.0246992 11.5791 0.0246992 11.3225C0.0246992 11.0658 0.125302 10.8197 0.304411 10.6381L4.7295 6.15755L0.30441 1.67698C0.210442 1.58832 0.135072 1.4814 0.0827977 1.36261C0.0305231 1.24382 0.00241419 1.11558 0.000148353 0.985552C-0.00211748 0.855521 0.0215059 0.72636 0.0696093 0.605775C0.117713 0.485189 0.189311 0.37565 0.280132 0.28369C0.370953 0.19173 0.479136 0.119234 0.598229 0.070528C0.717321 0.0218219 0.844882 -0.00209907 0.973303 0.000195461C1.10172 0.00249 1.22837 0.0309514 1.34569 0.0838813C1.46301 0.136811 1.56861 0.213127 1.65617 0.308273L6.08125 4.78884L10.5063 0.308273C10.5939 0.213127 10.6995 0.136811 10.8168 0.0838809C10.9341 0.030951 11.0608 0.00248956 11.1892 0.000195014C11.3176 -0.00209953 11.4452 0.0218215 11.5643 0.0705275C11.6834 0.119234 11.7915 0.19173 11.8824 0.28369C11.9732 0.37565 12.0448 0.485189 12.0929 0.605774C12.141 0.72636 12.1646 0.855521 12.1624 0.985551C12.1601 1.11558 12.132 1.24382 12.0797 1.36261C12.0274 1.4814 11.9521 1.58832 11.8581 1.67698L7.43301 6.15755L11.8581 10.6381C12.027 10.8217 12.119 11.0645 12.1146 11.3154C12.1103 11.5663 12.0099 11.8057 11.8347 11.9831C11.6594 12.1605 11.423 12.2622 11.1752 12.2666C10.9274 12.271 10.6876 12.1779 10.5063 12.0068L6.08125 7.52625L1.65617 12.0068C1.47684 12.1882 1.23374 12.29 0.980288 12.29C0.726833 12.29 0.483742 12.1882 0.304411 12.0068Z" fill="black" fill-opacity="0.2"/>
                </svg>
              </button>
            </div>
                            
            <div className="flex justify-center items-center gap-[2rem]">
              {/* 카메라 */}
              <div className="flex flex-col justify-center items-center">
                <button
                  type="camera"
                  className="relative flex justify-center items-center bg-[#F2F4F8] w-[3rem] h-[3rem] rounded-full"
                  onClick={() => cameraInputRef.current.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="24" viewBox="0 0 27 24" fill="none">
                    <path d="M13.3333 9.33333C11.1653 9.33333 9.33333 11.1653 9.33333 13.3333C9.33333 15.5013 11.1653 17.3333 13.3333 17.3333C15.5013 17.3333 17.3333 15.5013 17.3333 13.3333C17.3333 11.1653 15.5013 9.33333 13.3333 9.33333Z" fill="#FF7053"/>
                    <path d="M24 4H20.552L16.9427 0.390667C16.6927 0.140601 16.3536 7.55165e-05 16 0H10.6667C10.3131 7.55165e-05 9.97399 0.140601 9.724 0.390667L6.11467 4H2.66667C1.196 4 0 5.196 0 6.66667V21.3333C0 22.804 1.196 24 2.66667 24H24C25.4707 24 26.6667 22.804 26.6667 21.3333V6.66667C26.6667 5.196 25.4707 4 24 4ZM13.3333 20C9.72 20 6.66667 16.9467 6.66667 13.3333C6.66667 9.72 9.72 6.66667 13.3333 6.66667C16.9467 6.66667 20 9.72 20 13.3333C20 16.9467 16.9467 20 13.3333 20Z" fill="#FF7053"/>
                  </svg>               
                </button>
                <span className="text-[#3B3D40] text-[0.75rem]">
                  카메라
                </span>
              </div>

              <div className="flex flex-col justify-center items-center">
                <button
                  type="album"
                  className="flex justify-center items-center bg-[#F2F4F8] w-[3rem] h-[3rem] rounded-full"
                  onClick={() => albumInputRef.current.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.952 1.952C0 3.90667 0 7.048 0 13.3333C0 19.6187 0 22.7613 1.952 24.7133C3.90667 26.6667 7.048 26.6667 13.3333 26.6667C19.6187 26.6667 22.7613 26.6667 24.7133 24.7133C26.6667 22.7627 26.6667 19.6187 26.6667 13.3333C26.6667 7.048 26.6667 3.90533 24.7133 1.952C22.7627 0 19.6187 0 13.3333 0C7.048 0 3.90533 0 1.952 1.952ZM18.6667 10.6667C19.3739 10.6667 20.0522 10.3857 20.5523 9.88562C21.0524 9.38552 21.3333 8.70724 21.3333 8C21.3333 7.29276 21.0524 6.61448 20.5523 6.11438C20.0522 5.61428 19.3739 5.33333 18.6667 5.33333C17.9594 5.33333 17.2811 5.61428 16.781 6.11438C16.281 6.61448 16 7.29276 16 8C16 8.70724 16.281 9.38552 16.781 9.88562C17.2811 10.3857 17.9594 10.6667 18.6667 10.6667ZM5.76 14.8053C6.15984 14.4337 6.69048 14.2353 7.23607 14.2535C7.78166 14.2718 8.29787 14.5051 8.672 14.9027L12.2027 18.6493C12.7174 19.196 13.4151 19.5342 14.1631 19.5996C14.911 19.665 15.6569 19.453 16.2587 19.004C16.6548 18.7093 17.1424 18.5641 17.6353 18.5941C18.1281 18.6242 18.5945 18.8274 18.952 19.168L21.976 22.056C22.1691 22.2308 22.4229 22.3234 22.6833 22.314C22.9436 22.3046 23.19 22.1939 23.37 22.0056C23.55 21.8172 23.6494 21.566 23.6471 21.3055C23.6447 21.045 23.5407 20.7957 23.3573 20.6107L20.3333 17.72C19.6339 17.0531 18.7211 16.6551 17.7565 16.5965C16.7919 16.5379 15.8376 16.8226 15.0627 17.4C14.854 17.5554 14.5955 17.6286 14.3364 17.6057C14.0772 17.5829 13.8355 17.4655 13.6573 17.276L10.128 13.5293C9.39177 12.7478 8.37637 12.2892 7.3033 12.2535C6.23022 12.2178 5.18657 12.6079 4.4 13.3387L3.32 14.3413C3.12551 14.5217 3.01062 14.7719 3.00062 15.037C2.99062 15.302 3.08632 15.5602 3.26667 15.7547C3.44701 15.9492 3.69724 16.064 3.96229 16.074C4.22734 16.084 4.48551 15.9883 4.68 15.808L5.76 14.8053Z" fill="#FF7053"/>
                  </svg>
                </button>
                <span className="text-[#3B3D40] text-[0.75rem]">
                  앨범
                </span>
              </div>

              <div className="flex flex-col justify-center items-center">
                <button
                  type="file"
                  className="flex justify-center items-center bg-[#F2F4F8] w-[3rem] h-[3rem] rounded-full"
                  onClick={() => fileInputRef.current?.click()} 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="27" viewBox="0 0 22 27" fill="none">
                    <path d="M10.6667 0V8.66667C10.6667 9.16384 10.8519 9.64319 11.1862 10.0112C11.5204 10.3793 11.9798 10.6096 12.4747 10.6573L12.6667 10.6667H21.3333V24C21.3335 24.6728 21.0795 25.3208 20.622 25.8141C20.1645 26.3074 19.5375 26.6095 18.8667 26.66L18.6667 26.6667H2.66667C1.9939 26.6669 1.34591 26.4128 0.852603 25.9553C0.359294 25.4979 0.0571246 24.8709 0.00666695 24.2L1.33691e-07 24V2.66667C-0.000212772 1.9939 0.253875 1.34591 0.711329 0.852603C1.16878 0.359294 1.79579 0.0571244 2.46667 0.00666682L2.66667 0H10.6667ZM13.3333 0.0573333C13.7645 0.148866 14.1663 0.345852 14.5027 0.630667L14.6667 0.781333L20.552 6.66667C20.8644 6.97882 21.0944 7.36367 21.2213 7.78667L21.2747 8H13.3333V0.0573333Z" fill="#FF7053"/>
                  </svg>
                </button>
                <span className="text-[#3B3D40] text-[0.75rem]">
                  파일
                </span>
              </div>

              <div className="flex flex-col justify-center items-center">
                <button
                  type="save"
                  className="flex justify-center items-center bg-[#F2F4F8] w-[3rem] h-[3rem] rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="29" viewBox="0 0 24 29" fill="none">
                    <path d="M5 27.6667V5H22.3333V27.6667L13.6667 23.4847L5 27.6667Z" fill="#FF7053"/>
                    <path d="M18.3333 5V1H1V23.6667L5 21.6667M5 27.6667V5H22.3333V27.6667L13.6667 23.4847L5 27.6667Z" stroke="#FF7053" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <span className="text-[#3B3D40] text-[0.75rem]">
                  저장
                </span>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="flex-1">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendText())}
          placeholder="메시지 전송"
          className="w-full pl-[1rem] border-none bg-[#FFFFFF] text-[15px] outline-none placeholder:text-[#B5BBC1] text-[#191D1F]"
        />
      </div>

      <button
        type="button"
        onClick={sendText}
        aria-label="전송"
        className="rounded-full bg-[#FFFFFF] text-white border-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5"
        >
          <path
            d="M4.4 19.425C4.06667 19.5583 3.75 19.529 3.45 19.337C3.15 19.145 3 18.866 3 18.5V14L11 12L3 10V5.50001C3 5.13335 3.15 4.85435 3.45 4.66301C3.75 4.47168 4.06667 4.44235 4.4 4.57501L19.8 11.075C20.2167 11.2583 20.425 11.5667 20.425 12C20.425 12.4333 20.2167 12.7417 19.8 12.925L4.4 19.425Z"
            fill="#B5BBC1"
          />
          <path
            d="M4.4 19.425C4.06667 19.5583 3.75 19.529 3.45 19.337C3.15 19.145 3 18.866 3 18.5V14L11 12L3 10V5.50001C3 5.13335 3.15 4.85435 3.45 4.66301C3.75 4.47168 4.06667 4.44235 4.4 4.57501L19.8 11.075C20.2167 11.2583 20.425 11.5667 20.425 12C20.425 12.4333 20.2167 12.7417 19.8 12.925L4.4 19.425Z"
            fill="black"
            fillOpacity="0.2"
          />
        </svg>
      </button>
    </div>

    {showPreview && (
      <div
        className="fixed inset-0 bg-black/20 z-50 flex flex-col items-center justify-center p-[1.5rem]"
        onClick={cancelPreview}  
      >
        <div
          className="bg-white rounded-lg p-4 max-w-[90%] max-h-[80%] overflow-auto"
          onClick={(e) => e.stopPropagation()}  
        >
          <div className={`grid ${previewImages.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-[1rem]`}>
            {previewImages.map((src, idx) => (
              <img key={idx} src={src} className="w-full rounded-[0.5rem] border-[0.1rem] border-[#DEE2E6]" alt="preview" />
            ))}
          </div>

          <div className="flex justify-between mt-[1.5rem]">
            <button 
              className="flex justify-center items-center h-[2.125rem] bg-[#CCD2D8] rounded-[0.5rem] pl-[0.75rem] pr-[0.75rem] pt-[0.125rem] pb-[0.125rem]"
              onClick={cancelPreview}
            >
              <span className="text-white text-[0.75rem]">
                취소
              </span>
            </button>

            <button 
              className="flex justify-center items-center h-[2.125rem] bg-[#FA502E] rounded-[0.5rem] pl-[0.75rem] pr-[0.75rem] pt-[0.125rem] pb-[0.125rem]"
              onClick={sendImages}
            >
              <span className="text-white text-[0.75rem]">
                전송
              </span>
            </button>
          </div>
        </div>
      </div>
    )}

    
    </>
  );
}
