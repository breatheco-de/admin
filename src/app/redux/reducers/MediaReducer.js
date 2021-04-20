import {
  GET_PRODUCT_LIST,
  GET_CATEGORY_LIST,
  UPLOAD_MEDIA_FILE,
  UPDATE_MEDIA_FILE
} from "../actions/MediaActions";

const initialState = {
  productList: [],
  categoryList: [],
};

const MediaReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCT_LIST: {
      return {
        ...state,
        productList: [...action.payload],
      };
    }
    case GET_CATEGORY_LIST: {
      return {
        ...state,
        categoryList: [...action.payload],
      };
    }
    case UPLOAD_MEDIA_FILE: {
      return {
        ...state
      }
    }
    case UPDATE_MEDIA_FILE: {
      return {
        ...state
      }
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default MediaReducer;
