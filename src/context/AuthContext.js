// src/context/AuthContext.js
import React, { createContext } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export default AuthContext;
