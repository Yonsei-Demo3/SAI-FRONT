import axiosInstance from "./axiosInstance";

export async function getMyInfo() {
  const res = await axiosInstance.get("/api/v1/members/me");
  return res.data;
}