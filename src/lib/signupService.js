import axiosInstance from "./axiosInstance";

export async function signup(payload) {

    const body = {
        email: payload.email,
        password: payload.password,
        nickname: payload.nickname,
        phone: payload.phone,
    }

    return axiosInstance.post("/api/v1/members", body);  

}



