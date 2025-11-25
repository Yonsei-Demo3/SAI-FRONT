import axiosInstance from "./axiosInstance";

export async function getLikeStatus(questionId) {
  const res = await axiosInstance.get(`/api/v1/questions/${questionId}/like`);
  return res.data;
}

export async function likeQuestion(questionId) {
  const res = await axiosInstance.post(`/api/v1/questions/${questionId}/like`);
  return res.data; 
}

export async function unlikeQuestion(questionId) {
  const res = await axiosInstance.delete(`/api/v1/questions/${questionId}/like`);
  return res.data;
}

export async function getMyLikedQuestions() {
  const res = await axiosInstance.get("/api/v1/questions/likes/me");
  return res.data;
}