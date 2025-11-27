import axiosInstance from "./axiosInstance";

export async function createContent(payload) {
  
  const body = {
    name: payload.contentsName,
    creator: payload.creator,
    description: payload.contentDesc,
    imageUrl: payload.imagePreview,
    link: payload.contentURL,
    mainCategory: payload.major,
    subCategory: payload.minor
  };

  console.log("createContent body:", body);

  return axiosInstance.post("/api/v1/contents", body);  
}


export async function fetchContentList({ keyword, page = 0, size = 10, sort }) {
  const params = {
    keyword,
    // pageable.page / pageable.size / pageable.sort 형식으로 전송
    "pageable.page": page,   // ✅ 첫 페이지: 0 (백엔드가 0부터 시작한다고 가정)
    "pageable.size": size,
    "pageable.sort": sort
  };

  const response = await axiosInstance.get("/api/v1/contents/search", { params });
  return response.data;
}

export async function fetchAllContentList() {
  const response = await axiosInstance.get("/api/v1/contents/all");
  return response.data;
}