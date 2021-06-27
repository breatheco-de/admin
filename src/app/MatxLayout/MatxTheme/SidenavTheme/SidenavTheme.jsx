import React from 'react';
import { ThemeProvider, useTheme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const SidenavTheme = ({ children }) => {
  const theme = useTheme();
  const { settings } = useSelector((state) => state.layout);
  const sidenavTheme = settings.themes[settings.layout1Settings.leftSidebar.theme] || theme;

  return <ThemeProvider theme={sidenavTheme}>{children}</ThemeProvider>;
};

SidenavTheme.defaultProps = {
  children: {},
};
SidenavTheme.propTypes = {
  children: PropTypes.node,
};

export default SidenavTheme;
