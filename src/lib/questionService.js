import axios from "./axiosInstance";

export const createQuestion = async (payload) => {

  const body = {
    
    title: payload.question,
    description: payload.description,
    maxParticipants: payload.participants,
    contentId: 1,
    tags: payload.tags
    // startOption: payload.startOption
  };
  
  console.log("Request Body:", body); 

  return axios.post("api/v1/questions", body);
};
