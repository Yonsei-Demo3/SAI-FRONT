import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ContentSearchResultPage from "./pages/contentSearchResultPage";
import ContentSearchPage from "./pages/contentSearchPage";
import ContentRegisterPage from "./pages/contentRegisterPage"
import ChatListPage from "./pages/ChatListPage";
import ChatPage from "./pages/ChatPage";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import MainScreen from "./pages/main/MainScreen";
import MainNewQues from "./pages/main/MainNewQues";
import MainPopQues from "./pages/main/MainPopQues";
import SearchScreen from "./pages/search/SearchScreen";
import SearchResult from "./pages/search/SearchResult";
import CategorySearchScreen from "./pages/search/CategorySearchScreen";
import Notification from "./components/Notification";
import { NotificationProvider } from "./components/NotificationContext";
import QuestionPostScreen from "./pages/QuestionPostScreen";
import MyPageScreen from "./pages/mypage/MyPageScreen";
import MyPageChats from "./pages/mypage/MyPageChats";
import MyPageScrap from "./pages/mypage/MyPageScrap";
import ConversationDetailScreen from "./pages/mypage/ConversationDetailScreen";
import DetailScreen from "./pages/search/DetailScreen";

export default function App() {
  
  const height = window.innerHeight;

  return (
    <NotificationProvider> {/* ✅ 전역 알림 상태 감싸기 */}
      <div className="flex justify-center items-center bg-white">
        <div className="min-w-[350px] max-w-[500px] w-full h-[100vh] bg-white shadow-md border border-gray-200">
          <Router>
            <Routes>
              {/* 기본 경로로 들어오면 /login으로 자동 이동 */}
              <Route path="/" element={<Navigate to="/login" replace />} /> 
              <Route path="/login" element={<LoginScreen />} /> 
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/main" element={<MainScreen />} />
              <Route path="/main/new" element={<MainNewQues />} />
              <Route path="/main/pop" element={<MainPopQues />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/category-search" element={<CategorySearchScreen/>}/>
              <Route path="/search-result" element={<SearchResult />} />
              <Route path="/detail" element={<DetailScreen />} />              
              <Route path="/notification" element={<Notification />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat-list" element={<ChatListPage />} />
              <Route path="/content/search" element={<ContentSearchPage />} />
              <Route path="/content/search/result" element={<ContentSearchResultPage />} />
              <Route path="/content/register" element={<ContentRegisterPage />} />
              <Route path="/question" element={<QuestionPostScreen />} />
              <Route path="/mypage" element={<MyPageScreen />} />
              <Route path="/mypage/chats" element={<MyPageChats />} />
              <Route path="/mypage/scrap" element={<MyPageScrap />} />
              <Route path="mypage/chat/:id" element={<ConversationDetailScreen />} />
            </Routes>
          </Router>
        </div>
      </div>
    </NotificationProvider>

  );
}