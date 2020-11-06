import React, { Fragment, useContext } from "react";

import { ThemeProvider } from "@material-ui/core/styles";
import { Hidden } from "@material-ui/core";
import AppContext from "app/appContext";
import Footer from "../SharedCompoents/Footer";
import Layout2Navbar from "./Layout2Navbar";
import Layout2Topbar from "./Layout2Topbar";
import Scrollbar from "react-perfect-scrollbar";
import SecondarySidebar from "../SharedCompoents/SecondarySidebar/SecondarySidebar";
import { renderRoutes } from "react-router-config";
import { useTheme } from "@material-ui/styles";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { layout2Styles } from "app/MatxLayout/Layout2/_layout2";
import SidenavTheme from "../MatxTheme/SidenavTheme/SidenavTheme";
import Layout1Sidenav from "../Layout1/Layout1Sidenav";

const Layout2 = () => {
  // import layout2 styels
  layout2Styles();

  const theme = useTheme();
  const { routes } = useContext(AppContext);
  const { settings } = useSelector(({ layout }) => layout);

  let { layout2Settings } = settings;
  let topbarTheme = settings.themes[layout2Settings.topbar.theme];
  let navbarTheme = settings.themes[layout2Settings.navbar.theme];
  const {
    leftSidebar: { mode: sidenavMode, show: showSidenav },
  } = layout2Settings;

  let layoutClasses = {
    [settings.activeLayout]: true,
    "bg-default text-primary": true,
    [`sidenav-${layout2Settings.leftSidebar.mode}`]: true,
    [`layout-${layout2Settings.mode} theme-${theme.palette.type}`]: true,
  };

  return (
    <Fragment>
      <div
        className={clsx(
          layoutClasses,
          "flex-grow flex-column relative overflow-hidden h-full-screen"
        )}
      >
        {layout2Settings.topbar.show && (
          <ThemeProvider theme={topbarTheme}>
            <Layout2Topbar />
          </ThemeProvider>
        )}

        <Hidden smDown>
          {layout2Settings.navbar.show && (
            <ThemeProvider theme={navbarTheme}>
              <Layout2Navbar />
            </ThemeProvider>
          )}
        </Hidden>

        {showSidenav && sidenavMode !== "close" && (
          <SidenavTheme>
            <Layout1Sidenav />
          </SidenavTheme>
        )}

        {settings.perfectScrollbar && (
          <Scrollbar
            options={{ suppressScrollX: true }}
            className="flex-column flex-grow relative"
          >
            <div className="flex-grow relative p-0">{renderRoutes(routes)}</div>
            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </Scrollbar>
        )}

        {!settings.perfectScrollbar && (
          <div
            options={{ suppressScrollX: true }}
            className="flex-column flex-grow relative scroll-y p-0"
          >
            <div className="flex-grow relative p-0">{renderRoutes(routes)}</div>
            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </div>
        )}

        {settings.footer.show && settings.footer.fixed && <Footer />}
      </div>
      {settings.secondarySidebar.show && <SecondarySidebar />}
    </Fragment>
  );
};

export default Layout2;
