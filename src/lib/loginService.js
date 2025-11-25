import axiosInstance from "./axiosInstance";

export async function login(payload) {

    const body = {
        email: payload.user_id,
        password: payload.password,
    }

    return axiosInstance.post("/api/v1/auth/login", body);  
}

export async function kakaoLogin(code, redirectUri) {
    return axiosInstance.post("/api/v1/auth/oauth/kakao/login-by-code", {
        code: code,
        redirectUri: redirectUri
    });
}

export async function logout() {
  const res = await axiosInstance.post("/api/v1/auth/logout");
  return res.data;
}