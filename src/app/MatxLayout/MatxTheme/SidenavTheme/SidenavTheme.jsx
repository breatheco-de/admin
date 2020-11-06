import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";

const SidenavTheme = ({ children }) => {
  const theme = useTheme();
  const { settings } = useSelector((state) => state.layout);
  const sidenavTheme =
    settings.themes[settings.layout1Settings.leftSidebar.theme] || theme;

  return <ThemeProvider theme={sidenavTheme}>{children}</ThemeProvider>;
};

export default SidenavTheme;
