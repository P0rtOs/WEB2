import axios from "axios";

// URL для эндпоинтов аутентификации и событий
const API_AUTH_URL = "http://127.0.0.1:8000/api/auth";
const API_EVENTS_URL = "http://127.0.0.1:8000/api/events";

// Инстанс для auth-эндпоинтов
const apiAuth = axios.create({
  baseURL: API_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Инстанс для событий
const apiEvents = axios.create({
  baseURL: API_EVENTS_URL,
});

// Функция установки заголовка авторизации для обоих инстансов
export const setAuthToken = (token) => {
  if (token) {
    apiAuth.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    apiEvents.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiAuth.defaults.headers.common["Authorization"];
    delete apiEvents.defaults.headers.common["Authorization"];
  }
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Добавляем интерцепторы для обновления токена
const addAuthInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/token/refresh/")
      ) {
        originalRequest._retry = true;
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
        isRefreshing = true;
        try {
          const refresh = localStorage.getItem("refreshToken");
          if (!refresh) {
            throw new Error("No refresh token available");
          }
          const { data } = await apiAuth.post("/token/refresh/", { refresh });
          const newToken = data.access;
          localStorage.setItem("accessToken", newToken);
          setAuthToken(newToken);
          processQueue(null, newToken);
          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return instance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(apiAuth);
addAuthInterceptor(apiEvents);

// Функция для логина по email и паролю
export const loginUser = async (email, password) => {
  const response = await apiAuth.post("/login/", { email, password });
  const { access, refresh } = response.data;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  setAuthToken(access);
  return response.data;
};

// Функция для регистрации нового пользователя
export const registerUser = async (email, password, navigate) => {
  try {
    await apiAuth.post("/register/", { email, password });
    navigate("/login");
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// Получение профиля пользователя
export const getUserProfile = async () => {
  return apiAuth.get("/users/me/");
};

// Обновление типа пользователя
export const setUserType = async (type) => {
  return apiAuth.patch("/users/me/", { user_type: type });
};

export const getUserType = async () => {
  const response = await getUserProfile();
  return response.data.user_type;
};

// Авторизация через Google
export const googleLogin = async (idToken) => {
  try {
    const response = await apiAuth.post("/google/", { token: idToken });
    const { access, refresh } = response.data;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setAuthToken(access);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Создание нового события (multipart/form-data)
export const createEvent = async (eventData) => {
  const response = await apiEvents.post("/", eventData);
  return response.data;
};

export { apiAuth, apiEvents };
