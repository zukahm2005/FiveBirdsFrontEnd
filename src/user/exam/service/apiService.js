import axios from "axios";
import Cookies from "js-cookie";

// const BASE_URL = "http://localhost:5005/api/v1";
const BASE_URL = "http://46.202.178.139:5050/api/v1";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
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
    checkRole: async () => {
        try {
            const response = await api.get("/users/checkrole");
            return response.data;
        } catch (error) {
            console.error("Error checking role:", error);
            throw error;
        }
    },
    getUserExams: async (userId) => {
        try {
            const response = await api.get(`/user-exam/get/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user exams:", error);
            throw error;
        }
    },
    getExamDetails: async (examId) => {
        try {
            const response = await api.get(`/exams/get/${examId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching exam details:", error);
            throw error;
        }
    },
    submitAnswer: async (answerData) => {
        try {
            const response = await api.post("/results/add", answerData);
            return response.data;
        } catch (error) {
            console.error("Error submitting answer:", error);
            throw error;
        }
    },
    updateAnswer: async (id, updatedAnswerData) => {
        try {
            const response = await api.put(`/results/update/${id}`, updatedAnswerData);
            return response.data;
        } catch (error) {
            console.error("Error updating answer:", error);
            throw error;
        }
    },

    addTest: async (testData) => {
        try {
            const response = await api.post("/candidate/test/add", testData);
            return response.data;
        } catch (error) {
            console.error("Error adding test:", error.response?.data || error.message);
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post("/users/logout");
            return response.data;
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    },
};
