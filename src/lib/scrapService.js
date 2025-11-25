import axiosInstance from "./axiosInstance";

// 내가 참여한 방에서 메시지 스크랩
export async function scrapMessage(messageId) {
  const res = await axiosInstance.post(
    `/api/v1/messages/${messageId}/scrap`,
    null,
  );
  return res.data;
}

// 참여하지 않은 방에서 스크랩
export async function scrapMessageExternal(messageId) {
  const res = await axiosInstance.post(
    `/api/v1/messages/${messageId}/scrap/external`,
    null,
  );
  return res.data;
}

// 스크랩 취소
export async function cancelScrap(messageId) {
  const res = await axiosInstance.delete(
    `/api/v1/messages/${messageId}/scrap`,
  );
  return res.data;
}

// 내 스크랩 목록 조회
export async function getMyScraps() {
  const res = await axiosInstance.get(
    "/api/v1/messages/scrap/me",
  );
  return res.data;
}

// 특정 유저의 스크랩 목록 조회
export async function getUserScraps(userId) {
  const res = await axiosInstance.get(
    `/api/v1/messages/scrap/${userId}`,
  );
  return res.data;
}

export async function getPopularScraps(size = 5) {
  const res = await axiosInstance.get("/api/v1/messages/scrap/popular", {
    params: { size },
  });
  return res.data; 
}