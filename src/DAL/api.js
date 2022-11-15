import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: false,
  baseURL: 'http://localhost:8081/',
});

export const regula = {
  lastScan: () => axiosInstance.get(`last`),

  health: () => axiosInstance.get(`health`),

  stream: () => axiosInstance.get(`stream`),

  scanDocument: () => axiosInstance.get(`scan`),
};
