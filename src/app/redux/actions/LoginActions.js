import jwtAuthService from "../../services/jwtAuthService";
import { setUserData } from "./UserActions";
import history from "history.js";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const RESET_PASSWORD = "RESET_PASSWORD";

export const setAuthLoadingStatus = (status = false) => {
  return (dispatch) =>
    dispatch({
      type: LOGIN_LOADING,
      data: status,
    });
};

export function loginWithEmailAndPassword({ email, password }) {
  return (dispatch) => {
    return jwtAuthService
      .loginWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch(setUserData(user));

        return dispatch({
          type: LOGIN_SUCCESS,
        });
      })
      .catch((error) => {
        return dispatch({
          type: LOGIN_ERROR,
          payload: error,
        });
      });
  };
}

export function resetPassword({ email }) {
  return (dispatch) => {
    dispatch({
      payload: email,
      type: RESET_PASSWORD,
    });
  };
}
