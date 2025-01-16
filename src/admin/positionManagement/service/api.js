import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:5005/api/v1";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
})

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
)

export const apiService = {
    getAllPosition: async () => {
        try {
            const response = await api.get("candidate-positions");
            return response.data;
        } catch (error) {
            console.error("Error getting position:", error);
            throw error;
        }
    },

    createPosition: async (positionData) => {
        try {
            const response = await api.post("candidate-positions", positionData);
            return response.data;
        } catch (error) {
            console.error("Error creating position:", error);
            throw error;
        }
    },

    getPositionById: async (id) => {
        try {
            const response = await api.get(`candidate-positions/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting position:", error);
            throw error;
        }
    },

    updatePosition: async (id, updatePositionData) => {
        try {
            const response = await api.put(`candidate-positions/${id}`, updatePositionData);
            return response.data;
        } catch (error) {
            console.error("Error updating position:", error);
            throw error;
        }
    },

    deletePosition: async (id) => {
        try {
            const response = await api.delete(`candidate-positions/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting position:", error);
            throw error;
        }
    },
}