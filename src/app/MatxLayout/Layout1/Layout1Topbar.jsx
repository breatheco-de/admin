import React, { useEffect } from 'react';
import {
  Icon,
  IconButton,
  MenuItem,
  Avatar,
  Tooltip,
  useMediaQuery,
  Hidden,
  Switch,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { setLayoutSettings } from 'app/redux/actions/LayoutActions';
import { MatxMenu } from 'matx';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { merge } from 'lodash';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import useAuth from 'app/hooks/useAuth';
import history from 'history.js';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const useStyles = makeStyles(({ palette, ...theme }) => ({
  topbar: {
    top: 0,
    zIndex: 96,
    transition: 'all 0.3s ease',
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 44%, rgba(247, 247, 247, 0.4) 50%, rgba(255, 255, 255, 0))',

    '& .topbar-hold': {
      backgroundColor: palette.primary.main,
      height: 80,
      paddingLeft: 18,
      paddingRight: 20,
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 16,
        paddingRight: 16,
      },
      [theme.breakpoints.down('xs')]: {
        paddingLeft: 14,
        paddingRight: 16,
      },
    },
    '& .fixed': {
      boxShadow: theme.shadows[8],
      height: 64,
    },
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: 24,
    padding: 4,
    '& span': {
      margin: '0 8px',
      // color: palette.text.secondary
    },
    '&:hover': {
      backgroundColor: palette.action.hover,
    },
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 185,
  },
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { settings } = useSelector(({ layout }) => layout);
  const { logout, user } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));
  const fixed = settings?.layout1Settings?.topbar?.fixed;

  const updateSidebarMode = (sidebarSettings) => {
    dispatch(
      setLayoutSettings(
        merge({}, settings, {
          layout1Settings: {
            leftSidebar: {
              ...sidebarSettings,
            },
          },
        }),
      ),
    );
  };

  const updateSettings = (_settings) => {
    dispatch(
      setLayoutSettings(
        merge({}, settings, _settings),
      ),
    );
  };

  const handleSidebarToggle = () => {
    const { layout1Settings } = settings;
    let mode;

    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === 'close' ? 'mobile' : 'close';
    } else {
      mode = layout1Settings.leftSidebar.mode === 'full' ? 'close' : 'full';
    }

    updateSidebarMode({ mode });
  };
  return (
    <div className={classes.topbar}>
      <div className={clsx({ 'topbar-hold': true, fixed })}>
        <div className="flex justify-between items-center h-full">
          <div className="flex">
            <IconButton onClick={handleSidebarToggle} className="hide-on-pc">
              <Icon>menu</Icon>
            </IconButton>

          </div>
          <div className="flex items-center">
            {/* <MatxSearchBox /> */}

            {/* <NotificationBar />  */}

            <Tooltip title="Copy current URL for sharing">
              <IconButton onClick={() => {
                navigator.clipboard.writeText(window.location.href + (window.location.href.indexOf('?') >= 0 ? '' : '?') + `&location=${user.academy.slug}`);
                toast.success('Website url copied successfuly', toastOption);
              }}>
                <Icon>share</Icon>
              </IconButton>
            </Tooltip>

            <MatxMenu
              menuButton={(
                <div className={classes.userMenu}>
                  <Hidden xsDown>
                    <div>
                      <span>
                        Hi
                        {' '}
                        <strong>{user.first_name}</strong>
                      </span>
                      <small style={{fontSize: "8px"}} className="d-block mx-2">{user.academy?.name}</small>
                    </div>
                  </Hidden>
                  <Avatar className="cursor-pointer" src={user.profile?.avatar_url} />
                </div>
              )}
            >
              <MenuItem onClick={() => history.push('/session/choose', { redirectUrl: window.location.pathname })}>
                <div>
                  <p className="m-0">
                    Hi
                    {' '}
                    <strong>{user.first_name || 'No name'}</strong>
                  </p>
                  <p className="m-0 w-100"><small className="d-block">{user.academy?.name}</small></p>
                  <p className="m-0 w-100">
                    <small className="d-block">
                      Role:
                      {user.role.role || user.role}
                    </small>
                  </p>
                </div>
              </MenuItem>
              <MenuItem>
                <IconButton>
                  <Switch
                    onChange={() => console.log('settings', settings) || updateSettings({ beta: !settings.beta })}
                    checked={settings.beta}
                    color="secondary"
                    size="small"
                  />
                </IconButton>
                <span className="pl-4"> Beta features </span>
              </MenuItem>
              <MenuItem>
                <a className={classes.menuItem} href={`${process.env.REACT_APP_API_HOST}/v1/auth/github/${localStorage.getItem('accessToken')}?url=${window.location.href}`}>
                  <FontAwesomeIcon fontSize={"20px"} icon={faGithub} />
                  <span className="pl-4"> {user.github ? user.github.username : 'Connect Github'} </span>
                </a>
              </MenuItem>
              <MenuItem>
                <Link className={classes.menuItem} to="/">
                  <Icon> home </Icon>
                  <span className="pl-4"> Home </span>
                </Link>
              </MenuItem>
              {/* <MenuItem>
                 <Link
                className={classes.menuItem}
                to="/page-layouts/user-profile"
              >
                <Icon> person </Icon>
                <span className="pl-4"> Profile </span>
                </Link>
              </MenuItem>
              <MenuItem className={classes.menuItem}>
                <Icon> settings </Icon>
                <span className="pl-4"> Settings </span>
              </MenuItem> */}
              <MenuItem onClick={logout} className={classes.menuItem}>
                <Icon> power_settings_new </Icon>
                <span className="pl-4"> Logout </span>
              </MenuItem>
            </MatxMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout1Topbar;
