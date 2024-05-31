import axios from "axios";
import { handleError, handleResponse } from "./response";

export const BACKEND_URL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry && originalRequest.withCredentials) {
      originalRequest._retry = true;

      return axios.post(`${BACKEND_URL}/api/refresh`, {}, { withCredentials: true })
        .then(() => {
          // Retry the original request with refreshed cookies
          return axiosInstance(originalRequest);
        })
        .catch((refreshError) => {
          // Handle refresh token failure
          return Promise.reject(refreshError);
        });
    }

    return Promise.reject(error);
  }
);

export const fetcher = ([path, data = {}]) => get(path, data);

export const getFileData = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return { data: formData, headers: { "Content-Type": "multipart/form-data" } };
};

export const post = (path, data, withCredentials = true) =>
  axiosInstance
    .post(path, data, {
      withCredentials: withCredentials,
    })
    .then(handleResponse)
    .catch(handleError);

export const put = (path, data, withCredentials = true) =>
  axiosInstance
    .put(path, data, {
      withCredentials: withCredentials,
    })
    .then(handleResponse)
    .catch(handleError);

export const patch = (path, data, withCredentials = true) =>
  axiosInstance
    .patch(path, data, {
      withCredentials: withCredentials,
    })
    .then(handleResponse)
    .catch(handleError);

export const get = (path, data, withCredentials = true) => {
  return axiosInstance
    .get(path, {
      params: data,
      withCredentials: withCredentials,
    })
    .then(handleResponse)
    .catch(handleError);
};

export const remove = (path, withCredentials = true) =>
  axiosInstance
    .delete(path, {
      withCredentials: withCredentials,
    })
    .then(handleResponse)
    .catch(handleError);
