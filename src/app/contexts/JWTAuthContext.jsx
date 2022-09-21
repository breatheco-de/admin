/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { createContext, useEffect, useReducer } from 'react';
import axios from 'axios.js';
import { MatxLoading } from 'matx';
import { toast } from 'react-toastify';
import bc from '../services/breathecode.js';
import { setUserData } from '../redux/actions/UserActions.js';
import { Store } from '../redux/Store';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

const isValidToken = async (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const res = await axios.get(`${Store.getState().host}/v1/auth/token/${accessToken}`);
  return res.status === 200;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Token ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      const { isAuthenticated, user, capabilities = [] } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        capabilities,
        user,
      };
    }
    case 'LOGIN': {
      const { user, capabilities = [] } = action.payload;

      return {
        ...state,
        capabilities,
        isAuthenticated: true,
        user,
      };
    }
    case 'CHOOSE': {
      const { role, academy, capabilities = [] } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        capabilities,
        user: { ...state.user, role, academy },
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        capabilities: [],
        user: null,
      };
    }
    case 'REGISTER': {
      const { user, capabilities = [] } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        capabilities,
        user,
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...initialState,
  method: 'Bearer',
  login: () => Promise.resolve(),
  logout: () => { },
  register: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    try {
      const res1 = await axios.bcPost('Login', `${Store.getState().host}/v1/auth/login/`, {
        email,
        password,
      });
      if (res1.status === 200) setSession(res1.data ? res1.data.token : res1.token);
      else throw res1.data;
    } catch (e) {
      const message = e.details || e.detail || Array.isArray(e.non_field_errors)
        ? e.non_field_errors[0]
        : 'Unable to login'; // res1.data.non_field_errors;
      console.error(e);
      throw Error(message);
    }
    let capabilities = [];
    const res2 = await axios.bcGet('User', `${Store.getState().host}/v1/auth/user/me`);
    const storedSession = JSON.parse(localStorage.getItem('bc-session'));
    if (!res2.data || res2.data.roles.length === 0) throw Error('You are not a staff member from any academy');
    else if (storedSession && typeof storedSession === 'object') {
      res2.data.role = storedSession.role;
      res2.data.academy = storedSession.academy;

      const resp = await bc.auth().getSingleRole(res2.data.role);
      capabilities = resp.data.capabilities;

    } else if (res2.data.roles.length === 1) {
      res2.data.role = res2.data.roles[0];
      res2.data.academy = res2.data.roles[0].academy;

      const resp = await bc.auth().getSingleRole(res2.data.role);
      capabilities = resp.data.capabilities;
    }

    setUserData(res2.data);
    dispatch({
      type: 'LOGIN',
      payload: {
        user: res2.data,
        capabilities,
      },
    });
  };

  const register = async (email, username, password) => {
    const response = await axios.post(`${Store.getState().host}/api/auth/register`, {
      email,
      username,
      password,
    });

    const { token, user } = response.data;

    setSession(token);
    setUserData(user);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const choose = ({ role, academy, capabilities }) => {
    setUserData({ ...state.user, role, academy, capabilities });
    axios.defaults.headers.common.Academy = academy.id;
    dispatch({ type: 'CHOOSE', payload: { role, academy, capabilities } });
  };

  useEffect(() => {
    (async () => {
      try {
        let accessToken = null;
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) accessToken = token;
        else accessToken = localStorage.getItem('accessToken');

        if (accessToken && (await isValidToken(accessToken))) {
          setSession(accessToken);
          const response = await axios.get(`${Store.getState().host}/v1/auth/user/me`);
          const user = response.data;
          let capabilities = [];
          const storedSession = JSON.parse(localStorage.getItem('bc-session'));
          if (!user || user.roles.length === 0) throw Error('You are not a staff member from any academy');
          else if (urlParams.has('location')) {
            const academyRole = user.roles.find((r) => r.academy.slug === urlParams.get('location'));
            if (!academyRole) throw Error(`You don't have access to academy ${urlParams.get('location')}`);
            else {
              user.role = academyRole;
              user.academy = academyRole.academy;
            }
          } else if (storedSession && typeof storedSession === 'object') {

            user.role = storedSession.role;
            user.academy = storedSession.academy;

            const resp = await bc.auth().getSingleRole(user.role);
            capabilities = resp.data.capabilities;

          } else if (user.roles.length === 1) {
            user.role = user.roles[0];
            user.academy = user.roles[0].academy;

            const resp = await bc.auth().getSingleRole(user.role);
            capabilities = resp.data.capabilities;

            localStorage.setItem(
              'bc-session',
              JSON.stringify({ role: user.role, academy: user.academy, capabilities }),
            );
          }
          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: true,
              capabilities,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: false,
              capabilities: [],
              user: null,
            },
          });
        }
      } catch (err) {
        toast.error(err.msg || err.message || err, toastOption);
        console.error(err);
        dispatch({
          type: 'INIT',
          payload: {
            isAuthenticated: false,
            capabilities: [],
            user: null,
          },
        });
      }
    })();
  }, []);

  if (!state.isInitialised) {
    return <MatxLoading />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'Bearer',
        login,
        logout,
        register,
        choose,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
