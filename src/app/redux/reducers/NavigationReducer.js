import { navigations } from '../../navigations';
import { SET_USER_NAVIGATION } from '../actions/NavigationAction';

const initialState = [...navigations];

const NavigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NAVIGATION: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default NavigationReducer;
