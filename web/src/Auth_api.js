// Auth_api.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// -----------------------------------------------------------------------------
// Create axios instances
// -----------------------------------------------------------------------------

// Main axios instance for API calls.
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// A separate axios instance for refresh calls.
// This instance does NOT have interceptors, so it won’t run into an infinite loop.
const refreshClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------------------------------------------------------
// Helper Function to Set the Authorization Header
// -----------------------------------------------------------------------------

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// -----------------------------------------------------------------------------
// Axios Interceptors
// -----------------------------------------------------------------------------

// Request Interceptor: Attach the latest access token from localStorage to every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: On a 401 error, try to refresh the token and then retry the request.
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If a 401 error is returned, and the request hasn’t been retried, and it’s not the refresh endpoint:
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/token/jwt/refresh/")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If a refresh is in progress, queue this request.
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refresh = localStorage.getItem("refreshToken");
        if (!refresh) {
          throw new Error("No refresh token available");
        }

        // Use refreshClient (without interceptors) for the token refresh call.
        const { data } = await refreshClient.post("/token/jwt/refresh/", {
          refresh,
        });
        const newToken = data.access;

        // Store and set the new token.
        localStorage.setItem("accessToken", newToken);
        setAuthToken(newToken);

        // Update the original request with the new token.
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return api(originalRequest);
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

// -----------------------------------------------------------------------------
// API Functions
// -----------------------------------------------------------------------------

export const loginUser = async (email, password) => {
  const response = await api.post("/token/jwt/create/", { email, password });
  const { access, refresh } = response.data;

  // Save tokens to localStorage.
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);

  // Set the token on our axios instance.
  setAuthToken(access);

  return response.data;
};

// Register: Create a new user then navigate to login.
export const registerUser = async (email, password, navigate) => {
  try {
    await api.post("/users/", { email, password });
    // After successful registration, navigate to login.
    navigate("/login");
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  return api.get("/users/me/");
};

export const setUserType = async (type) => {
  return api.patch("/users/me/", { user_type: type });
};

// In Auth_api.js, you can add:
export const getUserType = async () => {
  const response = await getUserProfile();
  return response.data.user_type;
};

export const googleLogin = async (idToken) => {
  try {
    // Обратите внимание, что endpoint для Google логина находится вне /api
    const response = await axios.post("http://127.0.0.1:8000/auth/google/", {
      token: idToken,
    });
    // Извлекаем токены из ответа
    const { access, refresh } = response.data;
    // Сохраняем токены в localStorage и обновляем заголовок авторизации
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    setAuthToken(access);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export the axios instance if needed.
export { api };
