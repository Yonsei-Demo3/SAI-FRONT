import React, { createContext, useContext, useState } from "react";

// ✅ Context 생성
const NotificationContext = createContext();

// ✅ Provider
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "멋쟁이사자님의 새 질문",
      message: "친구가 새로운 질문을 올렸어요. 함께 이야기해볼까요?",
      time: "10분 전",
      isNew: true,
    },
    {
      id: 2,
      title: "누군가 내 질문에 공감했어요",
      message: "내 질문이 누군가에게 닿았어요. 이번엔 새로운 질문을 던져보세요.",
      time: "1시간 전",
      isNew: false,
    },
  ]);

  // ✅ 읽지 않은 알림 개수 계산
  const unreadCount = notifications.filter((n) => n.isNew).length;

  // ✅ 모두 읽음 처리 함수
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// ✅ 어디서든 쉽게 쓸 수 있게 훅 export
export function useNotification() {
  return useContext(NotificationContext);
}
