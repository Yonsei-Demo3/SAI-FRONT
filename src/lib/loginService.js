import axiosInstance from "./axiosInstance";

export async function login(payload) {

    const body = {
        email: payload.user_id, // 아이디를 이메일로 보내는 형태로 수정
        password: payload.password,
    }

    return axiosInstance.post("/api/v1/auth/login", body);  

}



