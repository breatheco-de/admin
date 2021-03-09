import axios from "axios";

export const GET_PRODUCT_LIST = "GET_PRODUCT_LIST";
export const GET_CATEGORY_LIST = "GET_CATEGORY_LIST";

export const getProductList = () => (dispatch) => {
  axios.get("/api/ecommerce/get-product-list").then((res) => {
    dispatch({
      type: GET_PRODUCT_LIST,
      payload: res.data,
    });
  });
};

export const getCategoryList = () => (dispatch) => {
  axios.get("/api/ecommerce/get-category-list").then((res) => {
    dispatch({
      type: GET_CATEGORY_LIST,
      payload: res.data,
    });
  });
};
