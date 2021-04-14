import {
  GET_PRODUCT_LIST,
  GET_CATEGORY_LIST,
} from "../actions/MediaActions";

const initialState = {
  productList: [
      { title: "Media example", imgUrl: "https://www.pixelstalk.net/wp-content/uploads/2016/07/HD-Black-Horse-Image.jpg", category: { title: "Horses"}, description: "asdasd" }
  ],
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
    default: {
      return {
        ...state,
      };
    }
  }
};

export default MediaReducer;
