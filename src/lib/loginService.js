import axiosInstance from "./axiosInstance";

export async function login(payload) {

    const body = {
        email: payload.user_id,
        password: payload.password,
    }

    return axiosInstance.post("/api/v1/auth/login", body);  

}



