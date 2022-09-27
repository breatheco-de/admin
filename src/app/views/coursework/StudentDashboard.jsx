import React, { useState, useEffect } from 'react';
import {
  Icon, IconButton, Hidden, useMediaQuery,
} from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import clsx from 'clsx';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { MatxSidenavContainer, MatxSidenav, MatxSidenavContent } from '../../../matx';
import axios from '../../../axios';
import UserProfileContent from './components/UserProfileContent';
import UserProfileSidenav from './components/UserProfileSidenav';
import { AsyncAutocomplete } from '../../components/Autocomplete';
import config from 'config.js';

const usestyles = makeStyles(() => ({
  headerBG: {
    height: 345,
    '@media only screen and (max-width: 959px)': {
      height: 400,
    },
  },
}));

const UserProfile = () => {
  const [open, setOpen] = useState(true);
  const { stdId } = useParams();
  const history = useHistory();
  const [profile, setProfile] = useState(stdId);
  const theme = useTheme();
  const classes = usestyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleSidenav = () => {
    setOpen(!open);
  };

  const getUser = (studentId) => {
    axios.get(`${config.REACT_APP_API_HOST}/v1/auth/academy/student/${studentId}`)
      .then((prof) => setProfile(prof));
  };

  useEffect(() => {
    if (stdId) getUser(stdId);
  }, []);

  useEffect(() => {
    if (isMobile) setOpen(false);
    else setOpen(true);
  }, [isMobile]);

  if (!profile) {
    return (
      <div>
        <AsyncAutocomplete
          width="100%"
          onChange={(newProfile) => {
            setProfile(newProfile);
            history.push(`/coursework/student/${profile.user.id}`);
          }}
          asyncSearch={(searchTerm) => axios.get(`${config.REACT_APP_API_HOST}/v1/auth/academy/student?like=${searchTerm}`)}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <MatxSidenavContainer>
        <MatxSidenav width="300px" open={open} toggleSidenav={toggleSidenav}>
          <div className={clsx('bg-primary text-right', classes.headerBG)}>
            <Hidden smUp>
              <IconButton onClick={toggleSidenav}>
                <Icon className="text-white">clear</Icon>
              </IconButton>
            </Hidden>
          </div>
          <UserProfileSidenav user={profile} />
        </MatxSidenav>
        <MatxSidenavContent open={open}>
          <div className={clsx('bg-primary', classes.headerBG)} />
          <UserProfileContent toggleSidenav={toggleSidenav} />
        </MatxSidenavContent>
      </MatxSidenavContainer>
    </div>
  );
};

export default UserProfile;
