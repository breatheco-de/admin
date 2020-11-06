import React, { useContext, useEffect, useRef, useCallback } from "react";
import { MatxLayouts } from "./index";
import { useLocation } from "react-router-dom";
import { matchRoutes } from "react-router-config";
import { useDispatch, useSelector } from "react-redux";
import AppContext from "app/appContext";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { isEqual, merge } from "lodash";
import { MatxSuspense } from "matx";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

const MatxLayoutSFC = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const appContext = useContext(AppContext);
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const settings = useSelector((state) => state.layout.settings);
  const defaultSettings = useSelector((state) => state.layout.defaultSettings);
  const ref = useRef({ appContext, isMdScreen, settings, defaultSettings });

  useEffect(() => {
    let { settings } = ref.current;

    if (settings.layout1Settings.leftSidebar.show) {
      let mode = isMdScreen ? "close" : "full";
      dispatch(
        setLayoutSettings(
          merge({}, settings, { layout1Settings: { leftSidebar: { mode } } })
        )
      );
    }
  }, [isMdScreen, dispatch]);

  const updateSettingsFromRouter = useCallback(() => {
    let { settings, defaultSettings, appContext, isMdScreen } = ref.current;
    const { routes } = appContext;
    const matched = matchRoutes(routes, pathname)[0];

    if (matched && matched.route.settings) {
      // ROUTE HAS SETTINGS
      let updatedSettings = merge({}, settings, matched.route.settings);

      if (!isEqual(settings, updatedSettings)) {
        dispatch(
          setLayoutSettings(
            isMdScreen
              ? merge({}, updatedSettings, {
                  layout1Settings: { leftSidebar: { mode: "close" } },
                })
              : updatedSettings
          )
        );
      }
    } else if (!isEqual(settings, defaultSettings)) {
      dispatch(
        setLayoutSettings(
          isMdScreen
            ? merge({}, defaultSettings, {
                layout1Settings: { leftSidebar: { mode: "close" } },
              })
            : defaultSettings
        )
      );
    }
  }, [pathname, dispatch]);

  useEffect(() => {
    updateSettingsFromRouter();
  }, [updateSettingsFromRouter]);

  const Layout = MatxLayouts[settings.activeLayout];

  return (
    <MatxSuspense>
      <Layout {...props} />
    </MatxSuspense>
  );
};

export default MatxLayoutSFC;
