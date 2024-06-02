import axios from "axios";
import { handleError, handleResponse } from "./response";

export const BACKEND_URL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

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
