import React, { createContext, useEffect, useReducer } from "react";
import axios from "axios.js";
import { MatxLoading } from "matx";

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

const isValidToken = async (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const res = await axios.get(process.env.REACT_APP_API_HOST+"/v1/auth/token/"+accessToken);
  return res.status === 200
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common['Authorization'] = `Token ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common['Authorization'];
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
      };
    }
    case "LOGIN": {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    case "REGISTER": {
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
  method: "Bearer",
  login: () => Promise.resolve(),
  logout: () => {},
  register: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    
    try{

        const res1 = await axios.post(process.env.REACT_APP_API_HOST+"/v1/auth/login/", { email, password });
        setSession(res1.data.token);
    }
    catch(e){
        const message = e.details || Array.isArray(e.non_field_errors) ? e.non_field_errors[0] : "Unable to login";//res1.data.non_field_errors;
        throw Error(message)
    }
    
    const res2 = await axios.get(process.env.REACT_APP_API_HOST+"/v1/auth/user/me");
    

    dispatch({
      type: "LOGIN",
      payload: {
        user: res2.data,
      },
    });
  };

  const register = async (email, username, password) => {
    const response = await axios.post(process.env.REACT_APP_API_HOST+"/api/auth/register", {
      email,
      username,
      password,
    });
    
    const { token, user } = response.data;

    setSession(token);
    
    dispatch({
      type: "REGISTER",
      payload: {
        user,
      },
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    (async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && await isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get(process.env.REACT_APP_API_HOST+"/v1/auth/user/me");
          const user = response.data;

          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INIT",
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
        method: "Bearer",
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
