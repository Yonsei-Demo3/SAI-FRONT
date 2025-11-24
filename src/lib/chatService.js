import axiosInstance from "./axiosInstance";

export async function getChatList(sort) {
  return axiosInstance.get("/api/v1/questions", {
    params: { 
      "sort": sort },
  });  
}

export async function readyChat(questionId) {
  return axiosInstance.post(`/api/v1/questions/ready/${questionId}`);  
}

export async function quitChat(questionId) {
  return axiosInstance.delete(`/api/v1/questions/cancel/${questionId}`);  
}