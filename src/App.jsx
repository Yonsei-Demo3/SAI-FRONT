import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";

export default function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-[23.44rem] h-[45.88rem] bg-white shadow-md overflow-hidden border border-gray-200">
        <Router>
          <Routes>
            {/* 기본 경로로 들어오면 /login으로 자동 이동 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
