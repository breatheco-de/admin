import axios from "axios";
import { toast } from 'react-toastify';
import {resolveResponse, resolveError} from "./utils";

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000
}
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
  console.log(response)
  resolveResponse(response);
  return response
},
  (error) => {
    console.log(error.response)
    resolveError(error);
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!"
    )
  }
);

axiosInstance.interceptors.request.use(response => {
  return response
}, error => {
  toast.error('Something went wrong!', toastOption);
  return Promise.reject(error)
})

export default axiosInstance;
