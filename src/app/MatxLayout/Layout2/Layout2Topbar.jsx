import React from "react";
import { Icon, IconButton, Hidden, MenuItem, Avatar } from "@material-ui/core";
import { MatxMenu, MatxToolbarMenu, MatxSearchBox } from "matx";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { useDispatch, useSelector } from "react-redux";
import NotificationBar from "../SharedCompoents/NotificationBar";
import ShoppingCart from "../SharedCompoents/ShoppingCart";
import { makeStyles } from "@material-ui/core/styles";
import { logoutUser } from "app/redux/actions/UserActions";
import clsx from "clsx";
import { merge } from "lodash";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  root: {
    backgroundColor: palette.primary.main,
    borderColor: palette.divider,
    display: "table",
    height: "var(--topbar-height)",
    borderBottom: "1px solid transparent",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    zIndex: 98,
    paddingLeft: "1.75rem",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "1rem",
    },
  },
  brandText: {
    color: palette.primary.contrastText,
  },
  menuItem: {
    minWidth: 185,
  },
}));

const Layout2Topbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { settings } = useSelector(({ layout }) => layout);

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

  const handleSidebarToggle = () => {
    let { layout2Settings } = settings;

    let mode =
      layout2Settings.leftSidebar.mode === "close" ? "mobile" : "close";

    updateSidebarMode({ mode });
  };

  const handleSignOut = () => {
    dispatch(logoutUser());
  };

  return (
    <div className={clsx("relative w-full", classes.root)}>
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center h-full">
          <img
            className="h-32"
            src="/assets/images/logo.svg"
            alt="company-logo"
          />
          <span className={clsx("font-medium text-24 mx-4", classes.brandText)}>
            Matx
          </span>
        </div>
        <div className="mx-auto"></div>
        <div className="flex items-center">
          <MatxToolbarMenu offsetTop="80px">
            <MatxSearchBox />

            <NotificationBar />

            <ShoppingCart />

            <MatxMenu
              menuButton={
                <Avatar
                  className="cursor-pointer mx-2"
                  src="/assets/images/face-7.jpg"
                />
              }
            >
              <MenuItem className={classes.menuItem}>
                <Icon> home </Icon>
                <span className="pl-4"> Home </span>
              </MenuItem>
              <MenuItem className={classes.menuItem}>
                <Icon> person </Icon>
                <span className="pl-4"> Person </span>
              </MenuItem>
              <MenuItem className={classes.menuItem}>
                <Icon> settings </Icon>
                <span className="pl-4"> Settings </span>
              </MenuItem>
              <MenuItem onClick={handleSignOut} className={classes.menuItem}>
                <Icon> power_settings_new </Icon>
                <span className="pl-4"> Logout </span>
              </MenuItem>
            </MatxMenu>
          </MatxToolbarMenu>

          <Hidden mdUp>
            <IconButton className="text-white" onClick={handleSidebarToggle}>
              <Icon>menu</Icon>
            </IconButton>
          </Hidden>
        </div>
      </div>
    </div>
  );
};

export default Layout2Topbar;
