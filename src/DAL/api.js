import axios from 'axios';

import { App } from '../store';

const getAppConfig = () => {
  return App.getRawState().app.appConfig;
};

const { mainURL, regulaURL, rfidURL } = getAppConfig();

const axiosInstance = axios.create({
  withCredentials: false,
  baseURL: regulaURL,
  url: regulaURL,
});

export const regula = {
  lastScan: () => axiosInstance.get(`last`),

  health: () => axiosInstance.get(`health`),

  stream: () => axiosInstance.get(`stream`),

  scanDocument: () => axiosInstance.get(`scan`),
};

export const getRegulaLastScan = async () => {
  try {
    const getAppConfig = () => {
      return App.getRawState().app.appConfig;
    };

    const { regulaURL } = await getAppConfig();

    const res = await axios.get(`${regulaURL}last`);

    return res;
  } catch (e) {
    console.log(e);
  }
};

const mainAxiosInstance = axios.create({
  withCredentials: false,
  baseURL: mainURL,
});

export const face = {
  url: '',
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

export const searchPassByPhone = async phone => {
  try {
    const getAppConfig = () => {
      return App.getRawState().app.appConfig;
    };

    const { mainURL } = await getAppConfig();

    const res = await axios.get(`${mainURL}search/pass?phone=${phone}`);

    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const passport = {
  add: (data, id) => mainAxiosInstance.post(`visitor/${id}/passport`, data),
};

export const addPassport = async (data, id) => {
  try {
    const getAppConfig = () => {
      return App.getRawState().app.appConfig;
    };

    const { mainURL } = await getAppConfig();

    const res = await axios.post(`${mainURL}visitor/${id}/passport`, data);

    return res;
  } catch (e) {
    console.log(e);
  }
};

export const pass = {
  // card: () => mainAxiosInstance.post(`http://localhost:8082/card`),

  rfid: (id, rfid) =>
    mainAxiosInstance.patch(`pass/${id}/rfid`, {
      rfid,
    }),
};

export const linkRFID = async (id, rfid) => {
  try {
    const getAppConfig = () => {
      return App.getRawState().app.appConfig;
    };

    const { mainURL } = await getAppConfig();

    const res = await axios.patch(`${mainURL}pass/${id}/rfid`, {
      rfid,
    });

    return res;
  } catch (e) {
    console.log(e);
  }
};

export const photoPass = {
  find: data => mainAxiosInstance.post(`pass/face/coincidence`, data),
};

export const findPhotoByPass = async data => {
  try {
    const getAppConfig = () => {
      return App.getRawState().app.appConfig;
    };

    const { mainURL } = await getAppConfig();

    const res = await axios.post(`${mainURL}pass/face/coincidence`, data);

    return res;
  } catch (e) {
    console.log(e);
  }
};

const dispenserInstance = axios.create({
  withCredentials: false,
  baseURL: rfidURL,
});

export const dispenser = {
  card: () => dispenserInstance.post(`card`),
};

// export const getDispenserCard = () => {};
