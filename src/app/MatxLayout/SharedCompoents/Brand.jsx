import React from "react";
import {MatxLogo} from "matx";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useSelector } from "react-redux";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  brand: {
    padding: "20px 18px 32px 24px",
  },
  hideOnCompact: {
    display: "none",
  },
}));

const Brand = ({ children }) => {
  const classes = useStyles();
  const { settings } = useSelector((state) => state.layout);
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <div className={clsx("flex items-center justify-between", classes.brand)}>
      <div className="flex items-center">
        {/* <img src="/assets/images/logo.png" alt="company-logo" /> */}
        <MatxLogo className="" />
        <span
          className={clsx({
            "text-18 ml-2 font-medium sidenavHoverShow": true,
            [classes.hideOnCompact]: mode === "compact",
          })}
        >
          Matx
        </span>
      </div>
      <div
        className={clsx({
          sidenavHoverShow: true,
          [classes.hideOnCompact]: mode === "compact",
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Brand;
