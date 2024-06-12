import axios from "axios";
import Cookies from "universal-cookie";

let cookies = new Cookies(null, { path: "/" });

const handler = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

handler.interceptors.request.use(
  function (config) {
    let auth_token = cookies.get("token");
    if (auth_token) config.headers.Authorization = ` Token ${auth_token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

handler.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.message,
        data: error.response.data,
        status: error.response.status,
      });
    } else if (error.request) {
      return Promise.reject({
        message: "No response received",
      });
    } else {
      return Promise.reject({
        message: "Network Error",
      });
    }
  },
);

export default handler;
