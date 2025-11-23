import axiosInstance from "./axiosInstance";

/* 받은 친구 요청 목록 (대기중) */
export async function getIncomingFriendRequests() {
  const res = await axiosInstance.get("/api/v1/friend-requests/incoming");
  return res.data;
}

/* 친구 요청 수락 */
export async function acceptFriendRequest(requestId) {
  const res = await axiosInstance.post(
    `/api/v1/friend-requests/${requestId}/accept`
  );
  return res.data;
}

/* 친구 요청 거절 */
export async function rejectFriendRequest(requestId) {
  const res = await axiosInstance.post(
    `/api/v1/friend-requests/${requestId}/reject`
  );
  return res.data;
}

/* 팔로워 / 팔로잉 카운트 */
export async function getFriendCounts(userId) {
  const res = await axiosInstance.get(`/api/v1/friends/${userId}/counts`);
  return res.data;
}
