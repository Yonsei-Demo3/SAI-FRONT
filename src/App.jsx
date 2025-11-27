import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import ContentSearchResultPage from "./pages/content/ContentSearchResultPage";
import ContentSearchPage from "./pages/content/ContentSearchPage";
import ContentRegisterPage from "./pages/content/ContentRegisterPage"
import ChatListPage from "./pages/chat/ChatListPage";
import ChatPage from "./pages/chat/ChatPage";
import LoginScreen from "./pages/login/LoginScreen";
import SignupScreen from "./pages/login/SignupScreen";
import MainScreen from "./pages/main/MainScreen";
import MainNewQues from "./pages/main/MainNewQues";
import MainPopQues from "./pages/main/MainPopQues";
import SearchScreen from "./pages/search/SearchScreen";
import SearchResult from "./pages/search/SearchResult";
import CategorySearchScreen from "./pages/search/CategorySearchScreen";
import Notification from "./components/Notification";
import { NotificationProvider } from "./components/NotificationContext";
import QuestionPostScreen from "./pages/question/QuestionPostScreen";
import MyPageQues from "./pages/mypage/MyPageQues";
import MyPageliked from "./pages/mypage/MyPageliked";
import MyPageScrap from "./pages/mypage/MyPageScrap";
import ConversationDetailScreen from "./pages/mypage/ConversationDetailScreen";
import DetailScreen from "./pages/search/DetailScreen";
import FriendsScreen from "./pages/setting/FriendScreen";
import SettingScreen from "./pages/setting/SettingScreen";
import ProfileEditScreen from "./pages/mypage/ProfileEditScreen";
import ChatStartPopup from "./components/ChatStartPopup";
import FriendProfileScreen from "./pages/friend/FriendProfileScreen";
import FriendRequestScreen from "./pages/friend/FriendRequestScreen";
import AuthContext from "./context/AuthContext";

export default function App() {
  
  const height = window.innerHeight;
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  return (
    <>
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
    <NotificationProvider> {/* ✅ 전역 알림 상태 감싸기 */}
      <div className="flex justify-center items-center bg-white">
        <div className="min-w-[350px] max-w-[500px] w-full h-[100vh] bg-white shadow-md border border-gray-200">
          <Router>
           {isLoggedIn && <ChatStartPopup />}  
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
              <Route path="/mypage/ques" element={<MyPageQues />} />
              <Route path="/mypage/liked" element={<MyPageliked />} />
              <Route path="/mypage/scrap" element={<MyPageScrap />} />
              <Route path="/mypage/profile/edit" element={<ProfileEditScreen />} />
              <Route path="/mypage/chat/:id" element={<ConversationDetailScreen />} />
              <Route path="/settings" element={<SettingScreen />} />
              <Route path="/settings/friends" element={<FriendsScreen />} />
              <Route path="/friend/profile/:memberId" element={<FriendProfileScreen />} />
              <Route path="/friend/add" element={<FriendRequestScreen />} />
            </Routes>
          </Router>
        </div>
      </div>
    </NotificationProvider>
    </AuthContext.Provider>
    </>
  );
}