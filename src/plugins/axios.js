import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL_ADMIN,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (config.method === "get") {
    const language = localStorage.getItem("pref_lang") || "en";
    config.params = { ...config.params, lang: language };
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  install(app) {
    app.config.globalProperties.$axios = instance;
  },
};
