import axiosInstance from "./axiosInstance";

export async function getChatList() {
  return axiosInstance.get("/api/v1/questions");  
}