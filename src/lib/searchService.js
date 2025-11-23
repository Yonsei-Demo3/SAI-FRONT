import axiosInstance from "./axiosInstance";

export async function popular(size) {
  const res = await axiosInstance.get("/api/v1/search/popular/trending", {
    params: size ? { size } : undefined,
  });

  return res.data;
}

export async function recentSearch() {
  const res = await axiosInstance.get("/api/v1/search/recent");
  return res.data;
}

export async function deleteRecentSearch(keyword) {
  return axiosInstance.delete("/api/v1/search/recent", {
    params: { keyword },
  });
}

export async function clearAllRecentSearch() {
  return axiosInstance.delete("/api/v1/search/recent/all");
}
