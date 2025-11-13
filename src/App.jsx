import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ContentSearchResultPage from "./pages/contentSearchResultPage";
import ContentSearchPage from "./pages/contentSearchPage";
import ContentRegisterPage from "./pages/contentRegisterPage"
import ChatPage from "./pages/ChatPage";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import MainScreen from "./components/MainScreen";
import SearchScreen from "./components/SearchScreen";
import SearchResult from "./components/SearchResult";
import CategorySearchScreen from "./components/CategorySearchScreen";

export default function App() {
  
  const height = window.innerHeight;

  return (
      <div className="flex justify-center items-center bg-white">
        <div className="min-w-[350px] max-w-[500px] w-full h-[100vh] bg-white shadow-md overflow-hidden border border-gray-200">
        <Router>
          <Routes>
            {/* 기본 경로로 들어오면 /login으로 자동 이동 */}
            <Route path="/" element={<Navigate to="/main" replace />} /> 
            <Route path="/login" element={<LoginScreen />} /> 
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/main" element={<MainScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/category-search" element={<CategorySearchScreen/>}/>
            <Route path="/search-result" element={<SearchResult />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/content/search" element={<ContentSearchPage />} />
            <Route path="/content/search/result" element={<ContentSearchResultPage />} />
            <Route path="/content/register" element={<ContentRegisterPage />} />
          </Routes>
        </Router>
     </div>
    </div>
  );
}
