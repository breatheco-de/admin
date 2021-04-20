import bc from "../../services/breathecode";

export const GET_PRODUCT_LIST = "GET_PRODUCT_LIST";
export const GET_CATEGORY_LIST = "GET_CATEGORY_LIST";
export const UPLOAD_MEDIA_FILE = "UPLOAD_MEDIA_FILE";
export const UPDATE_MEDIA_FILE = "UPDATE_MEDIA_FILE";

export const getProductList = () => (dispatch) => {
   bc.media().getMedia().then(res => dispatch({
     type:GET_PRODUCT_LIST,
     payload:res.data
   }))
};

export const getCategoryList = () => (dispatch) => {
  bc.media().getAllCategories().then((res) => dispatch({
    type:GET_CATEGORY_LIST,
    payload:res.data
  }))
};

export const uploadFiles = (files) => (dispatch) => {
  const form = new FormData()
  for (const file of files) form.append('file', file, file.name);
  bc.media().upload(form).then((res) => dispatch({
    type: UPLOAD_MEDIA_FILE, 
    payload: res
  }))
} 

export const updateFileInfo = (id,values) => (dispatch) => {
  bc.media().updateMedia(id, values).then(res => dispatch({
    type:UPDATE_MEDIA_FILE,
    payload: res.data
  }))
}