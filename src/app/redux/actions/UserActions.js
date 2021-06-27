import history from '../../../history';

export const SET_USER_DATA = 'USER_SET_DATA';
export const REMOVE_USER_DATA = 'USER_REMOVE_DATA';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const GET_USERS = 'GET_USERS';

export function setUserData(user) {
  return (dispatch) => {
    dispatch({
      type: SET_USER_DATA,
      data: user,
    });
  };
}

export function logoutUser() {
  return (dispatch) => {
    history.push({
      pathname: '/session/signin',
    });

    dispatch({
      type: USER_LOGGED_OUT,
    });
  };
}
