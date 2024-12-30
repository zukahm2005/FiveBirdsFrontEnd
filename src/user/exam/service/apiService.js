import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://http://46.202.178.139:5050/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  getAllQuestions: async (pageNumber = 1) => {
    try {
      const response = await api.get(`/questions/get/all/${pageNumber}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  getQuestionById: async (id) => {
    try {
      const response = await api.get(`/questions/get/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching question by ID:", error);
      throw error;
    }
  },

  addAnswer: async (answerData) => {
    try {
      const response = await api.post(`/answers/add`, answerData);
      return response.data;
    } catch (error) {
      console.error("Error adding answer:", error);
      throw error;
    }
  },

  updateAnswer: async (id, answerData) => {
    try {
      const response = await api.put(`/answers/update/${id}`, answerData);
      return response.data;
    } catch (error) {
      console.error("Error updating answer:", error);
      throw error;
    }
  },

  getAllExams: async (pageNumber = 1) => {
    try {
      const response = await api.get(`/exams/get/all/${pageNumber}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching exams:", error);
      throw error;
    }
  },

  getExamById: async (id) => {
    try {
      const response = await api.get(`/exams/get/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching exam by ID:", error);
      throw error;
    }
  }
};
