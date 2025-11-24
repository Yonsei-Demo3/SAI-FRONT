import axiosInstance from "./axiosInstance";

function getAuthConfig() {
  const token = localStorage.getItem("accessToken");
  return token ? { headers: { Authorization: token } } : {};
}

export async function searchQuestions({
  keyword = "",
  categories = [],
  tags = [],
  page = 0,
  size = 10,
  sortType = "인기순",
} = {}) {
  const sortMap = {
    인기순: "popularity",
    최신순: "createdAt,DESC",
    가나다순: "title,ASC",
  };

  let finalCategories = categories;
  if (finalCategories.length === 0 && tags.length > 0 && typeof tags[0] === "string") {
    finalCategories = tags.map((tag) => ({
      main: tag,
      sub: tag,
    }));
  }

  const body = {
    keyword,
    categories: finalCategories,
    tags,
  };

  const config = {
    ...getAuthConfig(),
    params: {
      page,
      size,
      sort: sortMap[sortType],
    },
  };

  const res = await axiosInstance.post("/api/v1/questions/search", body, config);
  return res.data;
}

export async function getQuestionDetail(questionId) {
  const res = await axiosInstance.get(
    `/api/v1/questions/${questionId}`,
    getAuthConfig()
  );
  return res.data;
}

export async function participateQuestion(questionId) {
  const res = await axiosInstance.post(
    `/api/v1/questions/${questionId}`,
    null,
    getAuthConfig()
  );
  return res.data;
}
