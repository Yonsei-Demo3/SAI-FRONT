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

export async function deleteAccount() {
  const res = await axiosInstance.delete(`/api/v1/members/me`);
  return res.data;
}

export async function getMembers({ page = 0, size = 100 } = {}) {
  const res = await axiosInstance.get("/api/v1/members", {
    params: { page, size }, // 스웨거가 pageable-object로 보여도 실제론 보통 이렇게 사용
  });
  return res.data; // { content: [...], ... }
}

// 닉네임으로 userId 찾기
export async function findMemberByNickname(nickname) {
  // 일단 0페이지 100명 정도만 불러서 프론트에서 필터
  const data = await getMembers({ page: 0, size: 1000 });
  const list = data.content || [];

  const found = list.find((m) => m.nickname === nickname);

  return found || null; // {userId, email, nickname, role} 또는 null
}