import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

const registerUser = async (email, password, navigate) => {
    try {
        await api.post("/users/", { email, password });
        navigate("/login");
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};
const registerUser____V2 = async (email, password, navigate) => {
    try {
        await api.post("/users/", { email, password });
        const tokens = await loginUser(email, password);
        navigate("/");
        return tokens;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

const loginUser = async (email, password) => {
    const response = await api.post("/token/jwt/create/", {
        email,
        password,
    });
    setAuthToken(response.data.access);
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
    return response.data;
};

const verifyToken = async (token) => {
    try {
        const response = await api.post("/token/jwt/verify/", { token });
        console.log("Токен валідний:", response.data);
        return true;
    } catch (error) {
        console.error(
            "Помилка верифікації токена:",
            error.response?.data || error.message
        );
        return false;
    }
};

const refreshToken = async () => {
    const refresh = localStorage.getItem("refreshToken");
    console.log("Маємо refreshToken:", refresh);

    if (!refresh) throw new Error("Немає refresh token'а!");

    try {
        const response = await api.post("/token/jwt/refresh/", { refresh });
        console.log("Оновлення токена успішне:", response.data.access);
        setAuthToken(response.data.access);
        localStorage.setItem("accessToken", response.data.access);
        return response.data.access;
    } catch (error) {
        console.error("Помилка під час оновлення токена:", error);
        throw error;
    }
};

const logoutUser = (navigate) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthToken(null);
    navigate("/login");
};

const getUserProfile = async () => {
    return api.get("/users/me/");
};

const updateUserProfile = async (data) => {
    return api.patch("/users/me/", data);
};

const authRequest = async (callback, navigate) => {
    let token = localStorage.getItem("accessToken");

    console.log("Перевіряємо accessToken:", token);

    if (!token || !(await verifyToken(token))) {
        console.warn("Access token недійсний. Пробуємо оновити...");

        try {
            token = await refreshToken();
            console.log("Новий accessToken отримано:", token);
        } catch (error) {
            console.error("Не вдалося оновити токен:", error);
            logoutUser(navigate);
            return;
        }
    }

    return callback();
};

export {
    registerUser,
    loginUser,
    refreshToken,
    verifyToken,
    getUserProfile,
    updateUserProfile,
    logoutUser,
    authRequest,
};
