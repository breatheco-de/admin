import React from 'react';
import { ThemeProvider, useTheme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const SidenavTheme = ({ children }) => {
  const theme = useTheme();
  const { settings } = useSelector((state) => state.layout);
  const sidenavTheme = settings.themes[settings.layout1Settings.leftSidebar.theme] || theme;

  return <ThemeProvider theme={sidenavTheme}>{children}</ThemeProvider>;
};

export default SidenavTheme;
