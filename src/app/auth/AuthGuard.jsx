import React, { 
  useContext, 
  useEffect, 
  useState 
} from "react";
import { Redirect, useLocation } from "react-router-dom";
import AppContext from "app/appContext";
import useAuth from "app/hooks/useAuth";

const getUserRoleAuthStatus = (pathname, user, routes) => {
  const matched = routes.find((r) => r.path === pathname);

  const authenticated =
    matched && matched.auth && matched.auth.length
      ? matched.auth.includes(user.role)
      : true;
  console.log("matched and user: ", matched, user);
  return authenticated;
};

const AuthGuard = ({ children }) => {
  const {
    isAuthenticated,
    user
  } = useAuth();

  const { pathname } = useLocation();

  const { routes } = useContext(AppContext);
  const isUserRoleAuthenticated = getUserRoleAuthStatus(pathname, user, routes);
  let authenticated = isAuthenticated && isUserRoleAuthenticated;

  // IF YOU NEED ROLE BASED AUTHENTICATION,
  // UNCOMMENT ABOVE TWO LINES, getUserRoleAuthStatus METHOD AND user VARIABLE
  // COMMENT OUT BELOW LINE
//   let authenticated = isAuthenticated;

  const previouseRoute = isAuthenticated ? pathname : null;

  if(typeof user.academy !== "object"){
    return (
      <Redirect
        to={{
          pathname: "/session/choose",
          state: { redirectUrl: previouseRoute },
        }}
      />
    );
  }
  else if (authenticated) return <>{children}</>;
  else {
    return (
      <Redirect
        to={{
          pathname: "/session/signin",
          state: { redirectUrl: previouseRoute },
        }}
      />
    );
  }
};

export default AuthGuard;
