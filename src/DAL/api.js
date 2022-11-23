import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: false,
  baseURL: `http://localhost:${
    process.env.NODE_ENV === 'development' ? '8081' : '8080'
  }/`,
});

export const regula = {
  lastScan: () => axiosInstance.get(`last`),

  health: () => axiosInstance.get(`health`),

  stream: () => axiosInstance.get(`stream`),

  scanDocument: () => axiosInstance.get(`scan`),
};

const mainAxiosInstance = axios.create({
  withCredentials: false,
  baseURL: `http://192.168.4.113:8000/api/v1/`,
});

export const face = {
  compare: (face_one, face_two, visitor_id) =>
    mainAxiosInstance.post('face/compare', {
      face_one,
      face_two,
      visitor_id,
    }),
};

export const phone = {
  search: phone =>
    mainAxiosInstance.get(`search/pass?phone=${phone}`).then(res => res.data),
};

export const passport = {
  add: (data, id) => mainAxiosInstance.post(`visitor/${id}/passport`, data),
};

export const pass = {
  // card: () => mainAxiosInstance.post(`http://localhost:8082/card`),

  rfid: (id, rfid) =>
    mainAxiosInstance.patch(`pass/${id}/rfid`, {
      rfid,
    }),
};

export const photoPass = {
  find: data => mainAxiosInstance.post(`pass/face/coincidence`, data),
};

const dispenserInstance = axios.create({
  withCredentials: false,
  baseURL: `http://localhost:8082/`,
});

export const dispenser = {
  card: () => dispenserInstance.post(`card`),
};
