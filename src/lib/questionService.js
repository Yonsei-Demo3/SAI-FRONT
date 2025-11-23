import axiosInstance from "./axiosInstance";

export async function searchQuestions({ keyword, tags=[], page = 0, size = 10, sortType = "인기순" }) {
  const sortMap = {
    인기순: "popularity",
    최신순: "createdAt,DESC",
    가나다순: "title,ASC",
  };

  const body = {
      keyword,                    
      categories: tags.map((tag) => ({
        main: tag,                
        sub: tag,
      })),
      tags: tags, 
    };

  const token = localStorage.getItem("accessToken");

  const config = token
    ? { headers: { Authorization: token } }
    : {};

  const res = await axiosInstance.post("/api/v1/questions/search", body, config);
  return res.data;
}

export async function getQuestionDetail(questionId) {
  const res = await axiosInstance.get(`/api/v1/questions/${questionId}`);
  return res.data;
}