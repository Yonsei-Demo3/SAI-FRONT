import axiosInstance from "./axiosInstance";

export const createQuestion = async (payload) => {

  const body = {
    
    title: payload.question,
    description: payload.description,
    maxParticipants: payload.participants,
    startMode: payload.startMode,
    contentId: payload.contentId,
    tags: payload.tags
  };
  
  return axiosInstance.post("api/v1/questions", body);
};

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

  // 🔥 여기 있던 finalCategories / 태그→카테고리 매핑 로직 싹 제거

  const body = {
    keyword,
    categories,  // 프론트에서 직접 넘길 때만 사용
    tags,        // 서브카테고리 필터는 이걸로
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
    `/api/v1/questions/participate/${questionId}`,
    null,
    getAuthConfig()
  );
  return res.data;
}

export async function cancelParticipateQuestion(questionId) {
  const res = await axiosInstance.delete(`/api/v1/questions/cancel/${questionId}`,
  getAuthConfig()
  );
  return res.data;
}

export async function getMyChats() {
  const res = await axiosInstance.get("/api/v1/questions", getAuthConfig());
  return res.data;
}

export async function getMyQuestions() {
  const res = await axiosInstance.get(
    "/api/v1/questions/my",
    getAuthConfig()
  );
  return res.data;
}