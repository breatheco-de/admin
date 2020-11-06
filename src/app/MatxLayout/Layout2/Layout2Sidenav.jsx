import React, { useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { useLocation } from "react-router-dom";
import Sidenav from "../SharedCompoents/Sidenav";
import Brand from "../SharedCompoents/Brand";
import SidenavTheme from "../MatxTheme/SidenavTheme/SidenavTheme";
import { useMediaQuery } from "@material-ui/core";
import { merge } from "lodash";

const Layout2Sidenav = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { pathname } = useLocation();
  const { settings } = useSelector(({ layout }) => layout);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sidenavTheme =
    settings.themes[settings.layout2Settings.leftSidebar.theme] || theme;

  const updateSidebarMode = (sidebarSettings) => {
    dispatch(
      setLayoutSettings(
        merge({}, settings, {
          layout2Settings: {
            leftSidebar: {
              ...sidebarSettings,
            },
          },
        })
      )
    );
  };

  useEffect(() => {
    if (isMobile) updateSidebarMode({ mode: "close" });
  }, [pathname]);

  return (
    <SidenavTheme theme={sidenavTheme} settings={settings}>
      <div className="sidenav">
        <div className="sidenav__hold">
          <Brand />
          <Sidenav />
        </div>
      </div>
    </SidenavTheme>
  );
};

export default Layout2Sidenav;
