/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { createContext, useEffect, useReducer } from 'react';
import axios from 'axios.js';
import { MatxLoading } from 'matx';
import { setUserData } from '../redux/actions/UserActions.js';

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

const isValidToken = async (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const res = await axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/token/${accessToken}`);
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
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
      };
    }
    case 'LOGIN': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    case 'CHOOSE': {
      const { role, academy } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user: { ...state.user, role, academy },
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    case 'REGISTER': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
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
  logout: () => {},
  register: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    try {
      const res1 = await axios._post('Login', `${process.env.REACT_APP_API_HOST}/v1/auth/login/`, {
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

    const res2 = await axios._get('User', `${process.env.REACT_APP_API_HOST}/v1/auth/user/me`);
    const storedSession = JSON.parse(localStorage.getItem('bc-session'));
    if (!res2.data || res2.data.roles.length === 0) throw Error('You are not a staff member from any academy');
    else if (storedSession && typeof storedSession === 'object') {
      res2.data.role = storedSession.role;
      res2.data.academy = storedSession.academy;
    } else if (res2.data.roles.length === 1) {
      res2.data.role = res2.data.roles[0];
      res2.data.academy = res2.data.roles[0].academy;
    }

    setUserData(res2.data);
    dispatch({
      type: 'LOGIN',
      payload: {
        user: res2.data,
      },
    });
  };

  const register = async (email, username, password) => {
    const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/auth/register`, {
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

  const choose = ({ role, academy }) => {
    setUserData({ ...state.user, role, academy });
    axios.defaults.headers.common.Academy = academy.id;
    dispatch({ type: 'CHOOSE', payload: { role, academy } });
  };

  useEffect(() => {
    (async () => {
      try {
        let accessToken = null;
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) accessToken = token;
        else accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && (await isValidToken(accessToken))) {
          setSession(accessToken);
          const response = await axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/user/me`);
          const user = response.data;
          const storedSession = JSON.parse(localStorage.getItem('bc-session'));
          if (!user || user.roles.length === 0) throw Error('You are not a staff member from any academy');
          else if (storedSession && typeof storedSession === 'object') {
            user.role = storedSession.role;
            user.academy = storedSession.academy;
          } else if (user.roles.length === 1) {
            user.role = user.roles[0];
            user.academy = user.roles[0].academy;
            localStorage.setItem(
              'bc-session',
              JSON.stringify({ role: user.role, academy: user.academy }),
            );
          }
          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INIT',
          payload: {
            isAuthenticated: false,
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
