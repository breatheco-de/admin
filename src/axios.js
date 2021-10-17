/* eslint-disable func-names */
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

axiosInstance.bcGet = function (...args) {
  const [scopeName, url, ...rest] = args;
  this.scopes[url] = scopeName;
  const resp = this.get(url, ...rest);
  return resp;
};

axiosInstance.bcPost = function (...args) {
  const [scopeName, url, ...rest] = args;
  this.scopes[url] = scopeName;
  const resp = this.post(url, ...rest);
  return resp;
};

axiosInstance.bcPut = function (...args) {
  const [scopeName, url, ...rest] = args;
  this.scopes[url] = scopeName;
  const resp = this.put(url, ...rest);
  return resp;
};

axiosInstance.bcDelete = function (...args) {
  const [scopeName, url, ...rest] = args;
  this.scopes[url] = scopeName;
  const resp = this.delete(url, ...rest);
  return resp;
};

function printAxiosResponse(object) {
  return;
  if (process.env.NODE_ENV === 'production') return;

  console.log('');
  console.log('');
  console.log('');

  console.log('Event:                    request');
  console.log('Resource type:            xhr');
  console.log(`Method:                   ${object.config.method.toUpperCase()}`);
  console.log(`Url:                      ${object.config.url}`);
  console.log('Xhr:                      ', object.request);
  console.log('Request headers:          ', object.config.headers);

  if (object.config.data) {
    try {
      console.log('Request body:             ', JSON.parse(object.config.data));
    } catch (_) {
      console.log('Request body:             ', object.config.data);
    }
  }

  console.log(`Response status code:     ${object.status}`);
  console.log('Response headers:         ', object.headers);
  if (object.data) console.log('Response body:            ', object.data);
}

axiosInstance.interceptors.response.use(
  (response) => {
    printAxiosResponse(response);
    resolveResponse(response);
    return response;
  },
  (error) => {
    printAxiosResponse(error.response);
    resolveError(error);
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong!',
    );
    return error.response;
  },
);

axiosInstance.interceptors.request.use(
  (response) => response,
  (error) => {
    toast.error('Something went wrong!', toastOption);
    return Promise.reject(error);
  },
);

// export default {
//   get: axiosInstance._get,
//   post: axiosInstance._post,
//   put: axiosInstance._put,
//   delete: axiosInstance._delete,
//   instance: axiosInstance,
// };
export default axiosInstance;
