import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ContentSearchResultPage from "./pages/contentSearchResultPage";
import ContentSearchPage from "./pages/contentSearchPage";
import ContentRegisterPage from "./pages/contentRegisterPage"
import ChatPage from "./pages/ChatPage";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import MainScreen from "./pages/MainScreen";
import SearchScreen from "./pages/search/SearchScreen";
import SearchResult from "./pages/search/SearchResult";
import CategorySearchScreen from "./pages/search/CategorySearchScreen";
import Notification from "./components/Notification";
import { NotificationProvider } from "./components/NotificationContext";
import QuestionPostScreen from "./pages/QuestionPostScreen";

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
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/category-search" element={<CategorySearchScreen/>}/>
              <Route path="/search-result" element={<SearchResult />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/content/search" element={<ContentSearchPage />} />
              <Route path="/content/search/result" element={<ContentSearchResultPage />} />
              <Route path="/content/register" element={<ContentRegisterPage />} />
              <Route path="/question" element={<QuestionPostScreen />} />
          
            </Routes>
          </Router>
        </div>
      </div>
    </NotificationProvider>
  );
}