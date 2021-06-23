import { startOfMinute } from "date-fns";
import {
  GET_PRODUCT_LIST,
  GET_CATEGORY_LIST,
  UPLOAD_MEDIA_FILE,
  UPDATE_MEDIA_FILE,
  DELETE_MEDIA_FILE,
  CREATE_CATEGORY,
  MEDIA_SELECTED,
  CLEAN_MEDIA_SELECTED
} from "../actions/MediaActions";

const initialState = {
  productList: [],
  categoryList: [],
  refresh: false,
  pagination: {},
  next: null,
  previous: null,
  selected: []
};

const MediaReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCT_LIST: {
      return {
        ...state,
        productList: [...action.payload.results],
        refresh: false,
        next: action.payload.next,
        previous:action.payload.previous,
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
        refresh: true,
      }
    }
    case CREATE_CATEGORY: {
      return {
        ...state,
        refresh: true
      }
    }
    case MEDIA_SELECTED: {
      return {
        ...state, 
        selected: action.payload
      }
    }
    case CLEAN_MEDIA_SELECTED: {
      return {
        ...state,
        selected:[]
      }
    }
    default: {
      return {
        ...state
      };
    }
  }
};

export default MediaReducer;
