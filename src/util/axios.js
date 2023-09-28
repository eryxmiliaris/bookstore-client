import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

const instance = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  validateStatus: function (status) {
    return status >= 200 && status <= 302;
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
