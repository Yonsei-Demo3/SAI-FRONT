import axios from "./axiosInstance";

export const createQuestion = async (payload) => {
  return axios.post("/questions", payload);
};
