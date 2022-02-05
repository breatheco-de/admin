import React from 'react';
import {
  Avatar, Button, Card, Grid, Icon,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import useAuth from 'app/hooks/useAuth';

const usestyles = makeStyles(({ palette, ...theme }) => ({
  sidenav: {
    marginTop: -345,
    paddingTop: 74,
    [theme.breakpoints.down('sm')]: {
      marginTop: -410,
    },
  },
}));

const UserProfileSidenav = () => {
  const classes = usestyles();
  const { user } = useAuth();
  return (
    <div className={clsx('flex-column items-center', classes.sidenav)}>
      <Avatar className="h-84 w-84 mb-5" src="/assets/images/face-7.jpg" />
      <p className="text-white">{user.first_name}</p>
      <div className="py-3" />
      <div className="flex flex-wrap w-full px-12 mb-11">
        <div className="flex-grow">
          <p className="uppercase text-light-white mb-1">balance</p>
          <h4 className="font-medium text-white">$ 20,495</h4>
        </div>
        <div>
          <p className="uppercase text-light-white mb-1">points</p>
          <h4 className="font-medium text-white">PT 3,000</h4>
        </div>
        <div />
      </div>
      <div className="px-8 pt-2 bg-default">
        <Grid container spacing={3}>
          <Grid item>
            <Card className="w-104 h-104 bg-primary flex justify-center items-center">
              <div className="text-light-white text-center">
                <Icon>sentiment_very_satisfied</Icon>
                <br />
                <span className="pt-4">Dashboard</span>
              </div>
            </Card>
          </Grid>
          {shortcutList.map((item, ind) => (
            <Grid item key={ind}>
              <Card className="w-104 h-104 flex items-center justify-center">
                <div className="text-muted text-center">
                  <Icon>{item.icon}</Icon>
                  <br />
                  <span className="pt-4">{item.title}</span>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
        <div className="py-4" />
        <div className="flex items-center justify-center text-primary">
          <Button>
            <Icon>sentiment_very_satisfied</Icon>
            <h5 className="ml-8 text-primary font-medium mb-0">
              Upgrade to premium
            </h5>
          </Button>
        </div>
        <div className="py-2" />
      </div>
    </div>
  );
};

const shortcutList = [
  {
    title: 'stars',
    icon: 'star_outline',
  },
  {
    title: 'events',
    icon: 'email',
  },
  {
    title: 'Photo',
    icon: 'collections',
  },
  {
    title: 'settings',
    icon: 'brightness_7',
  },
  {
    title: 'contacts',
    icon: 'group',
  },
];

export default UserProfileSidenav;
