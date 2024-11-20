import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:5005/api/v1/users",
  withCredentials: true,
});

export default userApi;
