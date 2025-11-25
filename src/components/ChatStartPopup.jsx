import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestionDetail } from "../lib/questionService";
import { readyChat, quitChat } from "../lib/chatService";
import { subscribeToAlarm } from "../lib/socket";

export default function ChatStartPopup() {

    const [visible, setVisible] = useState(false); 
    const navigate = useNavigate();

    const [isReady, setIsReady] = useState(false);    
    const [timerActive, setTimerActive] = useState(false); 
    const [secondsLeft, setSecondsLeft] = useState(30); // 소켓 알림 오면 30초 초기화 필요
    
    const [showFloating, setShowFloating] = useState(false);
    const [floatingPos, setFloatingPos] = useState(() => {
        const PADDING = 0;          // 화면 오른쪽에서 띄울 여백(px)
        const BOX_WIDTH = 45;        
        const TOP_OFFSET = 120;       

        return {
            x: window.innerWidth - PADDING - BOX_WIDTH, 
            y: TOP_OFFSET,                             
        };
        });

    const dragStateRef = useRef({
        dragging: false,
        offsetX: 0,
        offsetY: 0,
    });
    
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionId, setQuestionId] = useState(null); 
    const [roomId, setRoomId] = useState(null);

    // 소켓 알림 구독
    useEffect(() => {

        const unsubscribe = subscribeToAlarm((payload) => {
            
            if (payload?.type !== "QUESTION_FULL") return;

            const questionId = payload.data?.questionId;
            const roomId = payload.data?.roomId;
            if (!questionId || !roomId) return;

            setQuestionId(questionId);
            setRoomId(roomId);

            // 30초 타이머 초기화 및 시작
            setSecondsLeft(30);
            setIsReady(false);
            setTimerActive(true);
            setVisible(true);
            setShowFloating(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {

        if (!questionId) return;

        async function fetchQuestionDetail() {
        try {
                const data = await getQuestionDetail(questionId);
                const title = data.questionTitle ||  "";
                setQuestionTitle(title);

            } catch (error) {
                console.error("Error fetching question detail:", error);
            }
        }

        fetchQuestionDetail();
    }, [questionId]);

    

    useEffect(() => {

        if (!timerActive) return;
        
        if (secondsLeft <= 0) {
            if (isReady) {
                navigate("/chat", {
                state: {
                    questionId,
                    roomId,
                    questionTitle,
                    status: "active",
                },
                });
            } else {
                handleReadyCancelClick(questionId, { auto: true });
            }

            setTimerActive(false);
            setVisible(false);

            return; 
        }
        const timerId = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timerId);
    }, [secondsLeft, timerActive, isReady, navigate, questionId, roomId, questionTitle]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    const displayTime = `${minutes}:${seconds}`;

    const handleReadyClick = async (questionId) => {
        try {
            
            await readyChat(questionId);   
            setIsReady(true);
            setVisible(false);
            setShowFloating(true);

        } catch (error) {
            console.error("대화 준비 실패:", error);
        }
    };

    
    const handleReadyCancelClick = async (questionId) => {
        try {
            
            await quitChat(questionId);
            
        } catch (error) {
            console.error("대화 취소 실패:", error);
            if (error.response?.status === 500) {
                const message =
                error.response?.data?.message ||
                "자신이 개설한 질문방은 제거할 수 없습니다";
                alert(message);
                return;
            }
        } finally {
            setVisible(false);
            setTimerActive(false); 
            setShowFloating(false);
        }
    };

    const startDrag = (clientX, clientY) => {
        dragStateRef.current.dragging = true;
        dragStateRef.current.offsetX = clientX - floatingPos.x;
        dragStateRef.current.offsetY = clientY - floatingPos.y;
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    };

    const handleTouchStart = (e) => {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
    };

    useEffect(() => {
        const handleMove = (e) => {
        if (!dragStateRef.current.dragging) return;

        let clientX;
        let clientY;

        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        setFloatingPos({
            x: clientX - dragStateRef.current.offsetX,
            y: clientY - dragStateRef.current.offsetY,
        });
        };

        const stopDrag = () => {
        dragStateRef.current.dragging = false;
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", stopDrag);
        window.addEventListener("touchmove", handleMove);
        window.addEventListener("touchend", stopDrag);

        return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", stopDrag);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", stopDrag);
        };
    }, []);

    if (!visible && !showFloating) return null;


  return (
    <>
        {visible && (
            <div
                className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 
                            w-full max-w-[500px]
                            px-4 z-[200]
                            animate-slide-down"
                >
                

                <div className="bg-white rounded-2xl pl-[1.75rem] pr-[1.75rem] pt-[1.25rem] pb-[1.25rem] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#F2F2F2] gap-3">
                    

                    <div className="flex flex-col">  

                        <div className="flex items-start justify-center items-center gap-3 pb-[0.25rem]">
                            
                            <div className="flex items-start justify-center items-center">
                                {/* 아이콘 */}
                                <img
                                    src="/icons/popup-check.svg"
                                    className="w-[1.2rem] h-[1.2rem] mt-[0.2rem]"
                                    alt=""
                                />
                            </div>

                            {/* 텍스트 영역 */}
                            <div className="flex flex-col flex-1">
                                {/* 알림 제목 */}
                                <p className="text-[0.875rem] font-bold text-[#3B3D40] leading-[1.4rem]">
                                    모든 인원이 모였어요
                                </p>
                            </div>

                        </div>

                        {/* 알림 내용 */}
                        <p className="text-[0.875rem] font-bold text-[#3B3D40] leading-[1.4rem]">
                            "{questionTitle}"
                        </p>

                        {/* 시간 */}
                        <p>
                            <span className="mt-[0.25rem] text-[0.75rem] text-[#3B3D40]">대화가 곧 시작됩니다. </span>
                            <span className="mt-[0.25rem] text-[0.75rem] text-[#FA502E]">30초 안에 '준비 완료'를 눌러주세요.</span>
                        </p>
                    </div>

                    <div className="flex w-full items-center justify-center mt-[0.825rem] gap-[0.5rem]">
                        <div className="flex flex-none items-center text-[0.75rem] text-[#3B3D40] font-semibold mr-[0.5rem]">
                            남은 시간&nbsp;
                            <span>{displayTime}</span>
                        </div>
                        <button
                            onClick={() => handleReadyCancelClick(questionId)}
                            className="flex-none bg-[#B5BBC1] text-white text-[0.875rem] font-semibold 
                                    px-[1rem] py-[0.5rem] rounded-lg"
                        >
                            <span className="text-[0.75rem] text-center">
                                참여 취소
                            </span>
                        </button>
                        <button
                            onClick={() => handleReadyClick(questionId)}
                            className="flex-1 bg-[#FA502E] text-white text-[0.875rem] font-semibold 
                                    px-[1rem] py-[0.5rem] rounded-lg"
                        >
                            <span className="text-[0.75rem] text-center">
                                준비 완료
                            </span>
                        </button>
                    </div>  
                </div>
            </div>

        )}

        {showFloating && timerActive &&(
            <div
                className="fixed z-[210] cursor-move select-none"
                style={{
                    top: floatingPos.y,
                    left: floatingPos.x,
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                >
                <div className="w-[2.8125rem] h-[2.8125rem] bg-[#FF7053] rounded-[0.5rem] pl-[0.625rem] pr-[0.625rem] pt-[1rem] pb-[1rem] shadow-[0_4px_15px_rgba(0,0,0,0.25)] flex items-center gap-1">
                    <span className="text-[0.75rem] text-white  font-semibold">{displayTime}</span>
                </div>
            </div>        
        )}
    </>
  );
}
