/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { toast } from 'react-toastify';
import { resolveResponse, resolveError } from './utils';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};
const axiosInstance = axios.create();
axiosInstance.scopes = {};
axiosInstance._put = () => {
  const [scopeName, url, ...rest] = arguments;
  this.scopes[url] = scopeName;
  return this.put(url, ...rest);
};

axiosInstance._post = () => {
  const [scopeName, url, ...rest] = arguments;
  this.scopes[url] = scopeName;
  return this.post(url, ...rest);
};

axiosInstance._get = () => {
  const [scopeName, url, ...rest] = arguments;
  this.scopes[url] = scopeName;
  return this.get(url, ...rest);
};

axiosInstance._delete = () => {
  const [scopeName, url, ...rest] = arguments;
  this.scopes[url] = scopeName;
  return this.delete(url, ...rest);
};
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    resolveResponse(response);
    return response;
  },
  (error) => {
    console.log(error.response);
    resolveError(error);
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong!',
    );
  },
);

axiosInstance.interceptors.request.use((response) => response, (error) => {
  toast.error('Something went wrong!', toastOption);
  return Promise.reject(error);
});

export default axiosInstance;
