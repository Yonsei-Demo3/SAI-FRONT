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