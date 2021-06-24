import { OPEN, CLOSE } from '../actions/DialogActions';

const initialState = {
  show: false,
  value: {},
};

const DialogReducer = function (state = initialState, action) {
  switch (action.type) {
    case OPEN: {
      return {
        ...state,
        show: true,
        value: action.payload,
      };
    }
    case CLOSE: {
      return {
        ...state,
        show: false,
        value: {},
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default DialogReducer;
