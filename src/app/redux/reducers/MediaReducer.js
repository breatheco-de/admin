import {
  GET_PRODUCT_LIST,
  GET_CATEGORY_LIST,
  UPLOAD_MEDIA_FILE,
  UPDATE_MEDIA_FILE,
  DELETE_MEDIA_FILE,
  CREATE_CATEGORY
} from "../actions/MediaActions";

const initialState = {
  productList: [],
  categoryList: [],
  refresh: false,
  pagination: {}
};

const MediaReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCT_LIST: {
      return {
        ...state,
        productList: [...action.payload.results],
        refresh: false,
        pagination: action.payload.pagination
      };
    }
    case GET_CATEGORY_LIST: {
      return {
        ...state,
        categoryList: [...action.payload]
      };
    }
    case UPLOAD_MEDIA_FILE: {
      return {
        ...state,
        refresh: true
      }
    }
    case UPDATE_MEDIA_FILE: {
      return {
        ...state,
        refresh: true
      }
    }
    case DELETE_MEDIA_FILE: {
      return {
        ...state,
        refresh: true
      }
    }
    case CREATE_CATEGORY: {
      return {
        ...state,
        refresh: true
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
