import { Session } from "next-auth";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";
// Set config defaults when creating the instance

const baseURL: string = "https://api-booking-event.herokuapp.com";
const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Accept: "application/json",
    ContentType: "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    const session = await getSession();
    if (session) {
      // @ts-ignore
      config.headers["Authorization"] = "Bearer " + session.accessToken;
      // @ts-ignore
      config.headers["Content-Type"] = "application/json";
      // @ts-ignore
      config.headers["Accept"] = "application/json";
    }
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // get response error code

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export default instance;
// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
