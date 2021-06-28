import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { setLayoutSettings } from '../../redux/actions/LayoutActions';
import MatxCssVars from './MatxCssVars';

// import cssVars from "css-vars-ponyfill";

// eslint-disable-next-line react/prop-types
const MatxTheme = ({ children, settings }) => {
  const activeTheme = { ...settings.themes[settings.activeTheme] };
  // console.log(activeTheme);
  // cssVars();
  // activeTheme.direction = settings.direction;
  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <MatxCssVars>
        {' '}
        {children}
        {' '}
      </MatxCssVars>
    </ThemeProvider>
  );
};

MatxTheme.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  setLayoutSettings: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  settings: state.layout.settings,
  setLayoutSettings: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { setLayoutSettings })(MatxTheme);
