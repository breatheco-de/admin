import React, { Fragment } from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { MatxVerticalNav } from 'matx';
import { setLayoutSettings } from 'app/redux/actions/LayoutActions';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { navigations } from '../../navigations';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  scrollable: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  sidenavMobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100vw',
    background: 'rgba(0, 0, 0, 0.54)',
    zIndex: -1,
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
}));

const Sidenav = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.layout);

  const updateSidebarMode = (sidebarSettings) => {
    const activeLayoutSettingsName = `${settings.activeLayout}Settings`;
    const activeLayoutSettings = settings[activeLayoutSettingsName];

    dispatch(
      setLayoutSettings({
        ...settings,
        [activeLayoutSettingsName]: {
          ...activeLayoutSettings,
          leftSidebar: {
            ...activeLayoutSettings.leftSidebar,
            ...sidebarSettings,
          },
        },
      }),
    );
  };

  return (
    <>
      <Scrollbar
        options={{ suppressScrollX: true }}
        className={clsx('relative px-4', classes.scrollable)}
      >
        {children}
        <MatxVerticalNav navigation={navigations} />
      </Scrollbar>

      <div
        onClick={() => updateSidebarMode({ mode: 'close' })}
        className={classes.sidenavMobileOverlay}
      />
    </>
  );
};

Sidenav.defaultProps = {
  children: null,
};
Sidenav.propTypes = {
  children: PropTypes.node,
};
export default Sidenav;
