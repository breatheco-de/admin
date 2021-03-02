import axios from "axios";
import { toast } from 'react-toastify';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose:8000
}
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
  console.log(response)
  if(response.config.method !== "get"){
    if(response.status == 200) toast.success('Submission Successfull', toastOption)
  }
   return response
  },
  (error) =>{
  if(typeof error.response.data === "object"){
    for(let item in error.response.data){
       if(Array.isArray(error.response.data[item])){
         for(let str of error.response.data[item]){
           toast.error(`${item.toUpperCase()}: ${str}`, toastOption);
         }
       }
    }
  } else toast.error(error.response.data.detail || 'Something went wrong!') 
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!"
    )}
);

axiosInstance.interceptors.request.use(response => {
 return response
}, error =>{
  console.log(error)
  return Promise.reject(error)
})

export default axiosInstance;
