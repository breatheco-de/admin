import axios from 'axios';

export const COHORT_GET_USERS = 'COHORT_GET_USERS';
export const COHORT_REMOVE_USER = 'COHORT_REMOVE_USER';
export const COHORT_ADD_USER = 'COHORT_ADD_USER';
export const COHORT_UPDATE_USER_INFO = 'COHORT_UPDATE_USER_INFO';
export const GET_COHORT = 'GET_COHORT';

export const addUserToCohort = (cohortId, userId) => (dispatch) => {
  axios.post(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${cohortId}/user`, {
    user: userId,
    role: 'STUDENT',
    finantial_status: null,
    educational_status: 'ACTIVE',
  }).then((data) => {
    console.log('executed');
    dispatch({
      type: COHORT_ADD_USER,
      payload: data,
    });
  }).catch((error) => {
    console.log(error, 'Error ');
  });
};

export const getCohortUsers = () => {

};

export const deleteUser = () => {

};

export const getCohort = () => {

};

export const updateCohortUserInfo = () => {

};
