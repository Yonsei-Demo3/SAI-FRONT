import axiosInstance from "./axiosInstance";

export async function getMyInfo() {
  const res = await axiosInstance.get("/api/v1/members/me");
  return res.data;
}

export async function updateMyNickname(nickname) {
  const body = { nickname };

  const res = await axiosInstance.patch(
    "/api/v1/members/me/nickname",
    body
  );

  return res.data;
}