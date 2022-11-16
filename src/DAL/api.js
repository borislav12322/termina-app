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

const faceAxiosInstance = axios.create({
  withCredentials: false,
  baseURL: 'http://192.168.4.110:8000/api/v1/face/',
});

export const face = {
  compare: (face_one, face_two) =>
    faceAxiosInstance.post('compare', {
      face_one,
      face_two,
    }),
};

export const phone = {
  search: phone =>
    axiosInstance
      .get(`http://192.168.4.110:8000/api/v1/search/pass?phone=${phone}`)
      .then(res => res.data),
};
