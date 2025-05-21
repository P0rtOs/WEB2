// auth_api.ts

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import store from "./store";
import { setCurrentUser, clearCurrentUser } from "./features/authSlice";

export interface UserProfile {
  id: number;
  email: string;
  user_type: string;
  is_staff: boolean;
  [key: string]: any;
}

interface TokenResponse {
  access: string;
  refresh: string;
}

interface QRResponse {
  [key: string]: any;
}

interface FailedQueueItem {
  resolve: (token?: string) => void;
  reject: (error?: unknown) => void;
}

const API_AUTH_URL: string = "http://127.0.0.1:8000/api/auth";
const API_EVENTS_URL: string = "http://127.0.0.1:8000/api/events";
const API_ANALYTICS_URL: string = "http://127.0.0.1:8000/api/analytics";

export const apiAuth: AxiosInstance = axios.create({
  baseURL: API_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiEvents: AxiosInstance = axios.create({
  baseURL: API_EVENTS_URL,
});

export const apiAnalytics: AxiosInstance = axios.create({
  baseURL: API_ANALYTICS_URL,
});

let isRefreshing: boolean = false;
let failedQueue: FailedQueueItem[] = [];

export const setAuthToken = (token: string | null): void => {
  const headerName = "Authorization";
  if (token) {
    apiAuth.defaults.headers.common[headerName] = `Bearer ${token}`;
    apiEvents.defaults.headers.common[headerName] = `Bearer ${token}`;
    apiAnalytics.defaults.headers.common[headerName] = `Bearer ${token}`;
  } else {
    delete apiAuth.defaults.headers.common[headerName];
    delete apiEvents.defaults.headers.common[headerName];
    delete apiAnalytics.defaults.headers.common[headerName];
  }
};

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || undefined);
    }
  });
  failedQueue = [];
};

const addAuthInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<unknown> => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/token/refresh/")
      ) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken: string) => {
              if (originalRequest.headers) {
                originalRequest.headers["Authorization"] = "Bearer " + newToken;
              }
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;
        try {
          const refreshToken: string | null =
            localStorage.getItem("refreshToken");
          if (!refreshToken) {
            store.dispatch(clearCurrentUser());
            setAuthToken(null);
            return Promise.reject(error);
          }

          const refreshResponse: AxiosResponse<TokenResponse> =
            await apiAuth.post<TokenResponse>("/token/refresh/", {
              refresh: refreshToken,
            });

          const newAccessToken: string = refreshResponse.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          setAuthToken(newAccessToken);
          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] =
              "Bearer " + newAccessToken;
          }
          return instance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setAuthToken(null);
          store.dispatch(clearCurrentUser());
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

const addProfileInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
      if (config.url?.includes("/users/me/")) {
        return config;
      }
      try {
        const profileResponse: AxiosResponse<UserProfile> =
          await apiAuth.get<UserProfile>("/users/me/");
        store.dispatch(setCurrentUser(profileResponse.data));
      } catch {
        store.dispatch(clearCurrentUser());
      }
      return config;
    },
    (error: any): Promise<unknown> => Promise.reject(error)
  );
};

addAuthInterceptor(apiAuth);
addAuthInterceptor(apiEvents);
addAuthInterceptor(apiAnalytics);

addProfileInterceptor(apiEvents);
addProfileInterceptor(apiAnalytics);

export const loginUser = async (
  email: string,
  password: string
): Promise<TokenResponse> => {
  const response: AxiosResponse<TokenResponse> =
    await apiAuth.post<TokenResponse>("/login/", { email, password });
  const { access, refresh } = response.data;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  setAuthToken(access);
  return response.data;
};

export const registerUser = async (
  email: string,
  password: string,
  navigate: (path: string) => void
): Promise<void> => {
  await apiAuth.post("/register/", { email, password });
  navigate("/login");
};

export const generateQR = async (
  registrationId: number,
  holderName: string
): Promise<QRResponse> => {
  const response: AxiosResponse<QRResponse> = await apiEvents.post<QRResponse>(
    `/my-registrations/${registrationId}/generate-qr/`,
    { qr_holder_name: holderName }
  );
  return response.data;
};

export async function openTicketPdf(registrationId: number): Promise<void> {
  const response: AxiosResponse<Blob> = await apiEvents.get(
    `/my-registrations/${registrationId}/ticket/`,
    {
      responseType: "blob",
    }
  );
  const blobUrl: string = window.URL.createObjectURL(response.data);
  window.open(blobUrl, "_blank");
}

export const getUserProfile = async (): Promise<AxiosResponse<UserProfile>> => {
  return apiAuth.get<UserProfile>("/users/me/");
};

export const setUserType = async (
  type: string
): Promise<AxiosResponse<UserProfile>> => {
  return apiAuth.patch<UserProfile>("/users/me/", { user_type: type });
};

export const getUserType = async (): Promise<string> => {
  const profileResponse: AxiosResponse<UserProfile> = await getUserProfile();
  return profileResponse.data.user_type;
};

export const toggleAdmin = async (): Promise<AxiosResponse<any>> => {
  const response: AxiosResponse<any> = await apiAuth.patch("/toggle-admin/");
  return response;
};

export const createEvent = async (eventData: FormData): Promise<any> => {
  const response: AxiosResponse<any> = await apiEvents.post("/", eventData);
  return response.data;
};

export const googleLogin = async (idToken: string): Promise<TokenResponse> => {
  const response: AxiosResponse<TokenResponse> =
    await apiAuth.post<TokenResponse>("/google/", { token: idToken });
  const { access, refresh } = response.data;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  setAuthToken(access);
  return response.data;
};
