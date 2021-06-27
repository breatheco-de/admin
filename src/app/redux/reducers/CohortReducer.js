// import { AccordionActions } from '@material-ui/core';
import {
  // COHORT_GET_USERS,
  // COHORT_REMOVE_USER,
  COHORT_ADD_USER,
  // COHORT_UPDATE_USER_INFO,
  // GET_COHORT,
} from '../actions/CohortActions';

const initialState = {};

const CohortReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case COHORT_ADD_USER: {
      return {
        ...state,
        status: { ...actions.payload },
      };
    }
    default:
      return { ...state };
  }
};

export default CohortReducer;
