import "../index.css";
import "../fake-db";
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import MatxTheme from "./MatxLayout/MatxTheme/MatxTheme";
import AppContext from "./appContext";
import history from "history.js";

import routes from "./RootRoutes";
import { Store } from "./redux/Store";
import { GlobalCss, MatxSuspense } from "matx";
import sessionRoutes from "./views/sessions/SessionRoutes";
import { AuthProvider } from "app/contexts/JWTAuthContext";
import MatxLayout from "./MatxLayout/MatxLayoutSFC";
import AuthGuard from "./auth/AuthGuard";

const App = () => {
  return (
    <AppContext.Provider value={{ routes }}>
      <Provider store={Store}>
        <MatxTheme>
          <GlobalCss>
            <Router history={history}>
              <AuthProvider>
                <MatxSuspense>
                  <Switch>
                    {/* AUTHENTICATION PAGES */}
                    {sessionRoutes.map((item, ind) => (
                      <Route
                        key={ind}
                        path={item.path}
                        component={item.component}
                      />
                    ))}

                    {/* AUTH PROTECTED PAGES */}
                    <AuthGuard>
                      <MatxLayout />
                    </AuthGuard>
                  </Switch>
                </MatxSuspense>
              </AuthProvider>
            </Router>
          </GlobalCss>
        </MatxTheme>
      </Provider>
    </AppContext.Provider>
  );
};

export default App;
