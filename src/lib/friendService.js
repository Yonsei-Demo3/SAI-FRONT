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

/* 친구 요청 보내기 */
export async function sendFriendRequest(targetMemberId, message) {
  const body = { targetMemberId, message };
  const res = await axiosInstance.post("/api/v1/friend-requests", body);
  return res.data;
}

/* 내 친구 목록 조회 */
export async function getFriendList() {
  const res = await axiosInstance.get(`/api/v1/friends/me`);
  return res.data;
}

/* 사용자 차단 */
export async function blockFriends(targetMemberId) {
  const res = await axiosInstance.post(
    `/api/v1/blocks/${targetMemberId}`
  );
  return res.data;
}

/* 차단 해제 */
export async function unblockFriends(targetMemberId) {
  const res = await axiosInstance.delete(`/api/v1/blocks/${targetMemberId}`);
  return res.data;
}

/* 내 차단 목록 조회 */
export async function getBlocksList() {
  const res = await axiosInstance.get(`/api/v1/blocks`);
  return res.data;
}

export async function getOutgoingFriendRequests() {
  const res = await axiosInstance.get("/api/v1/friend-requests/outgoing");
  return res.data; // [{ requestId, fromMemberId, toMemberId, message, status }, ...]
}