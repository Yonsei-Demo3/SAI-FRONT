import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import MainScreen from "./components/MainScreen";

export default function App() {
  return (
      <div className="flex justify-center items-center bg-white">
        <div className="min-w-[350px] max-w-[500px] w-full h-[100vh] bg-white shadow-md overflow-hidden border border-gray-200">
        <Router>
          <Routes>
            {/* 기본 경로로 들어오면 /login으로 자동 이동 */}
            <Route path="/" element={<Navigate to="/login" replace />} /> 
            <Route path="/login" element={<LoginScreen />} /> 
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/main" element={<MainScreen />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
